// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var Discord = require('discord.js');
var path = require('path');

// Local files
var autoscroll = require(path.resolve( __dirname, 'autoscroll.js'));

console.log("Starting up discord service");

function appendChat(text) {
    var html = document.getElementById("chat").innerHTML;

    document.getElementById("chat").innerHTML = html + "<p>" + text + "</p>";
}

function parseEmotes(str) {
    return str.replace(/<(.*):([0-9]*)>/, '<img src="https://cdn.discordapp.com/emojis/$2.png" height="24" width="24">');
}

function printChatMessage(msg) {
    var name = (msg.member.nickname) ? msg.member.nickname : msg.author.username;
    appendChat('[' + msg.channel.guild.name + '][' + msg.channel.name + '] <span style="color: ' + msg.member.displayHexColor + ';">' + name + '</span>: ' + parseEmotes(msg.cleanContent));
}

var client = new Discord.Client();

//client.guilds.array()
//guild.channels.array()

client.on('ready', () => {
    appendChat("Authenticated as " + client.user.username)
    appendChat(" ");

    client.guilds.array().forEach(function(server, i) {
        server.channels.array().forEach(function(channel, i) {
            /*if (['dm', 'group', 'text'].includes(channel.type)) {
                channel.fetchMessages({ limit: 10 }).then(messages => {
                    Array.prototype.reverse.call(messages);
                    messages.forEach(function(message) {
                        printChatMessage(message);
                    });
                });
            }*/
        });
    });

});

client.on('error', error => {
    appendChat(message);
});

client.on('message', msg => {
    printChatMessage(msg);
});

// input
document.getElementById('input').addEventListener('input', function() {

});

client.login("MTM2NjY2Mzk4NzQyMDIwMDk2.CetUMQ.HptJRX2QBe4CHkUiW7zwxnL0fvo").then(function() {
    console.log("Good!");
}, 
function(error) {
    appendChat(error.message);
});
