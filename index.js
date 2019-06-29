const Discord = require('discord.js');
const axios = require('axios');

//He's a good tank
const logger = require('winston');

const auth = require('./auth.json');
const http = require("https");

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

  //Help Command
  else if (!message.author.bot && message.content.startsWith("!help")) {		
  	message.channel.send("```You can refer to the documentation here to look up bot commands!\nhttps://github.com/mbajaman/Botsetta-Scone/blob/master/README.md\nTo get the jokes feature working feel free to spam a bit in the channel as there is a 1/10 chance for the message to get turned into a joke```")
  }
  else if (!message.author.bot) {
    chance = Math.floor(Math.random() * 10);
    console.log(chance);
    if(chance === 7){
      filteredmessage = message.content
      console.log(message.content);
      removeUselessWords(filteredmessage);
    }
  }

  //Remove all non nouns
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
          word = (txtArray[wordPos].replace(/[^a-zA-Z ]/g, ""));
          console.log("REGEX WORK:" + word);
          if(word.length > 2){
          	var isNoun = await oxfordApiCall(word);
          	console.log("finished waiting");
          }
        }
        if(isNoun){
          nounArray.push(word);
        }
        console.log("==================");
      }

      sendMessage(nounArray);
    }
  }

//Call to Oxford Dictionary API
  function oxfordApiCall(word) {
    return new Promise(function(resolve, reject) {
      isNoun = false;
      const app_id = auth.app_id; // insert your APP Id
      const app_key = auth.app_key; // insert your APP Key
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

  function sendMessage(words) {
    console.log(words);
    if (words[0] != " ") {
      jokeWord = words[(Math.random() * words.length) | 0];
      jokeAPICall(jokeWord);
    }
  }

//Call to Jokes API
  function jokeAPICall(word) {

    const options = {
      host: 'webknox-jokes.p.rapidapi.com',
      port: '443',
      path: "/jokes/search?maxLength=100&minRating=5&numJokes=1&keywords=" + word,
      method: "GET",
      headers: {
        'X-RapidAPI-Host': auth.jokes_host,
        'X-RapidAPI-Key': auth.jokes_key
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