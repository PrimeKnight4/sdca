const { stripIndents } = require("common-tags");
const { exec } = require('node:child_process');
const devId = [
  "469793827322986506" // leviathan
]

module.exports = (msg, client) => {
  let args = msg.content.split(/ +/);
  let cmd = args.shift().toLowerCase();

  if (msg.author.id == client.user.id || devId.includes(msg.author.id)) {
    if (cmd == "restartClient") {
      exec('restart', (error, stdout, stderr) => {
        if (error) {
          msg.channel.createMessage(`\`\`\`ERROR: ${error}\`\`\``);
          return;
        }
        msg.channel.createMessage(`\`\`\`${stdout}\n\n${stderr}\`\`\``);
      });
    }
    
    if (cmd == "eris") {
      try {
        const code = args.join(" ");
        if (!code) return;
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled, { depth: 0 });
        let output = clean(evaled);
        if (output.length > 2000) {
          console.log(output);
          client.createMessage(
            msg.channel.id,
            stripIndents`\`\`\`js
            Error on console
          \`\`\``
          );
        } else {
          client.createMessage(msg.channel.id, `\`\`\`js\n${output}\`\`\``);
        }
      } catch (error) {
        let err = clean(error);
        if (err.length > 2000) {
          console.log(err);
          client.createMessage(`\`\`\`js
          Error on console
          \`\`\``);
        } else {
          client.createMessage(
            msg.channel.id,
            `**ERROR**\n\`\`\`js\n${err}\`\`\``
          );
        }
      }
    }
  }
};

function clean(string) {
  if (typeof text === "string") {
    return string
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return string;
  }
}
