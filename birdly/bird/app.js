const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello from Bird Service!');
});

app.listen(port, () => {
  console.log(`Bird service listening at http://localhost:${port}`);
}); 