fs = require('fs');
qrcode = require('qrcode');

async function teste (req, res) {
    const ans = await qrcode.toDataURL('google.com');

    fs.writeFileSync('./qr.html', `<img src="${ans}">`);
    res.status(200).end();
}

module.exports = teste;