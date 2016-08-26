// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var ObjectId = require('mongoose').ObjectId;
require('dotenv').config();
// MongoDB
var User        = require('./models/user');
var port 	      = process.env.PORT || 8080;
var jwt 			  = require('jwt-simple');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.database);

// Express
var app = express();
 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 app.use(passport.initialize());
 require('./config/passport')(passport);
var authenticationRoutes = require('./routes/userroutes');





app.use('/authentication',authenticationRoutes);

app.listen(process.env.PORT,  function() {
  console.log('Express server listening on %d', port);
});
