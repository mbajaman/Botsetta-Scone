const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const axios = require('axios');
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

  //Filter message command
  
  //Pirate translator
  if (!message.author.bot && message.content.startsWith("!pirate")) {
    console.log("Executed !pirate command");
    message.channel.send("Executed !pirate command");
  }
  //Corporate BS generator
  else if (!message.author.bot && message.content.startsWith("!corpbs")) {
    console.log("Executed !corpbs command");
    message.channel.send("Executed !corpbs command");
  }
  else if (!message.author.bot) {
    filteredmessage = message.content
    removeUselessWords(filteredmessage);
  }


  //remove all non nouns
  async function removeUselessWords(txt) {
    nounArray = [];
    txt = txt.replace(new RegExp('!filter', 'gi'), ' ')
      .replace(/\s{2,}/g, ' ');
    if (txt === " ") {

    } else {
      txtArray = txt.split(" ");
      txtArray.shift();
      for (var wordPos in txtArray) {
        console.log("Started waiting");
        var isNoun = await oxfordApiCall(txtArray[wordPos].replace(/[^\w\s]/gi, ''));
        console.log("finished waiting");
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
      path: "/jokes/search?category=Pun&minRating=5&numJokes=1&keywords=" + word,
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