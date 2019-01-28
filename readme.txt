This is the server side code for Speech to text conversion with emotion recognition.
It is developed using NodeJS and it offers API which takes audio file as input and outputs yhe text in the speech and the emotions along with time stamp.


Running the Code

1. Install NodeJS and all dependencies mentioned in the "package.json" file
2. Start the server by running node "app.js"
3. Note the port number on which server is listening, eg- localhost:8080
4. Use any client simulator like "Postman" to make API calls.
5. To get text of the speech make a POST request to "localhost:8080/text", request should contain the audio file in it's body.
6. To get emotions of the speech make a POST request to "localhost:8080/emotion", request should contain the audio file in it's body.

File Structure Details

package.json - Contains details of all the dependencies, packages and their versions
node_modules - Contains all the installed packages mentioned in the package.json files
auth.json    - Contains authentication credentials to make google cloud speech service calls
app.js       - Starts the server app, prints the port on ehich server is listening and redirects all API calls to the route folder
routes.js    - It handles all the API calls and returns response for text and emotions

API Details

"/text" API - It returns the text from the speech. We have used Google cloud speech service to acheive this task.
	      This is a POST API which expects the request body to contain audio file
	      The audio file is converted to string format, encoding type, sample rate and language are then sent to Google Cloud service for processing
	      the text returned from the Google Cloud service is sent as the response for this API

"/emotion" API - It returns the emotion in the speech along with the time stamp. It uses DeepAffects emotion recognition API to acheive this task
	         This is a POST API which expects the request body to contain audio file
	      	 The audio file is converted to string format, encoding type, sample rate and language are then sent to DeepAffecrs APIs for processing
	         the emotions returned from the DeepAffects is sent as the response for this API
