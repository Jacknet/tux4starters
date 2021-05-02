const mariadb = require("mariadb");
const express = require("express");
var path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
const {connect} = require("http2");
const nodemon = require("nodemon");
require("dotenv").config()
var crypto = require('crypto');
//this is for node1
const pool = mariadb.createPool({
  host: process.env.MD_HOST,
  user: process.env.MD_USER,
  password: process.env.MD_PASSWORD,
  port: process.env.MD_PORT,
  database: process.env.MD_DATABASE,  
  acquireTimeout: '10000' //set timeout to 40 seconds to avoid it crashing if the connection is slow
  //connectionLimit: 5,
  //multipleStatements : true
});

//-----------below are couple different ways to make connection and 
//-----------perform a query on the database


//this one uses promises. this does not need to be called, it runs at runtime.
/*
//------------------------------------------
mariadb.createConnection({
  host: process.env.MD_HOST,
  user: process.env.MD_USER,
  password: process.env.MD_PASSWORD,
  port: process.env.MD_PORT,
  database: process.env.MD_DATABASE  
})
.then(conn => {
  conn.query("select * from users")
      .then(rows => {
          console.log(rows);
          conn.end();
      })
      .catch(err => {
          //handle query error
      });
})
.catch(err => {
  //handle connection error
});
//----------------------------------------------
*/

//this one uses an async and await function. this function must be called for it to be executed. 
//------------------------------------------------
/*
async function connectToDB() {
    let conn;
    //console.log("THIS IS NODE 1");
    try {
        conn = await pool.getConnection()
        const rows = await conn.query("SELECT * from users");
        console.log(rows);

        // return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            return conn.end();
        }
    }
}
*/
//-------------------------------------------------------


let options = {
  dotfiles: "ignore", //possible values (allow, deny, ignore)
  etag: true,
  extensions: ["htm", "html"],
  index: false,
  redirect: false 
}


let md = mariadb.createConnection({
  host: process.env.MD_HOST,
  user: process.env.MD_USER,
  password: process.env.MD_PASSWORD,
  port: process.env.MD_PORT,
  database: process.env.MD_DATABASE  
})
//Middleware
app.use(express.static("../tux4starters", options));
const exJson = app.use('/', express.json());

//for registration
app.post('/register',(req,res) => {

md.then(conn =>{

      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const saltRounds = 10; //this should allow ~10 hashes a sec
     
      if(username && email && password){
      //first check if the username or email already exists
      conn.query(`select username, email from users where username = "${username}" or email = "${email}"; `)
      .then(rows => {
        conn.end;
        if(rows[0]){
          res.send({message:"Username or Email already exists! Please try again..."});
        }
        else{
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              conn.query(`insert into users values ("${username}","${email}","${hash}");`)
              .then(rows =>{
                conn.end;
                console.log(rows);
                //res.sendFile(path.join(__dirname + '../../index.html'));
                //res.redirect("../../index.html")  //this is to redirect the user to a page - does not work atm. 
                res.send({message:"Successfully registered! Please login"})
              }).catch(err =>{
                console.log("ERROR = "+err)
              })
              
              
            });
          }); 
        }
      })
    }

}).catch(err =>{
  console.log(err);
});

})

//for signing in
app.post('/signin', urlencodedParser, (req, res) => {
  try {
      md.then(conn => {
          const username = req.body.username;
          const password = req.body.password;
          let hashPassword = "";

          conn.query(`select convert(password using utf8) as password from users where username = "${username}";`)
              .then(rows => {

                  hashPassword = rows[0].password;
                  conn.end;

                  checkUser(username, password, hashPassword);

                  async function checkUser(username, password, hashPassword) {
                      const match = await bcrypt.compare(password, hashPassword);
                      console.log("match = " + match);
                      if (match) {
                          let sessionId = crypto.randomBytes(24).toString('hex') //"e4bbd030d578ce1148b75763d1040dd556a65f476dbff5f7"
                          let doesExist = false
                          do {
                              await conn.query(`select sessionId from users where sessionId = "${sessionId}";`)
                                  //conn.query(`update users set sessionId = "${sessionId}" where username = "${username}";`)
                                  .then(row => {
                                      conn.end;
                                      let result = JSON.stringify(row)
                                      console.log(row)
                                      console.log(result.length)
                                      if (result.length <= 2) {
                                        console.log("sessionId not exists")
                                        doesExist = false  
                                        res.send({sessionId: sessionId}) 
                                      }
                                      else{
                                          
                                        console.log("exists "+sessionId)
                                        sessionId = crypto.randomBytes(24).toString('hex')
                                        console.log("new "+sessionId)
                                        doesExist = true  
                                      }

                                  }).catch(err => {
                                      console.log(err)
                                  }) 
                          } while (doesExist)
                          
                      } else {
                          res.send({message: "Incorrect Password or Username"})
                      }

                  }
              }).catch(err => {
                  console.log("ERROR = " + err);
              })
      }).catch(err => {
          console.log(err);
      });
  } catch (err) {
      throw err;
  }

})

//check if the session is still active

app.post("/check-session",urlencodedParser, (req, res) =>{
  try{
    md.then(conn => {
      const sessionId = req.body
      console.log("sessionId "+ sessionId)
      conn.query(`select sessionId where sessionId = "${sessionId}"`)
      .then(row =>{
        conn.end;
        let result = JSON.stringify(row)
        if(result.length >= 2){
          console.log("sessionId exists")
          res.send("OK");
        }
        else{
          console.log("sessionId does not exists")
          res.send("Not Found")
        }
      })
    })

  }
  catch(err){
    throw err;
  }
})

//user progression tracking

app.post("/post",urlencodedParser, (req, res) =>{

})



/*
app.post("/forgot", (req, res) => {
  const thisEmail = getEmail(req.body.email);
  if (thisEmail){
    const id = uuidv1();
    const request = {
      id,
      email: thisEmail.email,
    };
    createResetRequest(requset);
    sendResentLink(thisUser.email, id);
  }
  res.status(200).json();
});
*/
app.get('/', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../index.html'));
  //res.render('index')
});
app.get('/about.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../about.html'));
});
app.get('/resources.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../resources.html'));
});
app.get('/help.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../help.html'));
});
app.get('/signin.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../signin.html'));
});
app.get('/register.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../register.html'));
});

app.get('/demolesson1/index.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../demolesson1/index.html'));
});
app.get('/demolesson1/MultipleChoiceTemp.html', (req, res) => {
  //res.send("some texts");
  res.sendFile(path.join(__dirname + '../../demolesson1/MultipleChoiceTemp.html'));
});
app.get("/api", (req, res) => {

  console.log(req);
})

const port = process.env.PORT || 5000; //use a evironment port variable if available else use 5000
app.listen(port, () => console.log("app is listening on port " + port));
//connectToDB();
//node();