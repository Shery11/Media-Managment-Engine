//Implement all the face functionality here

var express = require('express');
var router = express.Router();
var oxford = require('project-oxford'),
client = new oxford.Client('0bd837cc949249bea74f91fd34a55d69');


router.post('/detect', function(req, res){

	

  var attri = req.body;
  //this will return the faceid and if it returns an error then prompt user to change his profile picture
  client.face.detect({
       url:attri.imageURL,
       returnFaceId:true

  }).then(function(response){

       console.log(response);
       if(!( response.length == 0 ) ){
          res.json({success:true,res:response}); 
       }else{
          res.json({success:false});
       }

  }).catch(function (err) {
         console.log(err.code);
         console.log("===============================In face Detect=============================================");
         console.log(err);
     })


});


router.post('/findSimilar', function(req, res){
   
     var attri = req.body;
     
     client.face.similar(attri.id,{
         candidateFaces: attri.arr

    }).then(function(response){

       console.log(response);
       if(!( response.length == 0 ) ){
          res.json({success:true,res:response}); 
       }else{
          res.json({success:false});
       }

    }).catch(function (err) {
          console.log(err.code);
           console.log("======================================In find Similar======================================");
         
         console.log(err);
     })

  

});


module.exports = router;