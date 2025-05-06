const express = require('express');
const app = express();
const port = 3000;

// Mock user data
const users = {
  '1': { id: '1', name: 'Willy Wonka', products: ['1', '2'] },
  '2': { id: '2', name: 'Lionel Messi' }
};

app.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});

