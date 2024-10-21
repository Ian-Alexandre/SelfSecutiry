const Discord = require("discord.js")
const { ActivityType } = require('discord.js');
const config = require("./config.json")
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const { JsonDatabase, } = require("wio.db");

const client = new Discord.Client({ 
  intents: [ 
Discord.GatewayIntentBits.Guilds,
Discord.GatewayIntentBits.GuildMessages,
Discord.GatewayIntentBits.MessageContent,
Discord.GatewayIntentBits.GuildMembers,
'32767'
       ]
    });
const config2 = require('./DatabaseJson/config.json')
module.exports = client

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
      
      try {
      cmd.run(client, interaction)
      } catch (error) {
      return interaction.reply({ content: `Ocorreu um erro ao executar o comando.`, ephemeral: true })
      }
   }
});

client.on('guildMemberAdd', member => {
  client.channels.fetch(config2.canal)
  .then(canal => {
  
  if (!canal) return
  
  const row = new Discord.ActionRowBuilder()
  .addComponents(
     new Discord.ButtonBuilder()
      .setCustomId('slaaa')
      .setLabel('Mensagem Automática')
      .setDisabled(true)
      .setStyle(2)
  )
  
  let msg = config2.mensagem
  msg = msg.replace("{user}", `${member.user}`)
  msg = msg.replace("{guildname}", `${member.guild.name}`)
  
   canal.send({ content: `${msg}`, components: [row] }).then(msg => {
    setTimeout(() => {
      msg.delete().catch(err => console.error('Mensagem já deletada'))
    }, config2.tempomsg * 1000)
  })
  })
})

client.slashCommands = new Discord.Collection()

require('./Handler')(client)

client.login(config.token)

process.on('unhandledRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n${reason.stack}`);
});

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:]\n\n${error.stack}`);
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n${error.stack}`);
});

client.on('ready', require('./Eventos/FunctionReady').run)
client.on('guildMemberAdd', require('./Eventos/Anti-Fake').run)