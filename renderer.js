// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var Discord = require('discord.js');
var path = require('path');
var remote = require('electron').remote;
var jetpack = require('fs-jetpack');

var window = remote.getCurrentWindow();

// Local files
var autoscroll = require(path.resolve( __dirname, 'autoscroll.js'));
var commands = require(path.resolve( __dirname, 'commands.js'));
var helpers = require(path.resolve( __dirname, 'helperfunctions.js'));


// settings for now
var settings = {
    'selectedServer':null,
    'selectedChannel':null,
    'token': null
}
var settingsFileName = 'discordMicroSettings.json';

// load settings
if (jetpack.exists(settingsFileName)) {
    var settings = jetpack.read(settingsFileName, 'json');
    helpers.appendChat('loading previous state');
} else {
    jetpack.write(settingsFileName, settings);
    helpers.appendChat('settings file generated <br> set your auth token using /token');
}

function getActiveChannel() {
    if (settings.selectedServer && settings.selectedChannel) {
        return client.guilds.get(settings.selectedServer).channels.get(settings.selectedChannel);
    }
    return null;
}

console.log("Starting up discord service");
var client = new Discord.Client();

//client.guilds.array()
//guild.channels.array()

client.on('ready', () => {
    helpers.appendChat("Authenticated as " + client.user.username)
    helpers.appendChat(" ");

    if (settings.selectedServer && settings.selectedChannel) {
        var server = client.guilds.get(settings.selectedServer);
        var channel = server.channels.get(settings.selectedChannel);

        helpers.getRecentMessages(channel);
        window.scrollBy(0,document.body.scrollHeight);
    } else {
        
        helpers.appendChat("Type /server to switch server.")
        helpers.appendChat("Type /channel to switch channels.")
    }

});

client.on('error', error => {
    helpers.appendChat(message);
});

client.on('message', msg => {

    if (msg.type == 'DEFAULT' && msg.channel.guild.id == settings.selectedServer && msg.channel.id == settings.selectedChannel) {
        helpers.printChatMessage(msg);

        // Window flash
        if (!window.isFocused()) {
            window.flashFrame(true);
            window.once('focus', () => win.flashFrame(false));
        }
    }
});

function infoPanelParse(text) {
    var infoPanel = document.getElementById('infoPanel');

    if (text != "") {
        if (text.search(/^\//) != -1) { // potential command call

            if (text.length > 1) {
                var inputCommand = text.match(/^\/[^\s.]*/)[0].replace('/', ''); // command without arguments

                var closestCommand = commands.find(function(a,b) { return a.name.includes(inputCommand); });

                if (closestCommand) {

                    var info = closestCommand.infoFunction(client, settings);
                    
                    console.log(info);
                    //infoPanel.style.height = '' + (info.height + 50) + 'px';
                    infoPanel.innerHTML = info.html;
                    infoPanel.innerHTML += closestCommand.usage;
                    return;
                }

            } else {

                var commandsAsList = "";
                commandList.forEach(cmd => { commandsAsList +=  "/" + cmd.name + " "; });
                infoPanel.innerHTML = commandsAsList;
                return;

            }
        }
    }
    
    var channel = getActiveChannel();
    if (channel) {
        infoPanel.innerHTML = 'sending to ' + channel.guild.name + '.' + channel.name;
        return;
    }
    infoPanel.innerHTML = "sending to none";
}

// input
var input = document.getElementById('input');
input.addEventListener('input', function() {

    infoPanelParse(input.value);
});

input.addEventListener('keydown', function(event) {

    if (event.keyCode == 13) {
        console.log("input: ", input.value);

        // check for command call
        if (input.value.search(/^\//) != -1) {
            // \s[^\s.]* for each arg ^\/[^\s.]* for command name
            var inputCommand = input.value.match(/^\/[^\s.]*/)[0].replace('/', ''); // command without arguments
            var args = input.value.match(/\s[^\s]*/g); // get all arguments

            var commandInfo = commands.find(function(a,b) { return a.name.includes(inputCommand); });
            
            if (args) {
                // remove all whitespaces from individual args
                for (var i = 0; i < args.length; i++) {
                    args[i] = args[i].replace(/\s/g,''); 
                }
            } else {
                args = []
            }
            //args.map(arg => arg.replace(/\s/g,'')); 
            
            console.log(inputCommand, args, commandInfo);
            var returnString = commandInfo.function(client, settings, args);
            helpers.appendChat(returnString);
            
            if (commandInfo.saveSettings) {
                // save settings
                console.log('writing to settings');
                jetpack.write(settingsFileName, settings);
            }

        } else {
            // normal message stuff

            if (settings.selectedServer && settings.selectedChannel) {
                // todo: cache these
                var server = client.guilds.get(settings.selectedServer);
                if (server) {
                    var channel = server.channels.get(settings.selectedChannel);
                    if (channel) {
                        channel.send(input.value);
                    }
                }
            }
        }

        input.value = "";
        infoPanelParse("");
    }
});

if (settings.token) {
    client.login(settings.token).then(function() {
        console.log("Good!");
    }, 
    function(error) {
        helpers.appendChat(error.message);
    });
} else {
    helpers.appendChat('Use /token to authenticate with discord.')
}
