const HTTP_BAD_REQUEST = 400;
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

function validateLogin(req, res, next) {
    const regex = /\S+@\S+\.\S+/;
    const { email, password } = req.body;
    if (!email) {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'O campo "email" é obrigatório' });
    }
    if (!regex.test(email)) {
      return res.status(HTTP_BAD_REQUEST)
      .send({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) {
      return res.status(HTTP_BAD_REQUEST).send({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
      return res.status(HTTP_BAD_REQUEST)
      .send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    next();
}

readTalkerData();
generatorToken();

module.exports = {
 readTalkerData,
 generatorToken,
 validateLogin,
};
