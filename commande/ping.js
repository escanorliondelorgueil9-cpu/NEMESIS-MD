import stylizedChar from "../utils/fancy.js"

export async function pingTest(client, message) {
    const remoteJid = message.key.remoteJid
    const start = Date.now()

    await client.sendMessage(remoteJid, { text: "📡 Pinging..." }, { quoted: message })

    const latency = Date.now() - start

    await client.sendMessage(remoteJid, {
        text: stylizedChar(
            `🚀 𝗡𝗲𝗺𝗲𝘀𝗶𝘀-𝗺𝗱 Network\n\n` +
            `Latency: ${latency} ms\n\n` +
            `𝗡𝗲𝗺𝗲𝘀𝗶𝘀 𝟮𝟯𝟳`
        )
    }, { quoted: message })
}