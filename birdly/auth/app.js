const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
