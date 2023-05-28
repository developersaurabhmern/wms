module.exports = app => {

    const user = require("../controllers/getcontroller.js");
   
      
      app.get("/getUserDetails",user.getUserDetails);//
      
     
  };