//Importing all the required modules
var request = require('request');
var myParser = require("body-parser");
var multer = require('multer');
var upload = multer({dest:'uploads/'});
const fs = require('fs');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var CombinedStream = require('combined-stream');
// App which handles all the API calls
var appRouter = function(app) {

	var audioBytes = "";
	var combinedstream = "";
	var emo_final = [];
	var text_final = [];
	var text_temp = {};

	app.get("/test", function(req, res) {
		console.log("audio data received");
		res.send("audio data received");
	});
	
	app.post("/upload", upload.single('audio'),function(req, res) {

		console.log("Upload API Started");
		const fileName = './' + req.file.path;
		const file = fs.readFileSync(fileName);
		audioBytes = file.toString('base64'); 
		combinedStream = CombinedStream.create();
		combinedStream.append(fs.createReadStream(fileName));
		console.log("Upload API responded");
		res.send("Your file has been uploaded");
		
	});


//API handles POST request to give emotions as response
	app.post("/emotion",function(req, res) {
		console.log("Emotion API Started");
	    var options = {
			url: "https://proxy.api.deepaffects.com/audio/generic/api/v2/sync/recognise_emotion?apikey=7RezkQkXdvcqnPnatIfOKtd6w8y4kOuW", //Link for API call to DeepAffects library
			//setting up parameters for API call			
			json : {
				"content": audioBytes, 
				"sampleRate": 16000, 
				"encoding": "LINEAR16", 
				"languageCode": "en-US"
			}
		}
		request.post(options, function(error, response, emotionsResults){
			var i = 0;
			var array1 = emotionsResults;
	  		array1.forEach(function(item1){
	  			emo_final[i] = {};
	  			emo_final[i].emotion = item1.emotion;
	  			emo_final[i].time = item1.end;
	  			i = i+1;
	  		})
	  		res.send("Emotion Detected Successfully");
	  		//console.log(emo_final);
	  		console.log("Emotion API responded");
		})
	});

	app.post("/text",function(req, res) {
		console.log("Text API started");
		var speechToText = new SpeechToTextV1({
		  iam_apikey: 'DDGgnNHSBKGF85ewTaP1sHPvxenKeq4twGVVAV70SnD4',
		  url: 'https://gateway-lon.watsonplatform.net/speech-to-text/api'
		});
		var recognizeParams = {
		  audio: combinedStream,
		  content_type: 'audio/wav',
		  timestamps: true,
		};
		speechToText.recognize(recognizeParams, function(error, speechResults) {
		  if (error) {
		    console.log(error);
		  } else {
		  			text_temp = speechResults;
				    //console.log(text_temp);
				    console.log("Text API responded");
				    res.send("Speech to Text Conversion Successful");
			 }
		});
	});

	app.post("/mapping",function(req, res) {
		console.log("Mapping API Started");
		var text_final = [];
			  		var j = 0;
				    var array1 = text_temp.results;
				    array1.forEach(function(item1){
				    	var array2 = item1.alternatives;
				    	array2.forEach(function(item2){
				    		var array3 = item2.timestamps;
				    		array3.forEach(function(item3){
				    			text_final[j]={};
				    			text_final[j].word = item3[0];
				    			for(var k=0;k<emo_final.length;k++)
				    			{
				    				if(item3[2]<emo_final[k].time)
				    				{
				    					text_final[j].emotion = emo_final[k].emotion;
				    					j = j+1;
				    					break;
				    				}
				    			}
				    		})
				    	})
				    })
				    //console.log(text_final);
				    console.log("Mapping API responded");
				    res.send(text_final);
	});

	app.post("/combined", upload.single('audio'),function(req, res) {
		console.log("emotion work started");
		const fileName = './' + req.file.path;
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64'); 

	    var options = {
			url: "https://proxy.api.deepaffects.com/audio/generic/api/v2/sync/recognise_emotion?apikey=7RezkQkXdvcqnPnatIfOKtd6w8y4kOuW", //Link for API call to DeepAffects library
			//setting up parameters for API call			
			json : {
				"content": audioBytes, 
				"sampleRate": 16000, 
				"encoding": "LINEAR16", 
				"languageCode": "en-US"
			}
		}
		request.post(options, function(error, response, emotionsResults){

			console.log("Emotion  API responded");

			var emo_final = [];
			var i = 0;
			var array1 = emotionsResults;
	  		array1.forEach(function(item1){
	  			emo_final[i] = {};
	  			emo_final[i].emotion = item1.emotion;
	  			emo_final[i].time = item1.end;
	  			i = i+1;
	  		})

			//console.log(JSON.stringify(emo_final));
			console.log("Text extraction started");
			var speechToText = new SpeechToTextV1({
			  iam_apikey: 'DDGgnNHSBKGF85ewTaP1sHPvxenKeq4twGVVAV70SnD4',
			  url: 'https://gateway-lon.watsonplatform.net/speech-to-text/api'
			});
			var combinedStream = CombinedStream.create();
			combinedStream.append(fs.createReadStream(fileName));
			var recognizeParams = {
			  audio: combinedStream,
			  content_type: 'audio/wav',
			  timestamps: true,
			};
			speechToText.recognize(recognizeParams, function(error, speechResults) {
			  if (error) {
			    console.log(error);
			  }  else {
			  		var text_final = [];
			  		var j = 0;
				    var array1 = speechResults.results;
				    array1.forEach(function(item1){
				    	var array2 = item1.alternatives;
				    	array2.forEach(function(item2){
				    		var array3 = item2.timestamps;
				    		array3.forEach(function(item3){
				    			text_final[j]={};
				    			text_final[j].word = item3[0];
				    			for(var k=0;k<emo_final.length;k++)
				    			{
				    				if(item3[2]<emo_final[k].time)
				    				{
				    					text_final[j].emotion = emo_final[k].emotion;
				    					j = j+1;
				    					//console.log(item3[2],emo_final[k].time);
				    					break;
				    				}
				    			}
				    		})
				    	})
				    })
				    console.log(text_final);
				    res.send(text_final);
				  }
			}); 
		})
	});


}

module.exports = appRouter;
