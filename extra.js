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