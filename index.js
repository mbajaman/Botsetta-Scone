const Discord = require('discord.js');
const axios = require('axios');
//He's a good tank
const logger = require('winston');
const auth = require('./auth.json');
const http = require("https");
//Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

//Initialize Discord bot
const client = new Discord.Client({
  token: auth.token
});


client.on('message', (message) => {

  //Pirate translator
  if (!message.author.bot && message.content.startsWith("!pirate")) {
	  	console.log("Executed !pirate command");
	  	// message.channel.send("Executed !pirate command");
	  	var messageContent = message.content;        
	  	var messageContent = messageContent.replace(new RegExp('\!pirate', 'gi'), ' ')
                        .replace(/\s{2,}/g, ' ');   
	  	var uri = "https://api.funtranslations.com/translate/pirate.json?text=" + messageContent;
	  	var encodedUri = encodeURI(uri);

	  	console.log(encodedUri);

	  	axios({
	  		method: 'post',
	  		url: encodedUri
	  	})
	  	.then(function (response){
	  		var pirate_trans = response.data.contents.translated;
	  		console.log(pirate_trans);

	  		message.channel.send(pirate_trans);
	  	})
	  	.catch(function (error){
	  		console.log(error);
	  	});
  }
  //Corporate BS generator
  else if (!message.author.bot && message.content.startsWith("!corpbs")) {		
  	console.log("Executed !corpbs command");

	var uri = "https://corporatebs-generator.sameerkumar.website";
	axios({
  		method: 'get',
  		url: uri
  	})
  	.then(function (response){
  		var corpbs_trans = response.data.phrase;
  		console.log(corpbs_trans);
  		message.channel.send(corpbs_trans);
  	})
  	.catch(function (error){
  		console.log(error);
  	});
  }
  else if (!message.author.bot) {
    filteredmessage = message.content
    console.log(message.content);
    removeUselessWords(filteredmessage);
  }


  //remove all non nouns
  async function removeUselessWords(txt) {
    nounArray = [];
    txt = txt.replace(new RegExp('!filter', 'gi'), ' ')
      .replace(/\s{2,}/g, ' ');

    if (txt === " " ) {

    } 
    else {
      txtArray = txt.split(" ");
      console.log(txtArray);
      for (var wordPos in txtArray) {
        console.log("Started waiting");
        if(txtArray[wordPos]){
          var isNoun = await oxfordApiCall(txtArray[wordPos].replace(/[^a-zA-Z ]/g, ""));
          console.log("finished waiting");
        }
        if(isNoun){
          nounArray.push(txtArray[wordPos]);
        }
        console.log("==================");
      }
      
      sendMessage(nounArray);
    }
  }



  function oxfordApiCall(word) {
    return new Promise(function(resolve, reject) {
      isNoun = false;
      const app_id = "4885517e"; // insert your APP Id
      const app_key = "13ee867b28de76f474342fd8e7307b51"; // insert your APP Key
      const wordId = word.toLowerCase();;
      const fields = "definitions";
      const strictMatch = "false";

      const options = {
        host: 'od-api.oxforddictionaries.com',
        port: '443',
        path: '/api/v2/entries/en-gb/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch,
        method: "GET",
        headers: {
          'app_id': app_id,
          'app_key': app_key
        }
      };
      try {
        http.get(options, (resp) => {
          let body = '';
          resp.on('data', (d) => {
            body += d;
          });
          resp.on('end', () => {
            jsonData = JSON.parse(body);
            if (Object.keys(jsonData)[0] != "error") {
              console.log("Word found!");
              if (jsonData.results[0].lexicalEntries[0].lexicalCategory.text === "Noun") {
                if (word.length < 3) {
                  console.log(word + " is too small");
                  resolve(isNoun);
                } else {
                  console.log(word + "Noun!");
                  isNoun = true;
                  resolve(isNoun);
                }
              } else {
                console.log(word + " is not a noun");
                resolve(isNoun);
              }
            }
            else{
              resolve(isNoun);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    });

  }

  function addToNounArray(noun) {
    nounArray.push(noun);
  }

  //I've got it so it does it in order now but it does it every time there is a word, may wanna add something to fix that or else it'll spam chat for each noun
  function sendMessage(words) {
    console.log(words);
    if (words[0] != " ") {
      jokeWord = words[(Math.random() * words.length) | 0];
      jokeAPICall(jokeWord);
    }
  }

  function jokeAPICall(word) {

    const options = {
      host: 'webknox-jokes.p.rapidapi.com',
      port: '443',
      path: "/jokes/search?&minRating=5&numJokes=1&keywords=" + word + "&maxLength=100",
      method: "GET",
      headers: {
        'X-RapidAPI-Host': "webknox-jokes.p.rapidapi.com",
        'X-RapidAPI-Key': "10661540e8msha03e97970406c1dp17bf18jsn14adbb197094"
      }
    }

    http.get(options, (resp) => {
      let body = '';
      resp.on('data', (d) => {
        body += d;
      });
      resp.on('end', () => {
        jsonData = JSON.parse(body);
        console.log(jsonData);
        if (jsonData.length > 0) {
          jokeString = jsonData[0].joke;
          message.channel.send(jokeString);
        }
      });
    });
  }
});


client.login(auth.token);