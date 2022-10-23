const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData } = require('./utils/fsUtils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
 const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', async (_request, response) => {
    response.status(HTTP_OK_STATUS).json();
});

app.get('/talker', async (__req, res) => {
   const data = await readTalkerData();
   return res.status(HTTP_OK_STATUS).json(data);
});

 app.listen(PORT, () => {
  console.log('Online');
 });
