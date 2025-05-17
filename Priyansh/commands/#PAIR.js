module.exports.config = {
  name: "pair",
  version: "1.0.1", 
  hasPermssion: 0,
  credits: "D-Jukie (Modified by MR.DEVIL)",
  description: "Random Love Pairing with Dynamic GIF",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 15
};

module.exports.run = async function({ api, event, Threads, Users }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
  const botID = api.getCurrentUserID();
  const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
  
  var id = listUserID[Math.floor(Math.random() * listUserID.length)];
  var namee = (await Users.getData(event.senderID)).name;
  var name = (await Users.getData(id)).name;

  var arraytag = [
    { id: event.senderID, tag: namee },
    { id: id, tag: name }
  ];

  // Avatar of both users
  let Avatar = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

  let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

  // Random GIF list
  const gifLinks = [
    "https://i.imgur.com/MBETCWy.gif",
    "https://i.ibb.co/zT8WDnw6/2f82bb5524663e046922d08a1cdb2ddd.gif",
    "https://i.ibb.co/nNfvqFXS/b93f702c925cb7251d28c2bba8d25fef.gif",
    "https://i.ibb.co/zk4R1dp/4cf09ab7ccb124e03914aa1679057873.gif",
    "https://i.ibb.co/Xxz0ZQbj/40d6dd4f1113fcd45a2a7a13ce9a71f0.gif",
  ];

  const randomGif = gifLinks[Math.floor(Math.random() * gifLinks.length)];

  let gifLove = (await axios.get(randomGif, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/giflove.gif", Buffer.from(gifLove, "utf-8"));

  var imglove = [
    fs.createReadStream(__dirname + "/cache/avt.png"),
    fs.createReadStream(__dirname + "/cache/giflove.gif"),
    fs.createReadStream(__dirname + "/cache/avt2.png")
  ];

  var tle = Math.floor(Math.random() * 101);
  var msg = {
    body: `‎[•||•●•||•┼┼──🌸𝐓ʋ𝗺𝘀𝗮 𝐊❍ıı 𝐏ɣ𝗮𝗮ɽ𝗮 𝐊❍ıı  𝐌𝗮𝘀❍𝗺 𝐍𝗮Ħıı 𝐇𝐚ıı•||•🐬•||•]]
🌹✦━━━━━🌹━━🌹━━━━━✦🌹\n
[•||•●•||•┼┼──🌸🌿𝐓ʋ𝗺 𝐉𝗮𝗮η  𝐇❍ 𝐌ƏɽƏ 𝐓ʋ𝗺ĦƏ 𝐌𝗮ɭʋ𝗺 𝐍𝗮Ħıı 𝐇𝐚ıı•||•🌸•||• ]]\n🌹✦━━━━━🌹━━🌹━━━━━✦🌹\n𝗟𝗼𝘃𝗲 𝗥𝗮𝘁𝗶𝗼 :❣️[${tle}%]👈❤️‍🩹💫\n\n${namee} ❣️ ${name}`,
    mentions: arraytag,
    attachment: imglove
  };

  return api.sendMessage(msg, event.threadID, event.messageID);
};
