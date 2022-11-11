const express = require('express');
const bodyParser = require('body-parser');
const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', qr => {
    console.log('QR recibido', qr);
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    console.log('Listo para enviar mensajes');
});

app.route('/').get((req, res) => {
    res.send('La API está funcionando');
});

app.post('/send', async (req, res, next) => {

    try {

        const {phone, message} = req.body;
        const msg = await client.sendMessage(`${phone}@c.us`, message);
        res.send("El mensaje se ha enviado correctamente");
        console.log("El mensaje se ha enviado correctamente");

    } catch (error) {

        console.log(error);
        res.send(error);

    }
});


app.route('/form').get((req, res) => {
    res.send(`
        <form action="/send" method="post">
            <input type="text" name="phone" placeholder="56987654321" />
            <input type="text" name="message" placeholder="Mensaje" />
            <button type="submit">Enviar</button>
        </form>
    `);
});



client.on('auth_failure', async () => {
    console.log('AUTHENTICATION FAILURE');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

client.initialize();