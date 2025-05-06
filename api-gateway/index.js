const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit'); 
const basicAuth = require('basic-auth'); 
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const app = express();
const port = 3002;

//==========================================\\
//==========================================\\

// Rate Limiter Config
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  standardHeaders: true, // Return rate limit info 
  legacyHeaders: false, 
  message: { // Custom response body
            status: 429,
            message: "Too many requests, please try again later."
        },
});

// Apply the rate limiter to all requests before any routes
app.use(limiter);

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

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== 'YOUR_API_KEY') { // Replace w a secure key.
        return res.status(401).json({ message: 'Unauthorized - Invalid API key' });
    }

    next();
};

//==========================================\\
//==========================================\\

app.get('/users/:id', apiKeyMiddleware, async (req, res) => { 
  const response = await fetch(`http://localhost:3000/users/${req.params.id}`);
  const data = await response.json();
  res.json(data);
});

app.get('/products/:id',  async (req, res) => {
  console.log(`--- Product route /products/${req.params.id} hit ---`);
  const productId = req.params.id;
  const cachedData = myCache.get(productId);

  if (cachedData) {
    console.log(`Serving product ${productId} from cache`);
    res.json(cachedData);
    return;
  }

  try {
    console.log(`Fetching product ${productId} from service`);
    const response = await fetch(`http://localhost:3001/products/${productId}`);
    const data = await response.json();
    myCache.set(productId, data, 60); // Cache for 60 seconds
    res.json(data);
  } catch (error) {
    console.error(`Error in /products/${productId} route:`, error);
    res.status(500).json({ message: 'Error fetching product data', errorDetails: error.message });
  }
});

//==========================================\\
//==========================================\\

app.get('/userProducts/:userId', async (req, res) => {
    try {
      const userResponse = await fetch(`http://localhost:3000/users/${req.params.userId}`);
      const userData = await userResponse.json();
  
      // Mock product association 
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