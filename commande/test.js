import configmanager from "../utils/configmanager.js";

const number = 𝟮𝟯𝟳𝟲𝟳𝟰𝟰𝟬𝟬𝟴𝟱𝟭
configmanager.config.users[number] = {
    sudoList: ['𝟮𝟯𝟳𝟲𝟳𝟰𝟰𝟬𝟬𝟴𝟱𝟭@s.whatsapp.net'],
    tagAudioPath: "tag.mp3",
    antilink: false,
    response: true,
    autoreact: false,
    prefix: ".",
    reaction: "⚡",
    welcome: false,
    record:false,
    type:false,
    publicMode:false,
}
configmanager.save()

configmanager.premiums.premiumUser[`p`] = {
    premium: number,
} 
configmanager.saveP()