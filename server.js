//to create package.json: in terminal: npm init -y
//this keeps track of the npm packages we install

//to install express package for creating a server that listens to incoming requests: npm install express
//have to require in the installed package in order to be able to use it:
let express = require('express');

let app = express();

//what the app should do when it receives an incoming request to the homepage url
//first argument is the url what we are looking out for
//second argument is a function that runs when this request happens
app.get('/', function(req, res) {
    res.send("Hello, welcome to our app!")
})

app.listen(3000);

//to test if it works: terminal: node server (name of the js file)
//in the browser: localhost:3000