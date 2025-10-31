const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 });

module.exports = cache;
