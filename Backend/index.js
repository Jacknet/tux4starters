const mariadb = require("mariadb");
const express = require("express");
var path = require("path");
const app = express();


//this is for node1
const pool = mariadb.createPool({
  host: '3.136.100.20', 
  user:'tux', 
  password: 'tux@edulib',
  port: '3306',
  database: 'master1',
  acquireTimeout: '40000' //set timeout to 40 seconds to avoid it crashing if the connection is slow
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

// async function node1() {
//   let conn;
//   try {
//       //console.log("THIS IS NODE 1");
//     conn = await pool.getConnection();
//     const rows = await conn.query("SELECT * from testTable");
//     //console.log(rows[0]); //[ {val: 1}, meta: ... ]
//     //const res = await conn.query("INSERT INTO testTable value (?, ?)", [1, "mariadb"]);
//     //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
//     return rows;
//   } catch (err) {
//     throw err;
    
//   } 
// }


// pool.getConnection((err) => {
//   if(err){
//     throw err
//   }
//   else{
//     console.log("connected!");
//   }
// })

// pool.query("insert into testTable (username, password) values ('userOne', 'passOne')", (err,rows)=> {
//    if(err){
//      throw err
//    }
//    else{
//      console.log("data sentz");
//      console.log(rows)
//    }   
// })

let options = {
  dotfiles: "ignore", //possible values (allow, deny, ignore)
  etag: true,
  extensions: ["htm", "html"],
  index: false,
  redirect: false 
}

app.use(express.static("../TUX4STARTERS", options));
app.use('/api',express.json())

app.post('/api',(req,res) => {
  console.log("API REQ RECEIVED!!!!")
  node1();
  async function node1() {
    let conn;
    try {
        //console.log("THIS IS NODE 1");
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * from testTable");
      //console.log(rows[0]); //[ {val: 1}, meta: ... ]
      //const res = await conn.query("INSERT INTO testTable value (?, ?)", [1, "mariadb"]);
      //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
      res.send(rows);
      //console.log(`insert into users values `)
      //const result=await conn.query(`insert into users values ("+username+", "+email+", "+password+");")
    } catch (err) {
      throw err;
      
    } 
  }


 
  
})
app.get('/' ,(req, res) =>{
//res.send("some texts");
res.sendFile(path.join(__dirname+'../../index.html'));
//res.render('index')
});
app.get('/about.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../about.html'));
  });
app.get('/resources.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../resources.html'));
});
app.get('/help.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../help.html'));
});
app.get('/signin.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../signin.html'));
});

app.get('/demolesson1/index.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../demolesson1/index.html'));
});
app.get('/demolesson1/MultipleChoiceTemp.html' ,(req, res) =>{
  //res.send("some texts");
  res.sendFile(path.join(__dirname+'../../demolesson1/MultipleChoiceTemp.html'));
});


app.get("/api", (req, res) =>{

  console.log(req);
})

const port = process.env.PORT || 5000; //use a evironment port variable if available else use 5000
app.listen(port, () => console.log("app is listening on port "+port));
//node1()

