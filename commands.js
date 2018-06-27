var remote = require('electron').remote;
var path = require('path');
var helpers = require(path.resolve( __dirname, 'helperfunctions.js'));
// describe commands

// /client
function channelDescribe(client, settings) {

    var channelListHTML = 'Text Channels <ul>';

    if (settings.selectedServer) {
        var server = client.guilds.get(settings.selectedServer);
        if (server) {
            server.channels.array().forEach(function(channel, i) {
                if (channel.type == 'text') {
                    channelListHTML += '<li> ' + i + ' ' + channel.name + '</li>';
                }
            });
            channelListHTML += '</ul>'

            // return list of chanels formatted
            return {
                'html': channelListHTML
            }
        } 
    }

    // visuals for the channel function
    return {
        'html': '<p>You must select a server before selecting a channel</p>'
    }
}

function setChannel(client, settings, args) {
    if (args.length > 0) {
        if (settings.selectedServer) {
            settings.selectedChannel = client.guilds.get(settings.selectedServer).channels.array()[parseInt(args[0])].id;
            helpers.getRecentMessages(client.guilds.get(settings.selectedServer).channels.get(settings.selectedChannel));
            return 'channel selected.';
        } else {
            return 'No server selected';
        }
    }

    return 'No channel found under that id.';
}

// /server
function serverDescribe(client, settings) {
    var serverListHTML = 'Servers <ul>'

    client.guilds.array().forEach(function(server, i) {
        serverListHTML += '<li> ' + i + ' ' + server.name + '</li>';
    });

    serverListHTML += '</ul>'

    return {
        'html': serverListHTML
    }
}

function setServer(client, settings, args) {
    if (args.length > 0) {
        settings.selectedServer = client.guilds.array()[parseInt(args[0])].id;
        settings.selectedChannel = null;
        return 'Server selected.'
    }

    return 'No server found under that id.'
}

function setToken(client, settings, args) {
    if (args.length > 0) {
        settings.token = args[0];

        remote.getCurrentWindow().reload();

        return 'Auth token set';
    }
    return 'No token provided.'
}

function exitProgram(client, settings, args) {
    remote.getCurrentWindow().close();
}

function debugCmd(client, settings, args) {
    remote.getCurrentWindow().toggleDevTools();
}

function refreshCmd(client, settings, args) {
    remote.getCurrentWindow().reload();
}

module.exports = commandList = [
    {
        'name': 'token',
        'usage': '/token [token]',
        'infoFunction': function() {return {'html':''}},
        'function': setToken,
        'saveSettings': true
    },
    {
        'name': 'channel',
        'usage': '/channel [id]',
        'infoFunction': channelDescribe,
        'function': setChannel,
        'saveSettings': true,
    },
    {
        'name': 'server',
        'usage': '/server [id]',
        'infoFunction': serverDescribe,
        'function': setServer,
        'saveSettings': true,
    },
    {
        'name': 'quit',
        'usage': '/quit',
        'infoFunction': function() {return {'html':''}},
        'function': exitProgram,
        'saveSettings': false
    },
    {
        'name': 'debug',
        'usage': '/debug',
        'infoFunction': function() {return {'html':''}},
        'function': debugCmd,
        'saveSettings': false
    },
    {
        'name': 'refresh',
        'usage': '/refresh',
        'infoFunction': function() {return {'html':''}},
        'function': refreshCmd,
        'saveSettings': false
    },
]