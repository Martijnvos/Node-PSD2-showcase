const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const certPath = "../certs"; // path of the folder with downloaded certificates and keys

exports.calculateDigest = (payload) => {
    const base64sha256 = crypto
        .createHash("sha256")
        .update(payload, "utf-8")
        .digest("base64");
    
    return 'SHA-256=' + base64sha256;
}

exports.calculateSignature = (signingString) => {
    const key = fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_signing.key`));
    const signature = crypto
        .createSign('RSA-SHA256')
        .update(signingString)
        .sign(key, 'base64');
    
    return signature;
}