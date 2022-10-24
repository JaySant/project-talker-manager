const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData } = require('./utils/fsUtils');
const { generatorToken } = require('./utils/fsUtils');
const { validateLogin } = require('./utils/fsUtils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', async (_request, response) => {
    response.status(HTTP_OK_STATUS).json();
});

app.get('/talker', async (__req, res) => {
   const talkerData = await readTalkerData();
   return res.status(HTTP_OK_STATUS).json(talkerData);
});

app.get('/talker/:id', async (req, res) => {
  const talkerData = await readTalkerData();
  const id = Number(req.params.id);
  const talkerID = talkerData.find((talker) => talker.id === id);
  if (!talkerID) res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(HTTP_OK_STATUS).json(talkerID);
});

app.post('/login', validateLogin, async (req, res) => {
  const token = await generatorToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

 app.listen(PORT, () => {
  console.log('Online');
 });
