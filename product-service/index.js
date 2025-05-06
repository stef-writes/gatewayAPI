const express = require('express');
const app = express();
const port = 3001;


const products = {
    '1': {id: 1, name: "Monitor", description: "Powerful GUI for visionaries."},
    '2': {id: 2, name: "Turntable Keyboard", description: "Ergonomic & intuitive custom controller for traversing AI graphs."},
}

app.get('/products/:id', (req, res) => {
    const product = products[req.params.id];

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({message: "Product not found"})
    }
})

app.listen(port, () => {
    console.log(`Product service listening on port ${port}`);
})
