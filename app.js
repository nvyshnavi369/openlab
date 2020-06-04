
var express=require("express");
var app=express();
var JSAlert=require("js-alert");
var mysql=require('mysql');
var request=require("request");
var bodyParser = require('body-parser');
var cheerio=require("cheerio");
var firebase=require('firebase');
var uuid=require('uuid');
const sessionId = uuid.v4();




app.use(bodyParser.urlencoded({ extended: true })); 
var firebaseConfig = {
    apiKey: "AIzaSyCUhF-eB9dDcFfSfZL_tYSrA47zOP5tg68",
    authDomain: "restaurant-e7b38.firebaseapp.com",
    databaseURL: "https://restaurant-e7b38.firebaseio.com",
    projectId: "restaurant-e7b38",
    storageBucket: "restaurant-e7b38.appspot.com",
    messagingSenderId: "659579265283",
    appId: "1:659579265283:web:594e1acb6da6aa52ac0936",
    measurementId: "G-1J3B5MTZKY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var firestore=firebase.firestore();
  var database=firebase.database();
  



const dialogflow = require('dialogflow');




app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });



app.post("/send-msg",(req,res)=>{
  runSample(req.body.message).then(data=>{
    console.log('aaaaaaaaaa');
    console.log(data);
    res.send({Reply:data});
  });
});


/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'extras-ckolmc') {
  
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      apiKey:"C:/Users/ASUS/Desktop/openlab/EXTRAS-376aed4087b5.json"
    });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
    if(result.intent.displayName=="order")
    {
       console.log(result.parameters.fields.items.listValue.values);
       console.log(result.parameters.fields.quantity.stringValue);
     }
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}






app.use(express.static("public"));
app.get("/",function(req,res){
  res.render("first.ejs");
});
app.get("/start",function(req,res){
  var a=[];
  database.ref('/items/starters').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    aa=[name,cost];
   a.push(aa);
  });
});
  var b=[];
  database.ref('/items/mainCourse').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    bb=[name,cost];
   b.push(bb);
  });
});
  var c=[];
  database.ref('/items/desserts').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    cc=[name,cost];
   c.push(cc);
  });
});
  var d=[];
  database.ref('/items/beverages').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    dd=[name,cost];
   d.push(dd);
  });
});
  var e=[];
  database.ref('/items/breads').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    ee=[name,cost];
   e.push(ee);
  });
  res.render("menu.ejs",{starters:a,mainCourse:b,desserts:c,bevarages:d,breads:e});
});
});
app.get("/extras",function(req,res){
  res.render("extras.ejs");
});
app.get("/add_items",function(req,res){
  var d=[];
  database.ref('/items').once('value',function(item) {
  item.forEach(function(cat){
    var category=cat.key;
    var c=[];
    cat.forEach(function(name){ 
      var nam=name.key;
     var a={};
      a[nam]=name.val();
      c.push(a);
    });
    var b={};
    b[category]=c;
    d.push(b);
  });
  console.log(d);
});
  res.render("add_items.ejs",{items:d});
});
app.post('/start',function(req,res){
  res.redirect("/start");
});
app.post('/add_items',function(req,res){
  var a=req.body.pname;
  var b=req.body.pqty;
  var c=req.body.pcategory;
  var d=req.body.pcost;
  database.ref('/items/'+c+'/'+a+'/').set({
   'quantity':b,
   'cost':d
  });
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("connectedaa");
});
