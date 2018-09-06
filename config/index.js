const env = 'test';
var config = {};
module.exports = Object.assign({}, config, require(`./${env}.js`) || {});