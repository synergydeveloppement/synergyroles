 const Discord = require("discord.js");

module.exports.run = (bot, message) => {
   
  const pingembed = new Discord.RichEmbed()
       .setTitle("Ping !")
       .setColor("RANDOM")
       .setDescription(`Pong :ping_pong: \n\nLattence en *ms* : ${Date.now() - message.createdTimestamp}ms`)
       .setFooter("Sam-Bot | ")
       .setTimestamp()
       message.channel.send(pingembed)
} 
module.exports.help = {
  name: "ping"
}
