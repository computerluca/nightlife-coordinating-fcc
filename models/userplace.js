var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserPlaceSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true
    }
    
});
module.exports = mongoose.model('UserPlace', UserPlaceSchema);
