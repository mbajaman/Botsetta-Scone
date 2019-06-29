const Discord = require('discord.js');
const axios = require('axios');
//He's a good tank
const logger = require('winston');
const auth = require('./auth.json');

//Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {colorize: true});
logger.level = 'debug';

//Initialize Discord bot
const client = new Discord.Client({
	token: auth.token
});


client.on('message', (message)=>{

	//Filter message command
	if(!message.author.bot && message.content.startsWith("!filter")){
	    filteredmessage = message.content;
	    //message.channel.send("It\'s fine now. Why? Because I am here!");
	    //we want to read the message here
	    //we can use the message.content to get the message content
	    //have to filter through the message content to get rid of words like "like, and, the etc"

	    filteredmessage = removeUselessWords(filteredmessage);
	    if(filteredmessage != " "){
	      console.log(filteredmessage);
	      message.channel.send(filteredmessage);
	    }
		else{
	      message.channel.send("No usable words nerd");
	    }
	  }

  	//Pirate translator
	else if(!message.author.bot && message.content.startsWith("!pirate")){
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

  	//Shakespeare english tranlsator
	else if(!message.author.bot && message.content.startsWith("!peary")){
	  	console.log("Executed !peary command");
	  	message.channel.send("Executed !peary command");
	  }
  	//Corporate BS generator
	else if(!message.author.bot && message.content.startsWith("!corpbs")){
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

	});

    var removeUselessWords = function(txt) {
      var uselessWordsArray =
        [
          "a", "at", "be", "can", "cant", "could", "couldnt",
          "do", "does", "dare", "dared", "how", "havent", "i", "in", "is", "many", "may", "might", "much", "must", "of",
          "on", "or", "should", "shouldnt", "so", "such", "the",
          "them", "they", "to", "us",  "we", "what", "who", "why",
          "with", "wont", "would", "wouldnt", "you", "and|"
        ];
        var expStr = uselessWordsArray.join("|");
        var text = txt.replace(new RegExp('\!filter', 'gi'), ' ')
                        .replace(/\s{2,}/g, ' ');     
        //Removes useless words         
        return text.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
                        .replace(/\s{2,}/g, ' ');
    }
client.login(auth.token);
