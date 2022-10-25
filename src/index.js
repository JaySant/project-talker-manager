const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData, generatorToken, 
validateLogin, writeTalker, validateName, validateAge, 
validateTalk, validateWatched, validateRate, validateToken, updateTalkerData, 
} = require('./utils/fsUtils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', async (_request, response) => {
    response.status(HTTP_OK_STATUS).json();
});

app.get('/talker', async (_req, res) => {
   const talkerData = await readTalkerData();
   return res.status(HTTP_OK_STATUS).json(talkerData);
});

app.get('/talker/:id', async (req, res) => {
  const talkerData = await readTalkerData();
  const id = req.params;
  const talkerID = talkerData.find((talker) => talker.id === id);
  if (!talkerID) res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(HTTP_OK_STATUS).json(talkerID);
});

app.post('/login', validateLogin, async (_req, res) => {
  const token = await generatorToken();
  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk, 
validateWatched, validateRate, async (req, res) => {
  const talkerData = await readTalkerData();
  const id = talkerData.length + 1;
  const newTalker = { ...req.body, id };
  await writeTalker(newTalker);
  res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk, 
validateWatched, validateRate, async (req, res) => {
 const { id } = req.params;
 const updatedNewTalker = await updateTalkerData(Number(id), req.body);
 res.status(200).json({ ...updatedNewTalker });
});

 app.listen(PORT, () => {
  console.log('Online');
 });
