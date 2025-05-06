const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3002;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello from Gateway Service!');
});

app.listen(port, () => {
  console.log(`Gateway service listening at http://localhost:${port}`);
}); 