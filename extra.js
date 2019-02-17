app.post("/text", function(req, res) {
		
		var speechToText = new SpeechToTextV1({
		  iam_apikey: 'DDGgnNHSBKGF85ewTaP1sHPvxenKeq4twGVVAV70SnD4',
		  url: 'https://gateway-lon.watsonplatform.net/speech-to-text/api'
		});

		var combinedStream = CombinedStream.create();
		combinedStream.append(fs.createReadStream('./resources/hello.wav'));
		var recognizeParams = {
		  audio: combinedStream,
		  content_type: 'audio/wav',
		  timestamps: true,
		};

		speechToText.recognize(recognizeParams, function(error, speechRecognitionResults) {
		  if (error) {
		    console.log(error);
		  } else {
		    //console.log(JSON.stringify(speechRecognitionResults.results, null, 2));
		    console.log(speechRecognitionResults.results);
		  }
		});

	});


const fileName = './' + req.file.path;
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64'); 



		app.post("/tone", upload.single('audio'),function(req, res) {
		
		console.log("tone api started");
		var toneAnalyzer = new ToneAnalyzerV3({
		  version_date: '2017-09-21',
		  iam_apikey: 'WFpfFaqyW36cNF4FlsObfCC5k2HcdOxVESo4EHXYHymY',
		  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api'
		});

		var text = 'Team, I know that times are tough! Product '
  + 'sales have been disappointing for the past three '
  + 'quarters. We have a competitive product, but we '
  + 'need to do a better job of selling it!';
		var toneParams = {
		  tone_input: { 'text': text },
		  content_type: 'application/json'
		};

		toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
		  if (error) {
		    console.log(error);
		  } else { 
		    console.log(JSON.stringify(toneAnalysis, null, 2));
		  }
		});

	});


app.post("/upload", upload.single('audio'),function(req, res) {

		console.log("Upload API Started");
		if(req.file.mimetype === 'audio/wave')
		{
			type = 'audio/wav';
		}
		else{
			type = req.file.mimetype;
		}
		console.log(type);
		const fileName = './' + req.file.path;
		const file = fs.readFileSync(fileName);
		audioBytes = file.toString('base64'); 
		combinedStream = CombinedStream.create();
		combinedStream.append(fs.createReadStream(fileName));
		console.log("Upload API responded");
		res.send("Your file has been uploaded");
		
	});

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
		  content_type: type,
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