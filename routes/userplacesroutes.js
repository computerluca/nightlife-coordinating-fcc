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
  return res.end(JSON.stringify(data.businesses));
})
.catch(function (err) {
          return res.status(400).send({success: false, msg: 'Api unavailable for this location'});

});
});
userplacesroutes.get('/yelpapi/business/:id',function(req,res){
// See http://www.yelp.com/developers/documentation/v2/search_api
// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.business(req.params.id)
  .then(function(data){
    res.send(JSON.stringify(data));
  })
  .catch(function(err){
    console.error(err);
  })
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
      if (err)  return res.status(400).send({success:false,msg:''});
      return res.status(201).send({success:true,msg:"UserPlace saved successfully"});
  });
}
else{
        return res.status(403).send({success: false, msg: 'No token provided.'});

}
})
userplacesroutes.delete('/userplaces/:location/:username',function(req,res){
  var username = req.params.username;
  console.log(username);
  var location = req.params.location;
  console.log(location);
  if(! req.params.username){
    return res.status(400).send({success:false, msg:"You didnt' specified the username"})
  }
  if(! req.params.location){
    return res.status(400).send({success:false,msg:"You didnt specified the location"})
  }
  UserPlace.remove({username:username,location:location},function(err){
      if (err)  {
        console.log(err);
        return res.status(400).send({success:false,msg:'You don"t reserve this location'});
      }
      console.log("success");
      return res.status(201).send({success:true,msg:"Userplace removed successufully"});
  })
})

module.exports = userplacesroutes;