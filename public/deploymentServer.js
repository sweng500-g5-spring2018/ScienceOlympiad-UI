const path = require('path');
const express = require('express');
const app = express();

const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;

const https = require('https');
const fs = require('fs');

// Read SSL Files
const cert = fs.readFileSync('science-olympiad/keys/cert.pem');
const key = fs.readFileSync('science-olympiad/keys/privatekey.pem');
const ca = fs.readFileSync('science-olympiad/keys/chain.pem');

// Set Options
const options = {
    cert: cert,
    key: key,
    ca: ca
};


// Start Server on HTTP_SPORT
https.createServer(options, app).listen(HTTPS_PORT,error => {
    error
            ? console.error(error)
        : console.info( `==> Listening on port ${HTTPS_PORT}.  Visit https://localhost:${HTTPS_PORT}/ in your browser.`)
});

// Start HTTP Server on HTTP_PORT
app.use(express.static(path.join(__dirname, '')));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.listen(HTTP_PORT, error => {
   error
   ? console.error(error)
   : console.info( `==> Listening on port ${HTTP_PORT}.  Visit http://localhost:${HTTP_PORT}/ in your browser.`)
});