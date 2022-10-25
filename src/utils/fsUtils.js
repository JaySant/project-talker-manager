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

async function updateTalkerData(id, updatedTalkerData) {
  const oldTalker = await readTalkerData();
  const updateTalker = { id, ...updatedTalkerData };
  const updateTalkers = oldTalker.reduce((talkerList, currentTalker) => {
    if (currentTalker.id === updateTalker.id) return [...talkerList, updateTalker];
    return [...talkerList, currentTalker];
  }, []);
  try {
    await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(updateTalkers));
    return updateTalker;
  } catch (error) {
    console.error(error);
  }
}

async function deleteTalker(id) {
  const talkerData = await readTalkerData();
  const updateTalker = talkerData
  .findIndex((currentTalker) => Number(currentTalker.id) === Number(id));
  talkerData.splice(updateTalker, 1);
  try {
    await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(updateTalker));
  } catch (error) {
    console.error(error);
  }
}

async function writeTalker(newTalker) {
  try {
      const oldTalker = await readTalkerData();
      oldTalker.push(newTalker);
      return await fs.writeFile(path.resolve(__dirname, '../talker.json'), 
      JSON.stringify(oldTalker));
  } catch (error) {
    console.error(error);
   }
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

function validateToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}

function validateName(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).send({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function validateAge(req, res, next) {
  const { age } = req.body;
  if (!age) {
    return res.status(400).send({ message: 'O campo "age" é obrigatório' });
  }
  if (Number(age) < 18) {
    return res.status(400).send({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
}

function validateTalk(req, res, next) {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).send({ message: 'O campo "talk" é obrigatório' });
  }
  next();
}

function validateWatched(req, res, next) {
  const { talk } = req.body;
  const date = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (!talk.watchedAt) {
    return res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!date.test(talk.watchedAt)) {
    return res.status(400).send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}

function validateRate(req, res, next) {
  const { talk } = req.body;

  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).send({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!talk.rate) {
    return res.status(400).send({ message: 'O campo "rate" é obrigatório' });
  }

  next();
}
 
readTalkerData();
generatorToken();
writeTalker();
updateTalkerData();
deleteTalker();

module.exports = {
 readTalkerData,
 generatorToken,
 validateLogin,
 writeTalker,
 validateName,
 validateAge,
 validateTalk,
 validateWatched,
 validateRate,
 validateToken,
 updateTalkerData,
 deleteTalker,
};