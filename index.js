const express = require('express');
const bodyParser = require('body-parser');
const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qr-image');
const fs = require('fs');
const db = require('mariadb');
const dotenv = require('dotenv');

dotenv.config();

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

const pool = db.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

pool.getConnection()
    .then(conn => {
        console.log('Connected to database');
        conn.end();
    })
    .catch(err => {
        console.log('Error connecting to database');
        console.log(err);
    });


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox'],
  }
  });

client.on('qr', qr => {
    console.log('QR recibido', qr);
    let qr_svg = qrcode.image(qr, { 
        type:'svg', margin: 4
    });
    const path = `${process.cwd()}/tmp`;
    qr_svg.pipe(fs.createWriteStream('tmp/qr.svg'));
    console.log('QR guardado en', path);
    console.log('Escanee el QR en el navegador /qr');
});

client.on('ready', () => {
    console.log('Listo para enviar mensajes');
});

app.route('/').get((req, res) => {
    res.send('La API está funcionando');
});

app.route('/qr').get((req, res) => {
    // send svg file to browser to display qr code.
    sendQr();

    function sendQr() {
        res.sendFile('tmp/qr.svg', { root: __dirname });
    }
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

// post route to save commands and messages to database.
app.post('/save', async (req, res, next) => {

    try {

        const {command, message} = req.body;
        const sql = 'INSERT INTO commands (command, message) VALUES (?, ?)';
        const values = [command, message];
        const conn = await pool.getConnection();
        const rows = await conn.query(sql, values);
        conn.end();
        res.send("El comando se ha guardado correctamente");
        console.log("El comando se ha guardado correctamente");


    } catch (error) {

        console.log(error);
        res.send(error);

    }

});

// client response to commands with his own messages.
client.on('message', async msg => {

    try {

        const sql = 'SELECT * FROM commands WHERE command = ?';
        const values = [msg.body];
        const conn = await pool.getConnection();
        const rows = await conn.query(sql, values);
        conn.end();

        if (rows.length > 0) {
            await msg.reply(rows[0].message);
        }else{
            await msg.reply("No entiendo el comando");
        }
        console.log("El comando se ha guardado correctamente");
    }
    catch (error) {

        console.log(error);

    }

});


// get route to get all commands from database.
app.get('/commands', async (req, res, next) => {

    try {

        const sql = 'SELECT * FROM commands';
        const conn = await pool.getConnection();
        const rows = await conn.query(sql);
        conn.end();
        res.send(rows);

    } catch (error) {

        console.log(error);
        res.send(error);

    }

});



client.on('auth_failure', async () => {
    console.log('AUTHENTICATION FAILURE');
});


const PORT = 3000;
app.listen(PORT, () => console.log(`@ http://localhost:${PORT}`));

client.initialize();