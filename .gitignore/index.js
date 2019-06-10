const Discord = require('discord.js')
const bot = new Discord.Client()
let prefix = ("!")

bot.on("ready",  () => {
    console.log(`${bot.guilds.size} et ${bot.users.size} `)
    bot.user.setPresence({
        game: {
            name: 'Vous attribues des rôles ',
            type: "STREAMING",
            url: "https://www.twitch.tv/tv_synergy"
        }
    });
})


const setupCMD = "!verified"
let initialMessage = `**Pour avoir accès au serveur merci de cocher la réaction ci-dessous**`;
const roles = ["Verified"];
const reactions = ["✅"];
 
 
//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`Si vous n'avez pas le rôle **"${role}"** vous n"aurez pas accès au serveur`); //DONT CHANGE THIS
    return messages;
}
 
 
bot.on("message", message => {
    if (message.member.hasPermission("SEND_MESSAGES") && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        console.log('error')
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                }
            });
        }
    }
})
 
 
bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
       
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        console.log('error')
       
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
       
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
               
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj);
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }  
});
bot.on("message", message => {
 if (message.content === prefix + "help"){
    let helpembed = new Discord.RichEmbed()
    .setTitle("Commande help !")
    .setDescription("Commandes Disponibles : !verified \n !ping \n !addrole + @ + le nom du role : permet d'attribuer un role à une personne")
    .setFooter("SynergyRôles")
    .setTimestamp()
    .setColor('RANDOM')
message.channel.send(helpembed)
 }
})
var fs = require('fs')
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Aucun fichier(s) trouvé");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} chargé !`);
    bot.commands.set(props.help.name, props);
  });

});

bot.on("message", message => {
if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args)
})
bot.login(process.env.TOKEN)
