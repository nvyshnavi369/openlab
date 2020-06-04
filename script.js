var express=require("express");
var mysql=require('mysql');
var app=express();
var con=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "vyshnavi@0914",
	database: "sampleDB"
});
con.connect(function(err){
	if(err) {
	console.log(err);
    }
    else{
       console.log("connected");
       con.query("desc `vysh`", function (err, result) {
    if (err)  console.log(err);
    console.log("Database created");
    
    });
   }
});
app.listen(3000);
