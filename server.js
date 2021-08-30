//to create package.json: in terminal: npm init -y
//this keeps track of the npm packages we install

//to install express package for creating a server that listens to incoming requests: npm install express
//have to require in the installed package in order to be able to use it:
let express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
let sanitizeHTML = require('sanitize-html');

let app = express();
let db;

//to serve up static, existing files
//to make the public folder available from the root of our server
app.use(express.static('public'));

//we have to include the password and the name of the db we want to connect to
let connectionString = 'mongodb+srv://todoAppUser:todoAppUser@cluster0.6cpwg.mongodb.net/ToDoApp?retryWrites=true&w=majority';
MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db();
  app.listen(3000);
})

//to do the same thing as below but for asynchronous requests
app.use(express.json());
//to tell express to add all form values to a body object, and add that body object to the reqest object
app.use(express.urlencoded({extended: false}));

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
  console.log(req.headers.authorization);
  if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next();
  } else {
    res.status(401).send("Authentication required");
  }
}

app.use(passwordProtected);

//what the app should do when it receives an incoming request to the homepage url
//first argument is the url what we are looking out for
//second argument is a function that runs when this request happens
//we can include as many arguments in get as we want
app.get('/', function(req, res) {
  //to read the database: find() method returns data which needs to be converted so we can work with it with JS => toArray()
  db.collection('items').find().toArray(function(err, items) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
        <!-- action attribute cntrols which url the form sends its request to when the user submits the form -->
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
         ${items.map(function(item) {
           return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
           <span class="item-text">${item.text}</span>
           <div>
              <!-- to be able to enbed data in html, so now the edit butten holds the id of the list items in the db -->
             <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
             <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
           </div>
         </li>`
         }).join('')}
        </ul>
        
      </div>

    <!-- to make the axios library available -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>  
    <!-- to write js code for the browser environment -->
    <script src="/browser.js"></script>
    </body>
    </html>`)
  });
})

//to be able to respond to the form being submitted
//to extract what the user types and send it to the server
//post() takes two arguments:
//first: the url we want to be able to look out for
//second: function to run when the web browser sends a post request to this url
app.post('/create-item', function(req, res) {
    let safeText = sanitizeHTML(req.body.item, {allowedTags: [], allowedAttributes: {}});
    //to connect to a database
    db.collection('items').insertOne({text: safeText}, function() {
      //after submitting an item, it redirects to the base url
      res.redirect('/');
    })
})

app.post('/update-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  //findOneAndUpdate needs 3 arguments:
  //first: which document we want to update
  //second: what we want to update on that document
  //third: a function which runs once the db action is complete
  db.collection('items').updateOne({_id: ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success");
  });
})

app.post('/delete-item', function(req, res) {
  //deleteOne takes two arguments:
  //first: the document we want to delete
  //second: function to run when the first action is complete
  db.collection('items').deleteOne({_id: ObjectId(req.body.id)}, function() {
    res.send("Success");
  })
})

//to launch the app, we use: npm run watch

//in the browser: localhost: 3000