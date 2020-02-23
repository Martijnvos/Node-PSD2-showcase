const crypto = require("crypto");

let storage = [];

exports.get = (id) => storage[id];

exports.getAll = () => storage;

exports.add = (applicationAccessToken) => {
    const id = crypto.randomBytes(16).toString("hex");
    storage[id] = applicationAccessToken;
    return id;
}

exports.remove = (id) => {
    storage = storage.filter((value) => value !== id);
}