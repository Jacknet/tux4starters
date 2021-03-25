const mariadb = require('mariadb');
const express = require("express");

const app = express();

const pool = mariadb.createPool({
     host: '3.136.100.20', 
     user:'tux', 
     password: 'tux@edulib',
     port: '3306',
     database: 'master1',
     //connectionLimit: 5,
     //multipleStatements : true
});
pool.getConnection((err) => {
  if(err){
    throw err
  }
  else{
    console.log("connected!");
  }
})

pool.query("insert into testTable (username, password) values ('userOne', 'passOne')", (err,rows)=> {
   if(err){
     throw err
   }
   else{
     console.log("data sentz");
     console.log(rows)
   }   
})

const port = 5000;
app.listen(port);


console.log("app is listening on port "+port);



// const pool = mariadb.createPool({
//      host: '3.136.100.20', 
//      port: '3306',
//      user:'root', 
//      password: 'tux4starters@edulib',
//      database: 'testTable',
//      connectionLimit: 5,
//      multipleStatements : true
// });

// pool.connection.connect((err)=>{
//   if(!err){
//     console.log("connected");
//   }
//   else {
//     console.log("connection failed");
//   }
// })

// app.listen(3000); 



async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
	//const rows = await conn.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO testTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}


// async function asyncFunction() {
//   let conn;
//   try {
// 	conn = await pool.getConnection();
// 	const rows = await conn.query("SELECT 1 as val");
// 	console.log(rows); //[ {val: 1}, meta: ... ]
// 	const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
// 	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

//   } catch (err) {
// 	throw err;
//   } finally {
// 	if (conn) return conn.end();
//   }
// }