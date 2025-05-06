const express = require('express');
const fetch = require('node-fetch');
const basicAuth = require('basic-auth'); // You added this
const app = express();
const port = 3002;

//==========================================\\
//==========================================\\

const authenticate = (username, password) => {
    // Replace with actual authentication logic (e.g., database lookup)
    // Simplified example below.
    if (username === 'admin' && password == 'password') {
        return true;
    }
    return false;
};

const authMiddleware = (req, res, next) => {
    const credentials = basicAuth(req);
  
    if (!credentials || !authenticate(credentials.name, credentials.pass)) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }
  
    next();
  };
//==========================================\\
//==========================================\\

// Apply authMiddleware
app.get('/users/:id', authMiddleware, async (req, res) => { 
  const response = await fetch(`http://localhost:3000/users/${req.params.id}`);
  const data = await response.json();
  res.json(data);
});

app.get('/products/:id', async (req, res) => {
    const response = await fetch(`http://localhost:3001/products/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  });

//==========================================\\
//==========================================\\

app.get('/userProducts/:userId', async (req, res) => {
    try {
      const userResponse = await fetch(`http://localhost:3000/users/${req.params.userId}`);
      const userData = await userResponse.json();
  
      // Mock product association - replace with actual logic in a real application
      const productIds = userData.products || []; 
      const productPromises = productIds.map(productId => fetch(`http://localhost:3001/products/${productId}`));
      const productResponses = await Promise.all(productPromises);
      const productData = await Promise.all(productResponses.map(res => res.json()));
  
  
      const combinedData = {
          user: userData,
          products: productData.length > 0 ? productData : []
      }
  
      res.json(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

//==========================================\\
//==========================================\\

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});