require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config);
const { Partials, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});
let prompt = "私たちはこの世界に生きています。これから世界について記述したいと思います。でも世界について記述することはかんたんではありません。でももっともらしいことを世界についてに述べることで私たちは自由になれる可能性がありますね。";

client.once('ready', () => { // 2
    console.log('Ready!');
});


const reply = (message, content) => {
  message.channel.send({ // 3
    content: `${content}`,
    reply: {messageReference: message.id},
    allowedMentions: { repliedUser: false },
  });
}

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  if (message.channel.name !== "世界記述体") return;
  console.log(message.cleanContent);
  (async () => {
    const gptResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt + message.cleanContent,
      "max_tokens": 300,
    });
    console.log(gptResponse.data.choices);
    if (gptResponse.data.choices[0].text === "") {
      return
    };
    reply(message, gptResponse.data.choices[0].text);
  })();
});

client.login(process.env.BOT_TOKEN);
