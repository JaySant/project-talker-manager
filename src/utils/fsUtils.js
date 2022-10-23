const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

async function readTalkerData() {
    try {
        const talkerData = await fs.readFile(path.resolve(__dirname, '../talker.json'));
        const talkerJson = JSON.parse(talkerData);
        return talkerJson;
    } catch (error) {
        console.error(error);
    }
}

function generatorToken() {
    return crypto.randomBytes(8).toString('hex');
}

readTalkerData();
generatorToken();

module.exports = {
 readTalkerData,
 generatorToken,
};
