const mariadb = require("mariadb");
const express = require("express");
const app = express();

//this is for node1
const pool = mariadb.createPool({
  host: '3.136.100.20', 
  user:'tux', 
  password: 'tux@edulib',
  port: '3306',
  database: 'master1',
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
  //connectionLimit: 5,
  //multipleStatements : true
});

async function node1() {
  let conn;
  try {
      console.log("THIS IS NODE 1");
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * from testTable");
    console.log(rows); //[ {val: 1}, meta: ... ]
    //const res = await conn.query("INSERT INTO testTable value (?, ?)", [1, "mariadb"]);
    //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
    throw err;
    
  } finally {
    if (conn){
      return conn.end();
    } 
  }
}


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

const port = 5000;
app.listen(port);
console.log("app is listening on port "+port);
node1()