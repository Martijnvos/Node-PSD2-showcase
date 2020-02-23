const https = require('https');
const fs = require('fs');
const path = require('path');

const httpHost = "api.sandbox.ing.com";
const certPath = "../certs"; // path of the folder with downloaded certificates and keys

const callApi = (options, payload) => {
    return new Promise((resolve, reject) => {
        const request = https.request(options, function(result) {
            let body = '';
            
            result.on('data', function(chunk) {
                body = body + chunk;
            });
    
            result.on('end', function() {
                const json = JSON.parse(body);
                resolve(json);
            });
        });

        request.on('error', function(e) {
            console.error('The following error occurred:');
            console.error(e);
            reject(e);
        });
    
        if (payload !== null) request.write(payload);
        request.end();
    });
}

exports.fetchAccessToken = async (endpoint, httpMethod, digest, reqDate, signature, payload) => {
    const keyId = "SN=499602D2"; // Serial number of the downloaded certificate in hexadecimal code
    
    const cert = fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_signing.cer`), "utf-8");
    // Trim newlines
    const trimmedCert = cert.replace(/\n|\r/g, "");

    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Digest': digest,
            'Date': reqDate,
            'TPP-Signature-Certificate': trimmedCert,
            'Authorization': `Signature keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    const json = await callApi(options, payload);
    return json.access_token;
}

exports.fetchAuthorizationUrl = async (endpoint, httpMethod, digest, reqDate, signature, payload, applicationAccessToken) => {
    const keyId = "5ca1ab1e-c0ca-c01a-cafe-154deadbea75";

    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Digest': digest,
            'Date': reqDate,
            'Authorization': `Bearer ${applicationAccessToken}`,
            'Signature': `keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    const json = await callApi(options, payload);
    return json.location;
}

exports.fetchCustomerAccessToken = async (endpoint, httpMethod, digest, reqDate, signature, payload, clientId, applicationAccessToken) => {
    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Digest': digest,
            'Date': reqDate,
            'Authorization': `Bearer ${applicationAccessToken}`,
            'Signature': `keyId="${clientId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    const json = await callApi(options, payload);
    return { accessToken: json.access_token, refreshToken: json.refresh_token };
}

exports.fetchAccountInformation = async (endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken) => {
    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Digest': digest,
            'Date': reqDate,
            'Authorization': `Bearer ${customerAccessToken}`,
            'Signature': `keyId="${clientId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    return callApi(options, null);
}

exports.fetchAccountBalance = async (endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken) => {
    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Digest': digest,
            'Date': reqDate,
            'Authorization': `Bearer ${customerAccessToken}`,
            'Signature': `keyId="${clientId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    return callApi(options, null);
}

exports.fetchTransactionHistory = async (endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken) => {
    const options = {
        hostname: httpHost,
        path: endpoint,
        method: httpMethod.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Digest': digest,
            'Date': reqDate,
            'Authorization': `Bearer ${customerAccessToken}`,
            'Signature': `keyId="${clientId}",algorithm="rsa-sha256",headers="(request-target) date digest",signature="${signature}"`,
        },
        cert: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.cer`)),
        key: fs.readFileSync(path.resolve(__dirname, `${certPath}/example_eidas_client_tls.key`)),
    };

    return callApi(options, null);
}