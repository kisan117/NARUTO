const fs = require("fs");
const path = __dirname + "/aaryan/aaryan.json";

module.exports.config = {
  name: "lock",
  version: "beta",
  hasPermission: 1,
  credits: "SHANKAR SUMAN",
  description: "Lock or unlock the group name.",
  commandCategory: "group admin",
  usages: "lock on/off",
  cooldowns: 0
};

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) {
    console.log("[lock] aaryan.json not found, creating new file...");
    fs.writeFileSync(path, JSON.stringify({}));
  } else {
    console.log("[lock] aaryan.json file found.");
  }
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { threadID, isGroup } = event;
  if (!isGroup) {
    // Not a group, ignore
    return;
  }

  console.log(`[lock][handleEvent] Event in group ${threadID}`);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.error("[lock][handleEvent] Error reading JSON:", err);
    return;
  }

  let threadData;
  try {
    threadData = await Threads.getData(threadID);
  } catch (err) {
    console.error("[lock][handleEvent] Error getting thread data:", err);
    return;
  }

  let threadName = threadData.threadInfo?.threadName;
  if (!threadName) {
    console.log("[lock][handleEvent] No threadName found.");
    return;
  }

  if (!data[threadID]) {
    data[threadID] = { namebox: threadName, status: true };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log(`[lock][handleEvent] Initialized data for thread ${threadID}`);
  }

  if (!data[threadID].namebox) {
    console.log("[lock][handleEvent] namebox is null or undefined");
    return;
  }

  if (threadName !== data[threadID].namebox && data[threadID].status === false) {
    console.log(`[lock][handleEvent] Name changed but lock is off, updating namebox to: ${threadName}`);
    data[threadID].namebox = threadName;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return;
  }

  if (threadName !== data[threadID].namebox && data[threadID].status === true) {
    console.log(`[lock][handleEvent] Name changed and lock is ON, resetting title to: ${data[threadID].namebox}`);
    api.setTitle(data[threadID].namebox, threadID, () => {
      api.sendMessage("Group name is locked. You cannot change it.", threadID);
    });
  }
};

module.exports.run = async function ({ api, event, permission, Threads, args }) {
  const { threadID } = event;
  if (permission == 0) {
    api.sendMessage("Only admins can use this command.", threadID);
    console.log("[lock][run] User tried to run command without permission");
    return;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.error("[lock][run] Error reading JSON:", err);
    return;
  }

  let threadData;
  try {
    threadData = await Threads.getData(threadID);
  } catch (err) {
    console.error("[lock][run] Error getting thread data:", err);
    return;
  }

  let threadName = threadData.threadInfo?.threadName;

  if (!data[threadID]) {
    data[threadID] = { namebox: threadName, status: true };
    console.log(`[lock][run] Initialized data for thread ${threadID}`);
  }

  const input = args[0]?.toLowerCase();
  if (input === "on") {
    data[threadID].status = true;
  } else if (input === "off") {
    data[threadID].status = false;
  } else {
    api.sendMessage("Usage: lock on / lock off", threadID);
    console.log("[lock][run] Invalid args passed:", args);
    return;
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`[lock][run] Set status to ${data[threadID].status} for thread ${threadID}`);

  api.sendMessage(
    `✅ मेरे बॉस डेविल शराबी ने ${data[threadID].status ? "ग्रुप नाम लॉक कर दिया" : "ग्रुप नाम अनलॉक कर दिया"} लव यू डेविल शराबी`,
    threadID
  );
};

// Optional: Get prefix for a specific thread
function PREFIX(t) {
  var dataThread = global.data.threadData.get(t) || {};
  return dataThread.PREFIX || global.config.PREFIX;
}
