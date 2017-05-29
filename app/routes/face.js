//Implement all the face functionality here

var express = require('express');
var router = express.Router();
var oxford = require('project-oxford'),
client = new oxford.Client('0bd837cc949249bea74f91fd34a55d69');


router.post('/detect', function(req, res){

	

  var attri = req.body;
  // console.log(attri.imageURL);

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

//adds face to face list takes url of image and add it to facelist
router.post('/addface', function(req, res){
   
     var attri = req.body;
     
    client.face.faceList.addFace("123456789",{
             url:attri.imageURL
    }).then(function(response){
   
        console.log(response);
        res.json({success:true,res:response}); 
    });

  

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