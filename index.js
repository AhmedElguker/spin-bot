const express = require('express');
const app = express();

app.listen(() => console.log('Server started'));

app.get('/', (req, res) => {
  res.send('تم تطوير الكود بواسطة https://discord.gg/HrbfKv2Y');
});
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  userMention,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  permissionOverwrites
} = require("discord.js");

const client = new Client({
  intents: 131071,
});

const prefix = "+"; // البريفكس

const db = require('pro.db')

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!
    Index.js  ✅
    `);
  client.user.setActivity("+s", { type: 3 });
  client.user.setStatus("idle");
});

//====================================== جميع الاكواد هنا ===================================================//

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "setprobot")){
    try {
      if (!message.member.permissions.has("ADMINISTRATOR")) return;
      const args = message.content.split(' ')
      if(!args[1]) return message.reply("قم بتحديد ايدي البروبوت")
      await db.set(`probot_${message.guild.id}` , args[1]);
      await message.reply(`تم تحديد ايدي البروبوت`);
    } catch (error) {
      console.log("probotid error :" , error)
    }
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "setreceiver")){
    try {
      if (!message.member.permissions.has("ADMINISTRATOR")) return;
      const args = message.content.split(' ')
      if(!args[1]) return message.reply("قم بتحديد ايدي مستقبل الكريدت")
      await db.set(`receiver_${message.guild.id}` , args[1]);
      await message.reply(`تم تحديد مستقبل الكريدت`);
    } catch (error) {
      console.log("receiver error :" , error)
    }
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "setprice")){
    try {
      const args = message.content.split(' ')
      if(!args[1]) return message.reply("قم بتحديد سعر اللفة")
      await db.set(`price_${message.guild.id}` , args[1]);
      await message.reply(`تم تحديد سعر اللفة`);
    } catch (error) {
      console.log(error)
    }
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "addprize")){
    try {
      const args = message.content.split(' ').slice(1).join(' ');
      if(!args) return message.reply("قم بتحديد جائزة للفة");
      await db.push(`prize_${message.guild.id}` , args);
      await message.reply(`تم اضافة جائزة \`${args}\``);
    } catch (error) {
      console.log(error)
    }
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content.startsWith(prefix + "rprize")){
    try {
      const args = message.content.toLowerCase().split(' ').slice(1).join(' ');
      if(!args) return message.reply("قم بتحديد اسم الجائزة التي ستحذفها");
      const filtered = db
      .get(`prize_${message.guild.id}`)
      .filter((pr) => pr != args);
    db.set(`prize_${message.guild.id}`, filtered);
    message.reply(`[✔] تم حذف جائزة ${args}`)
    } catch (error) {
      console.log(error)
    }
  }
})

client.on("messageCreate" , (message) => {
  if(message.content == prefix + "prizes"){
    try {
      const prizes = db.get(`prize_${message.guild.id}`);
      if(!prizes) return message.reply(`[x] ليس لديك جوائز في هذا السيرفر`);
      const prizesembed = new EmbedBuilder()
                              .setTitle(' الجوائز المتوفرة لعجلة الحظ 🎁')
                              .setDescription(`${prizes.join('\n')}`)
                              .setColor('Random');
      message.reply({embeds : [prizesembed]})
    } catch (error) {
      console.log(error)
    }
  }
})

client.on("messageCreate" , async(message) => {
  if(message.content == prefix + "s"){
    try {
      const prizes = db.get(`prize_${message.guild.id}`)
      if(!prizes)return message.reply(`قم باضافة جوائز للفة \n \`${prefix}addprize\``)
      const recipient = db.get(`receiver_${message.guild.id}`);
      if(!recipient)return message.reply(`قم بتحديد مستقبل الكريدت \n \`${prefix}setreceiver\``)
      const probot = db.get(`probot_${message.guild.id}`);
      if(!probot) return message.reply(`قم بتحديد ايدي البروبوت \n \`${prefix}setprobot\``)
      const price = db.get(`price_${message.guild.id}`);
      if(!price) return message.reply(`قم بتحديد سعر اللفة \n \`${prefix}setprice\``)
      const transfersrooms = message.channel;
      const options = db.get(`prize_${message.guild.id}`)
      const tranembed = new EmbedBuilder()
                              .setTitle("قم بالتحويل للف عجلة الحظ")
                              .setDescription(`لديك دقيقة لتحويل المبلغ المطلوب \n \`\`\` #credit ${recipient} ${price}\`\`\``)
                              .setColor('DarkButNotBlack');
      message.reply({embeds : [tranembed]})
                              const collectorFilter = m => (m.content.includes(price) && m.content.includes(price) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == probot)
  
                                 const collector = await transfersrooms.createMessageCollector({
                                   filter:collectorFilter,
                                   max: 1,
                                   time: 1000 * 60 * 1
                               });
                               collector.on("collect" , async() => {
                                const randomChoice = options[Math.floor(Math.random() * options.length)];
                                message.reply(`اوووو جاري لف العجلة 🛞 <@${message.author.id}>`).then(async(a) => {
                                  setTimeout(() => {
                                    a.delete()
                                    a.channel.send(`**لقد فزت ب ${randomChoice} 🎉 \n <@${message.author.id}>**`)
                                  }, 5000);
                                })
                                    }); 
                                  collector.on("end" , async() => {
                                              message.channel.send(`<@${message.author.id}> لا تقم بالتحويل لقد انتهى الوقت`)
                                          }); 
    } catch (error) {
      console.log(error)
    }
  }
})

client.on("messageCreate" , (message) => {
  if(message.content == prefix + 'help'){
    try {
      const helpembed = new EmbedBuilder()
      .setTitle('قائمة الاوامر الخاصة بالبوت')
      .addFields({
        name : `\`${prefix}setprobot\``,
        value : 'لتحديد ايدي البروبوت'
      },
      {
        name : `\`${prefix}setreceiver\``,
        value : 'لتحديد مستقبل الكريديت'
      },
      {
        name : `\`${prefix}setprice\``,
        value : 'لتحديد سعر اللفة'
      },
      {
        name : `\`${prefix}addprize\``,
        value : 'لاضافة جائزة'
      },
      {
        name : `\`${prefix}rprize\``,
        value : 'لحذف جائزة'
      },
      {
        name : `\`${prefix}prizes\``,
        value : 'لرؤية جوائزة اللفة'
      }
      )
      .setColor('DarkButNotBlack');

const helpbtn = new ButtonBuilder() 
      .setLabel('الدعم الفني')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.gg/tAXd9r44`);
const helprow = new ActionRowBuilder().addComponents(helpbtn);

message.reply({embeds : [helpembed] , components : [helprow]})
    } catch (error) {
      console.log(error)
    }
  }
})
//===================================== جميع الاكواد هنا ====================================================//
client.login(process.env.token); // توكن البوت 
