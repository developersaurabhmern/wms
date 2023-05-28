var mongoose = require("mongoose");
const options = {
      useMongoClient: true,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0
    };
mongoose.Promise = global.Promise;
var url = "mongodb://mongoadmin:BFCCapital001comIndia@20.204.84.227:27017/wms?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
//var url ="mongodb://localhost:27017/wms";
var db = 
mongoose.connect(url, options , function(err, db){
   if(err){ console.log('Failed to connect to ' +err); }
   //else{ console.log('Connected to ' + db, ' + ', response); }
   else{ console.log('Connected to ' + db); }
});


module.exports =db;

// reactcrud is database name
// 192.168.1.71:27017 is your mongo server name
