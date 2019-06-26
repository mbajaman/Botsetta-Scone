const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = "TOKENGOESHERE";

client.on('message', (message)=>{
  if(!message.author.bot){
    filteredmessage = message.content
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
});

    var removeUselessWords = function(txt) {
      var uselessWordsArray =
        [
          "a", "at", "be", "can", "cant", "could", "couldnt",
          "do", "does", "dare", "dared", "how", "havent", "i", "in", "is", "many", "may", "might", "much", "must", "of",
          "on", "or", "should", "shouldnt", "so", "such", "the",
          "them", "they", "to", "us",  "we", "what", "who", "why",
          "with", "wont", "would", "wouldnt", "you"
        ];
        var expStr = uselessWordsArray.join("|");
        return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
                        .replace(/\s{2,}/g, ' ');
    }
client.login(TOKEN);
