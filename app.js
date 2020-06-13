
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

c="table1";


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
       list=result.parameters.fields.items.listValue.values;
       items=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['stringValue'])
        items.push(list[i]['stringValue']);
       }
       console.log(result.parameters.fields.number.listValue.values);
       list=result.parameters.fields.number.listValue.values;
       quantity=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['numberValue'])
        quantity.push(list[i]['numberValue']);
       }
       if(quantity.length==0){
        for(var i=0;i<items.length;i=i+1){
          a=items[i];
          var b=0;
          await database.ref('/wish/'+c+'/items/'+a).once('value',function(item) {
             b=item.val();
             console.log('cvbn');
             console.log(b);
          });
          b=b+1;
          database.ref('/wish/'+c+'/items/').update({
            [a]:b
          });
        }
       }
       else if(items.length==quantity.length){
        for(var i=0;i<items.length;i=i+1){
          a=items[i];
          b=quantity[i];
          var d;
          await database.ref('/wish/'+c+'/items/'+a).once('value',function(item) {
             d=item.val();
             console.log('cvbn');
             console.log(d);
          });
          b=b+d;
          database.ref('/wish/'+c+'/items/').update({
            [a]:b
          });
        }
       }else{
        console.log('be clearrr');
       }
     }
     if(result.intent.displayName=="extras")
    {
       console.log(result.parameters.fields.extras.listValue.values);
       list=result.parameters.fields.extras.listValue.values;
       items=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['stringValue'])
        items.push(list[i]['stringValue']);
       }
       console.log(result.parameters.fields.number.listValue.values);
       list=result.parameters.fields.number.listValue.values;
       quantity=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['numberValue'])
        quantity.push(list[i]['numberValue']);
       }
       if(quantity.length==0){
        for(var i=0;i<items.length;i=i+1){
          a=items[i];
          var b=0;
          await database.ref('/wish/'+c+'/extras/'+a).once('value',function(item) {
             b=item.val();
             console.log('cvbn');
             console.log(b);
          });
          b=b+1;
          database.ref('/wish/'+c+'/extras/').update({
            [a]:b
          });
        }
       }
       else{
        if(items.length==quantity.length){
        for(var i=0;i<items.length;i=i+1){
           a=items[i];
           b=quantity[i];
           var d;
          await database.ref('/wish/'+c+'/extras/'+a).once('value',function(item) {
             d=item.val();
             console.log('cvbn');
             console.log(d);
          });
          b=b+d;
          database.ref('/wish/'+c+'/extras/').update({
            [a]:b
          });
        }
      }else{
        console.log('tell one by one')
       }
      }
     }
     if(result.intent.displayName=="delete")
    {
      if(result.parameters.fields.extras.listValue!=null){
       console.log(result.parameters.fields.extras.listValue.values);
       list=result.parameters.fields.extras.listValue.values;
       extras=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['stringValue'])
        extras.push(list[i]['stringValue']);
       }
     }
      if(result.parameters.fields.items.listValue!=null){
       console.log(result.parameters.fields.items.listValue.values);
       list=result.parameters.fields.items.listValue.values;
       items=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['stringValue'])
        items.push(list[i]['stringValue']);
       }
      }
       console.log(result.parameters.fields.number.listValue.values);
       list=result.parameters.fields.number.listValue.values;
       quantity=[];
       for(var i=0;i<list.length;i=i+1){
        console.log(list[i]['numberValue'])
        quantity.push(list[i]['numberValue']);
       }
       if(quantity.length==0){
        if(result.parameters.fields.items.listValue!=null){
        for(var i=0;i<items.length;i++){
           database.ref('/wish/'+c+'/items/'+items[i]).remove();
        }
      }
      if(result.parameters.fields.extras.listValue!=null){
        for(var i=0;i<extras.length;i++){
           database.ref('/wish/'+c+'/extras/'+extras[i]).remove();
        }
      }
       }
       if(result.parameters.fields.items.listValue!=null){
        if(quantity.length==items.length){
           for(var i=0;i<items.length;i++){
                a=items[i];
                b=quantity[i];
                var d;
                await database.ref('/wish/'+c+'/items/'+a).once('value',function(item) {
                    d=item.val();
                    console.log('cvbn');
                    console.log(d);
                });
                b=d-b;
                if(b>0){
                   database.ref('/wish/'+c+'/items/').update({
                      [a]:b
                   }); 
                }
                if(b==0){
                  database.ref('/wish/'+c+'/items/'+a).remove();
                }
           }
       }
     }
       if(result.parameters.fields.extras.listValue!=null){
       if(quantity.length==extras.length){
            for(var i=0;i<extras.length;i++){
                a=extras[i];
                b=quantity[i];
                var d;
                await database.ref('/wish/'+c+'/extras/'+a).once('value',function(item) {
                    d=item.val();
                    console.log('cvbn');
                    console.log(d);
                });
                b=d-b;
                if(b>0){
                   database.ref('/wish/'+c+'/extras/').update({
                      [a]:b
                   }); 
                }
                if(b==0){
                  database.ref('/wish/'+c+'/extras/'+a).remove();
                }
           }
       }
     }else{
        console.log('be clear');
       }
    }
  } else {
    console.log(`  No intent matched.`);
  }

  return result.fulfillmentText;
}



async function moveFbRecord(oldRef, newRef) {
  try {
    var snap = await oldRef.once('value');
    await newRef.set(snap.val());
    await oldRef.set(null);
    console.log('Done!');
  }catch(err) {
       console.log(err.message);
  }
}





app.use(express.static("public"));
app.get("/a",function(req,res){
  database.ref('/orders/'+c).remove();
  database.ref('/counter/'+c).remove();
  database.ref('/wish/'+c+'/').set({
   'id':c
  });
  res.render("first.ejs");
});
app.get("/a",function(req,res){
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
  database.ref('/items/bevarages').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    dd=[name,cost];
   d.push(dd);
  });
});
  var f=[];
  database.ref('/items/curries').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    ff=[name,cost];
   f.push(ff);
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
  res.render("menu.ejs",{starters:a,mainCourse:b,desserts:c,bevarages:d,breads:e,curries:f});
});
});
app.get("/extras",function(req,res){
  var e=[];
  database.ref('/extras').once('value',function(item) {
  item.forEach(function(i){
    var c=i.val();
   e.push(c);
  });
  res.render("extras.ejs",{items:e});
});
});
app.get("/",function(req,res){
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
  database.ref('/items/bevarages').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    dd=[name,cost];
   d.push(dd);
  });
});
  var f=[];
  database.ref('/items/curries').once('value',function(item) {
  item.forEach(function(i){
    var name=i.key;
    var cost=i.val().cost;
    ff=[name,cost];
   f.push(ff);
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
  res.render("add_items.ejs",{starters:a,mainCourse:b,desserts:c,bevarages:d,breads:e,curries:f});
});
});
app.get('/order',function(req,res){
   var tables=[];
  database.ref('/orders').once('value',function(item) {
    var a;
    item.forEach(function(i){
    a=[i.key]
    var items=i.val().items;
    a.push(items);
  });
   tables.push(a);
   console.log(tables);
   res.render("order.ejs",{orders:tables});
  });
});
app.get('/wishlist',function(req,res){
  database.ref('/wish/'+c).once('value',function(i) {
    var a;
    a=[i.key];
    if(i.val()!=null){
    var items=i.val().items;
    var extras=i.val().extras;
    var msg=i.val().msg;
    a.push(items);
    a.push(extras);
  }
    res.render("wish.ejs",{c:c,orders:a,msg:msg});
  });
  });
app.get('/bill',function(req,res){
  var array;
  var total=0;
  var names=[];
  var quantity=[];
  var cost=[];
  var i=0;
  database.ref('counter/'+c+'/items').once('value',async function(item){
    array=item.val();
    if(array!=null){
    await database.ref('items/').once('value',function(item){
      item.forEach(function(i){
        i.forEach(function(name){
          if(Object.keys(array).includes(name.key)){
            total=total+name.val().cost*array[name.key];
            names.push(name.key);
            quantity.push(array[name.key]);
            cost.push(name.val().cost);
          }
        });
      });
    });
  }
    res.render('bill.ejs',{total:total,name:names,quantity:quantity,cost:cost});
  });
})
app.post('/start',function(req,res){
  res.redirect("/start");
});
app.post('/add_items',function(req,res){
  var str=req.body.str;
  var a=req.body.pname;
  var c=req.body.pcategory;
  var d=req.body.pcost;
  database.ref('/items/'+c+'/'+a+'/').set({
   'cost':d,
   'features':str
  });
  res.redirect("/");
});
app.post('/delete_item',function(req,res){
  var a=req.body.pname;
  var c=req.body.pcategory;
  let rem=database.ref('/items/'+c+'/'+a).remove();
  res.redirect("/");
});
app.post('/order',async function(req,res){
  var table=req.body.table;
  r1=database.ref('/wish/'+c+'/items/');
  r2=database.ref('/orders/'+c+'/items/');
  await moveFbRecord(r1,r2);
  r1=database.ref('/wish/'+c+'/extras/');
  r2=database.ref('/counter/'+c+'/extras/');
  await moveFbRecord(r1,r2);
  await database.ref('/wish/'+c+'/').set({
     'msg':'wait for confirmation of previous order'
  });
  res.redirect("/start");
})
app.post('/done',async function(req,res){
  var a=req.body.table;
  var array=[];
  await database.ref('/orders/'+a+'/items/').once('value',function(item) {
      item.forEach(function(i){
      var name=i.key;
      var quantity=i.val();
      console.log('b');
      array.push([name,quantity]);
    });
  });
  console.log('first')
  for(var i=0;i<array.length;i++){
     await database.ref('/counter/'+a+'/items/'+array[i][0]).once('value',async function(item){
      var s=item.val();
      s=s+array[i][1];
      await database.ref('/counter/'+a+'/items/').update({
        [array[i][0]]:s
      });
    });
    }
    await database.ref('/orders/'+a).remove();
    await database.ref('/wish/'+a+'/msg').remove();
     res.redirect("/order");   
});      
app.post('/notDone',async function(req,res){
  var a=req.body.table;
  var msg=req.body.message;
  console.log(a);
  r1=database.ref('/wish/'+a+'/');
  r2=database.ref('/orders/'+a+'/');
  await moveFbRecord(r2,r1);
  await database.ref('/wish/'+a+'/').update({
     'msg':msg
  });
  res.redirect("/order");
});
app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("connectedaa");
});
