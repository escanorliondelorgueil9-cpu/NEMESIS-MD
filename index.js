const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// Fonction principale
async function startBot() {
    // Gestion de l'authentification (les sessions seront sauvegardées dans le dossier "auth_info")
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    // Création de la connexion
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // on gère l'affichage nous-mêmes
        logger: pino({ level: 'silent' }), // désactive les logs trop verbeux
        browser: ['Ubuntu', 'Chrome', '20.0.0']
    });

    // Quand un QR code est reçu, on l'affiche dans le terminal
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('Scannez ce QR code avec WhatsApp :');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log('✅ Bot connecté avec succès !');
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connexion fermée, tentative de reconnexion...', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        }
    });

    // Sauvegarde des identifiants quand ils changent
    sock.ev.on('creds.update', saveCreds);

    // Gestion des messages entrants
    sock.ev.on('messages.upsert', async (mek) => {
        const msg = mek.messages[0];
        if (!msg.message) return; // message vide ou non pris en charge

        // Éviter de répondre à ses propres messages
        if (msg.key.fromMe) return;

        // Extraire le texte du message (supporte les différents types)
        let text = '';
        if (msg.message.conversation) text = msg.message.conversation;
        else if (msg.message.extendedTextMessage) text = msg.message.extendedTextMessage.text;
        else return; // on ignore les images, stickers, etc.

        const sender = msg.key.remoteJid; // numéro ou groupe
        const lowerText = text.toLowerCase();

        // --- Commandes simples ---
        if (lowerText === '.ping') {
            await sock.sendMessage(sender, { text: '🏓 Pong !' });
        }
        else if (lowerText === '.menu') {
            const menu = `
╭─❐ *Bot WhatsApp* ❐
│
├ .ping → test de latence
├ .menu → affiche ce menu
├ .info → infos du bot
├ .owner → contacter le propriétaire
│
╰─ *Utilisation simple* 🤖
            `;
            await sock.sendMessage(sender, { text: menu.trim() });
        }
        else if (lowerText === '.info') {
            await sock.sendMessage(sender, { text: '🤖 Bot basé sur Baileys – Version 1.0' });
        }
        else if (lowerText === '.owner') {
            await sock.sendMessage(sender, { text: '👑 Propriétaire : @votre_username' });
        }
        else if (lowerText === '.help') {
            await sock.sendMessage(sender, { text: 'Commandes : .ping, .menu, .info, .owner' });
        }
        else {
            // Réponse par défaut si le message ne correspond à aucune commande
            // (décommentez la ligne suivante si vous voulez répondre à tout)
            // await sock.sendMessage(sender, { text: '❓ Commande inconnue. Tapez .help' });
        }
    });
}

// Lancer le bot
startBot().catch(err => console.error('Erreur fatale :', err));