const utilMaker = require('utility-maker');
const baseDir = __dirname;

module.exports = utilMaker()
    .mixinNodeUtil()
    .mixinRecommends()
    .mixinRecommends('lodash', require('lodash'))
    .load([
        'third_party',
    ], {baseDir})
    .load([
        'overrides',
    ], {baseDir, override: true})
    .load([
        'custom',
    ], {baseDir})
    .done();
