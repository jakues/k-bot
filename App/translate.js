class Translate {
  constructor(chat) {
    this.chat = chat;
  }

  extractLang(input) {
    const regex = /^\/tr\s+(\w{2})$/;
    const match = input.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      return "en";
    }
  }

  async doTranslate(apiKey, queries, source = "auto", target = "id") {
    const req = await fetch("http://freeze.masmanto.xyz:5000/translate", {
      method: "POST",
      body: JSON.stringify({
        q: queries,
        source: source,
        target: target,
        format: "text",
        api_key: apiKey
      }),
      headers: { "Content-Type": "application/json" },
    });

    try {
      const response = req.json();
      return response;
    } catch (err) {
      console.log("[error] Failed to fetch url translation: ", err);
    }
  }

  async sendTranslate(msg) {
    try {
      let text;

      if (this.chat.startsWith(msg.body, COMMAND_TR)) {
        if (msg.hasQuotedMsg) {
          const quotedMsg = await msg.getQuotedMessage();
          if (quotedMsg.body) {
            text = quotedMsg.body;
          }
          const targetLang = this.extractLang(msg.body);
          const request = await this.doTranslate(key, text, "auto", targetLang);
          const result = request.translatedText;

          await this.chat.sendReply(msg, `Translate result:\n${result}`);
        } else {
          await this.chat.sendReply(msg, "Quote chat to translate !");
        }
      }
    } catch (err) {
      console.log("[error] Failed to send translate: ", err);
    }
  }
}

const Chat = require("../vendor/chat");

const key = "8aaa6fad-8c2b-4447-9d52-e0d93204a2b7";
const COMMAND_TR = "/tr";

const chat = new Chat();
const translate = new Translate(chat);

module.exports = translate;
