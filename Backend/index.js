const mariadb = require("mariadb");
const express = require("express");
var path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
const {connect} = require("http2");
const nodemon = require("nodemon");

//this is for node1
const pool = mariadb.createPool({
  host: '3.136.100.20', 
  user:'tux', 
  password: 'tux@edulib',
  port: '3306',
  database: 'testuser',
  acquireTimeout: '10000' //set timeout to 40 seconds to avoid it crashing if the connection is slow
  //connectionLimit: 5,
  //multipleStatements : true
});

//This for node2
const pool2 = mariadb.createPool({
  host: '3.129.34.123', 
  user:'tux', 
  password: 'tux@edulib',
  port: '3306',
  database: 'master1',
  acquireTimeout: '40000' //set timeout to 40 seconds to avoid it crashing if the connection is slow 
  //connectionLimit: 5,
  //multipleStatements : true
});

//-----------below are couple different ways to make connection and 
//-----------perform a query on the database


//this one uses promises. this does not need to be called, it runs at runtime.
/*
//------------------------------------------
mariadb.createConnection({
  host: '3.136.100.20',
  user: 'tux',
  password: 'tux@edulib',
  port: '3306',
  database: 'testuser'
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

app.use(express.static("../TUX4STARTERS", options));
const exJson = app.use('/api', express.json());

app.post('/api',urlencodedParser,(req,res) => {
  console.log("API REQ RECEIVED!!!!")

 let md = mariadb.createConnection({
  host: '3.136.100.20',
  user: 'tux',
  password: 'tux@edulib',
  port: '3306',
  database: 'testuser'
})
md.then(conn =>{
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const saltRounds = 10; //this should allow ~10 hashes a sec

      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          const result= conn.query(`insert into users values ("${username}","${email}","${hash}");`);
          console.log(result);
         
        });
      }); 
}).catch(err =>{
  console.log(err);
});
res.send(null)

})

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