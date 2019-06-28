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

  nounArray = [];

  //Filter message command
  if (!message.author.bot && message.content.startsWith("!filter")) {
    nounArray = [];
    filteredmessage = message.content

    removeUselessWords(filteredmessage);
    // if (filteredmessage != " ") {
    //   console.log(filteredmessage);
    //   message.channel.send(filteredmessage);
    // } else {
    //   message.channel.send("No usable words nerd");
    // }
  }
  //Pirate translator
  else if (!message.author.bot && message.content.startsWith("!pirate")) {
    console.log("Executed !pirate command");
    message.channel.send("Executed !pirate command");
  }
  //Shakespeare english tranlsator
  else if (!message.author.bot && message.content.startsWith("!")) {
    console.log("Executed !peary command");
    message.channel.send("Executed !peary command");
  }
  //Corporate BS generator
  else if (!message.author.bot && message.content.startsWith("!corpbs")) {
    console.log("Executed !corpbs command");
    message.channel.send("Executed !corpbs command");
  }



  //remove all non nouns
  function removeUselessWords(txt) {
    txt = txt.replace(new RegExp('!filter', 'gi'), ' ')
      .replace(/\s{2,}/g, ' ');
    if(txt === " "){
      
    }else{
      txtArray = txt.split(" ");
      txtArray.shift();
      for (var wordPos in txtArray) {
        //console.log(txtArray[wordPos].replace(/\s/g, ''));
        oxfordApiCall(txtArray[wordPos]).then(temp => {})
        //let temp = await oxfordApiCall(txtArray[wordPos]);
        //console.log("temp");
      }
    }
  
  }


  async function oxfordApiCall(word) {

    const app_id = ""; // insert your APP Id
    const app_key = ""; // insert your APP Key
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
      let response = await http.get(options, (resp) => {
        let body = '';
        resp.on('data', (d) => {
          body += d;
        });
        resp.on('end', () => {
          jsonData = JSON.parse(body);
          if (Object.keys(jsonData)[0] != "error") {
            if (jsonData.results[0].lexicalEntries[0].lexicalCategory.text === "Noun") {
              if (word.length < 3) {

              } else {
                console.log("Noun!");
                addToNounArray(word);
              }
            }
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  function addToNounArray(noun) {
    nounArray.push(noun);
  }

  //I've got it so it does it in order now but it does it every time there is a word, may wanna add something to fix that or else it'll spam chat for each noun
  function sendMessage(words) {
    console.log(words);
    if (words[0] != " ") {
      jokeWord = words[(Math.random() * words.length) | 0];
      message.channel.send(jokeWord);
      jokeAPICall(jokeWord);
    }
  }

  function jokeAPICall(word) {
    // url = "https://webknox-jokes.p.rapidapi.com"
    // const options = {
    //   method: "GET",
    //   url: url,
    //   headers:{
    //     "X-RapidAPI-Host": "",
    //     "X-RapidAPI-Key": ""
    //   }
    // };

    const options = {
      host: 'webknox-jokes.p.rapidapi.com',
      port: '443',
      path: "/jokes/search?category=Pun&minRating=5&numJokes=1&keywords=" + word,
      method: "GET",
      headers: {
        'X-RapidAPI-Host': "webknox-jokes.p.rapidapi.com",
        'X-RapidAPI-Key': ""
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
        if(jsonData.length > 0){
          jokeString = jsonData[0].joke;
          message.channel.send(jokeString);
        }
      });
    });
  }

});

client.login(auth.token);