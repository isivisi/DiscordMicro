

// Append something to the screen
function appendChat(text) {
    var html = document.getElementById("chat").innerHTML;

    document.getElementById("chat").innerHTML = html + "<p>" + text + "</p>";
}

function parseEmotes(str) {
    return str.replace(/<:([^\s.]*):([0-9]*)>/g, '<img src="https://cdn.discordapp.com/emojis/$2.png" height="18" width="18">');
}

function printChatMessage(msg) {
    console.log(msg.cleanContent);
    var name = (msg.member.nickname) ? msg.member.nickname : msg.author.username;

    var msgHTML = '<span class="guildInfo">' + msg.channel.guild.name + '</span>.<span class="channelInfo">' + msg.channel.name + '</span>';
    msgHTML += ' <span title="' + msg.author.username + '" style="color: ' + msg.member.displayHexColor + ';">' + name + '</span>: ';
    msgHTML += parseEmotes(msg.cleanContent)

    appendChat(msgHTML);
    
    // attachments
    msg.attachments.forEach(attachm => {
        if (attachm.height) { 
            appendChat('<img class="attachImg" style="height=' + attachm.height + 'px" src="' + attachm.url + '">');
        } else {
            appendChat(attachm.url);
        }
    });

    // embeds
    msg.embeds.forEach(embed => {
        console.log('embed');
        if(embed.image && embed.image.url) {
            appendChat('<img class="attachImg" src="' + embed.image.url + '">');
        }

        if (embed.video && embed.video.url) {
            appendChat('<video> <source src="' + embed.video.url + '"><video>');
        }
    });
}

function getRecentMessages(channel) {
    messageList = []
    channel.fetchMessages({ limit: 100 }).then(messages => {
        //Array.prototype.reverse.call(messages);
        messages.forEach(function(message) {
            messageList.push(message);
        });
    }).then(function() {
        messageList.reverse().forEach(message => {
            printChatMessage(message);
        });

        appendChat('Listening on <<span class="guildInfo">' + channel.guild.name + '</span>.<span class="channelInfo">' + channel.name + '</span>>')
        window.scrollBy(0,document.body.scrollHeight);
    });
}

module.exports = {getRecentMessages, printChatMessage, appendChat}