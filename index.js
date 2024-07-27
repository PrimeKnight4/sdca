require("./server.js");

const Eris = require("eris");
const DCHS = require("dchs");
const users = require("./users.js")
const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;

for (let i = 0; i < users.length; i++) {
  createClient(
    users[i].token,
    users[i].data,
    users[i]?.timeout ?? 30,
  );
}

function createClient(token, data, timeout = 30) {
  if(!token.match(tokenRegex)) return;
  
  const client = new Eris(token, { intents: ["guildMessages"] });
  const dchs = new DCHS(client);
  
  setTimeout(() => {
    dchs.spams("571992648190263317", data.channels, data.messages)
  }, timeout * 1000);
  
  client.on("error", (err) => console.log("ERROR: " + err));
  client.on("messageCreate", (msg) => require("./messageCreate")(msg, client));
  client.connect();
  return;
}