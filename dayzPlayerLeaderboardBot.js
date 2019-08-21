const Discord = require('discord.js')
const client = new Discord.Client()
const jsftp = require("jsftp");
const Player = require("./Player.js");
var async = require("async");
var fs = require('fs')

const settings = require('./settings.json');
var fileNames = [];
var playerData = [];
var leaderboard = [];
var position = 1;

const ftp = new jsftp({
  host: settings.ftpHost,
  port: settings.ftpPort, // defaults to 21
  user: settings.ftpUser, // defaults to "anonymous"
  pass: settings.ftpPass, // defaults to "@anonymous"
  debugMode: true
});

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    switch (primaryCommand) {
      case 'help':
        helpCommand(arguments, receivedMessage)
        break;
      case 'leaderboard':
        generateLeaderboard(arguments, receivedMessage)
        break;
      case 'test':
        generateLeaderboard(arguments, receivedMessage)
        break;
      default: receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function generateLeaderboard(arguments, receivedMessage)
{
  fileNames = [];
  playerData = [];
  leaderboard = ["\tRank\tDeaths\tKills\tLongest Shot\tZombie Kills\tTime Alive\tDistance Traveled"];
  position = 1;
  ftp.ls("Admin/Leaderboard",(err, res) => {
    res.forEach(file =>fileNames.push(file.name));
    //console.log("\nFile Names are: "+fileNames);
    //console.log(fileNames);
    obtainFile();
    setTimeout(function() {
     fileNames.forEach(file => compilePlayers(file));
     sortPlayers(playerData);
     playerData.forEach(player => writeLeaderboard(player,position));
     leaderboard.forEach(entry => receivedMessage.channel.send(entry));
     //console.log(playerData);
   }, 2000);
  });
}

function obtainFile()
{
  async.eachLimit(
    fileNames,
    1,
    function(file, cb) {
        ftp.get(settings.serverProfilePath+file, "./playerJsons/"+file,function(err) {
            if (err) return cb(err)
        //    console.log('downloaded ' + file);
            cb()
        })
    },
    function(err) {
        if (err) return console.log(err)
      //  console.log('all files were downloaded');
    }
  )
}

function compilePlayers(file)
{
  var dataFile = fs.readFileSync("./playerJsons/"+file, 'utf8');
  var data = JSON.parse(dataFile);
  let p1 = new Player(data.name,data.deaths,data.kills,data.longestShot,data.zKilled,data.timeSurvived,data.distTrav);
  playerData.push(p1);

}

function sortPlayers(list)
{
  list.sort((a, b) => (a.timeSurvived < b.timeSurvived) ? 1 : -1)
}

function writeLeaderboard(player,pos)
{
  leaderboard.push(pos+". "+player.name+"\t\t"+player.deaths.length+"\t\t\t\t"+player.playerKills.length+"\t\t\t"+player.longestShot+"m\t\t\t\t"+player.zedKills+"\t\t\t\t"+player.timeSurvived+"secs\t\t\t\t"+player.distTraveled+"m\n");
  position = pos + 1;
}



// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = settings.token

client.login(bot_secret_token)
