const express = require('express');

const crypto = require("./utils/cryptoUtil");
const apiCalls = require("./utils/apiCalls");
const temporaryStorage = require("./utils/temporaryStorage");

const clientId = "5ca1ab1e-c0ca-c01a-cafe-154deadbea75";
const scope = "payment-accounts%3Abalances%3Aview%20payment-accounts%3Atransactions%3Aview";
const urlScope = "payment-accounts:balances:view%20payment-accounts:transactions:view";
const redirectUri = "http://localhost:3000/authorization-token";

///////////////////////////////////// Express configuration //////////////////////////////////////////////////

const app = express()
const port = 3000

app.get('/', async (req, res) => {
    const applicationAccessToken = await getApplicationAccessToken();

    // Save the application access token for later use
    const id = temporaryStorage.add(applicationAccessToken);

    const authorizationUrl = await getAuthorizationUrl(applicationAccessToken);
    // Redirect with the corresponding ID of the application access token so we can access it later
    res.redirect(`${authorizationUrl}/?&client_id=${clientId}&scope=${urlScope}&state=${id}&redirect_uri=${redirectUri}`);
})

app.get('/authorization-token', async (req, res) => {
    const authorizationCode = req.query.code;
    
    // Fetch the corresponding application access token
    const id = req.query.state;
    const applicationAccessToken = temporaryStorage.get(id);

    const tokens = await getCustomerAccessToken(authorizationCode, applicationAccessToken);
   
    const customerAccessToken = tokens.accessToken;
    const accountInfo = await getAccountInformation(customerAccessToken);

    const resourceId = accountInfo.accounts[0].resourceId;
    const accountBalance = await getAccountBalance(resourceId, customerAccessToken);
    console.log(accountBalance);

    const transactionHistory = await getTransactionHistory(resourceId, customerAccessToken);
    console.log(transactionHistory);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

///////////////////////////////////// Express configuration //////////////////////////////////////////////////

function getApplicationAccessToken() {
    // httpMethod value must be in lower case
    const httpMethod = "post";
    const endpoint = "/oauth2/token";

    // You can also provide scope parameter in the body E.g. "grant_type=client_credentials&scope=greetings%3Aview"
    // scope is an optional parameter. If you don't provide a scope, the accessToken is returned for all available scopes
    const payload = "grant_type=client_credentials";
    const digest = crypto.calculateDigest(payload);

    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchAccessToken(endpoint, httpMethod, digest, reqDate, signature, payload);
}

function getAuthorizationUrl(applicationAccessToken) {    
    // httpMethod value must be in lower case
    const httpMethod = "get";
    const endpoint = `/oauth2/authorization-server-url?scope=${scope}&redirect_uri=${redirectUri}&country_code=NL`;

    const payload = "";
    // Digest value for an empty body
    const digest = "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=";

    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchAuthorizationUrl(endpoint, httpMethod, digest, reqDate, signature, payload, applicationAccessToken);
}

function getCustomerAccessToken(authorizationCode, applicationAccessToken) {
    // httpMethod value must be in lower case
    const httpMethod = "post";
    const endpoint = `/oauth2/token`;

    const payload = `grant_type=authorization_code&code=${authorizationCode}`;
    const digest = crypto.calculateDigest(payload);

    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchCustomerAccessToken(endpoint, httpMethod, digest, reqDate, signature, payload, clientId, applicationAccessToken);
}

function getAccountInformation(customerAccessToken) {
    // httpMethod value must be in lower case
    const httpMethod = "get";
    const endpoint = `/v3/accounts`;

    // Digest value for an empty body
    const digest = "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=";
    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchAccountInformation(endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken);
}

function getAccountBalance(resourceId, customerAccessToken) {
    // httpMethod value must be in lower case
    const httpMethod = "get";
    // resourceId cannot be substituted by any arbitrary value in the sandbox environment
    // This parameter can only be used in production
    const endpoint = `/v3/accounts/181fdfd4-5838-4768-b803-91ae2192f901/balances?balanceTypes=expected`;

    // Digest value for an empty body
    const digest = "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=";
    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchAccountBalance(endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken);
}

function getTransactionHistory(resourceId, customerAccessToken) {
    
    // httpMethod value must be in lower case
    const httpMethod = "get";
    // resourceId cannot be substituted by any arbitrary value in the sandbox environment
    // This parameter can only be used in production
    const endpoint = `/v2/accounts/450ffbb8-9f11-4ec6-a1e1-df48aefc82ef/transactions?dateFrom=2016-10-01&dateTo=2016-11-21&limit=10`;

    // Digest value for an empty body
    const digest = "SHA-256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=";
    const reqDate = new Date().toUTCString();

    // signingString must be declared exactly as shown below in separate lines with a linebreak (\n)
    const signingString=`(request-target): ${httpMethod} ${endpoint}\ndate: ${reqDate}\ndigest: ${digest}`;
    const signature = crypto.calculateSignature(signingString);

    return apiCalls.fetchTransactionHistory(endpoint, httpMethod, digest, reqDate, signature, clientId, customerAccessToken);
}