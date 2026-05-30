import fs from "fs"
import stylizedChar from "./fancy.js"

export default function stylizedCardMessage(text) {
  return {
    text: stylizedChar(text),
    contextInfo: {
      externalAdReply: {
        title: "ᴋɪɴɢ 𝗡𝗘𝗠𝗘𝗦𝗜𝗦",
        body: "𝗡𝗘𝗠𝗘𝗦𝗜𝗦-𝗠𝗗",
        thumbnail: fs.readFileSync("./database/DigiX.jpg"),
        sourceUrl: "https://whatsapp.com",
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}