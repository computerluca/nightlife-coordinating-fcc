var express = require('express');
var passport = require('passport');
require('dotenv').config();
var jwt 			  = require('jwt-simple');
var UserPlace = require('./../models/userplace');
// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret:process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret
});
var userplacesroutes = express.Router();

userplacesroutes.get('/yelpapi/:location',function(req,res){
// See http://www.yelp.com/developers/documentation/v2/search_api
// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ term: 'bars,restaurants', location: req.params.location })
.then(function (data) {
  res.end(JSON.stringify(data.businesses));
})
.catch(function (err) {
  console.error(err);
});
});
var getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
userplacesroutes.get('/userplaces/:location', function(req,res){
  var location = req.params.location;
  UserPlace.find({location:location},function(err,data){
    if(err) throw err;
    res.end(JSON.stringify(data));
  })

});

userplacesroutes.post('/userplaces',passport.authenticate('jwt', {session: false}),function(req,res){
    var token = getToken(req.headers);
if(token){
  var new_user_place = new UserPlace();
  new_user_place.username = req.body.username;
  new_user_place.location = req.body.location;
  new_user_place.save(function(err){
      if (err)  return res.status(400).send({success:false,msg:'You already signup for this location'});
      return res.status(201).send({success:true,msg:"UserPlace saved successfully"});
  });
}
else{
        return res.status(403).send({success: false, msg: 'No token provided.'});

}
})

module.exports = userplacesroutes;