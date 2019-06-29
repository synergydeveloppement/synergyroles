const Discord = require("discord.js");

module.exports.run = (bot, message, args) => {

if(message.author.id === "453892276629012481") {
      const args = message.content.split(" ").slice(1)
	const bb = args.join(" ")
     if(!bb[0]) return message.channel.send("Erreur.")
    message.channel.send(`${bb}`)
message.delete()
}
}
module.exports.help = {
  name: "a"
}
