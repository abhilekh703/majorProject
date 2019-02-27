//Importing all the required modules
var request = require('request');
var myParser = require("body-parser");
var multer = require('multer');
var upload = multer({dest:'uploads/'});
const fs = require('fs');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var CombinedStream = require('combined-stream');

var appRouter = function(app) {

	var audioBytes = "";
	var combinedstream = "";
	var emo_final = [];
	var text_final = [];
	var text_temp = {};
	var type = "";

	app.get("/testing", function(req, res) {
		res.send("Working");
	});
	
	app.post("/combined", upload.single('audio'),function(req, res) {
		var type = "";
		if(req.file.mimetype === 'audio/wave'){
			type = 'audio/wav';
		}
		else{
			type = req.file.mimetype;
		}
		const fileName = './' + req.file.path;
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64'); 

	    var options = {
			url: "https://proxy.api.deepaffects.com/audio/generic/api/v2/sync/recognise_emotion?apikey=7RezkQkXdvcqnPnatIfOKtd6w8y4kOuW", //Link for API call to DeepAffects library
			json : {
				"content": audioBytes, 
				"sampleRate": 16000, 
				"encoding": "LINEAR16", 
				"languageCode": "en-US"
			}
		}
		request.post(options, function(error, response, emotionsResults){
			if(error){
				console.log(48,"error");
				res.send("error");
			}
			else{
			var emo_final = [];
			var i = 0;
			var array1 = emotionsResults;
	  		array1.forEach(function(item1){
	  			emo_final[i] = {};
	  			emo_final[i].emotion = item1.emotion;
	  			emo_final[i].time = item1.end;
	  			i = i+1;
	  		})

			var speechToText = new SpeechToTextV1({
			  iam_apikey: 'DDGgnNHSBKGF85ewTaP1sHPvxenKeq4twGVVAV70SnD4',
			  url: 'https://gateway-lon.watsonplatform.net/speech-to-text/api'
			});
			var combinedStream = CombinedStream.create();
			combinedStream.append(fs.createReadStream(fileName));
			var recognizeParams = {
			  audio: combinedStream,
			  content_type: type,
			  timestamps: true,
			};
			speechToText.recognize(recognizeParams, function(error, speechResults) {
			  if (error) {
			    res.send("error");
			    console.log(76,"error");
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
				    					break;
				    				}
				    			}
				    		})
				    	})
				    })
				    res.json(text_final);
				    console.log(text_final);
				  }
			}); 
			}
		})

	});
}

module.exports = appRouter;
