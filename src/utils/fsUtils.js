const fs = require('fs').promises;
const path = require('path');

async function readTalkerData() {
    try {
        const talkerData = await fs.readFile(path.resolve(__dirname, '../talker.json'));
        const talkerJson = JSON.parse(talkerData);
        return talkerJson;
    } catch (error) {
        console.error(error);
    }
}

readTalkerData();

module.exports = {
 readTalkerData,
};
