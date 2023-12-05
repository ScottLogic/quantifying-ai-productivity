
### You
```
express.js crud examples
```

### ChatGPT
Certainly! CRUD (Create, Read, Update, Delete) operations are fundamental 
in web development. Here's a basic example of how you can perform 
CRUD operations using Express.js and a mock in-memory database:

```
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let data = []; // Mock in-memory database

// GET all items
app.get('/items', (req, res) => {
  res.json(data);
});

// GET item by ID
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const item = data.find(item => item.id === itemId);
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item by ID
app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  const index = data.findIndex(item => item.id === itemId);
  if (index === -1) {
    return res.status(404).send('Item not found');
  }
  data[index] = { ...data[index], ...updatedItem };
  res.json(data[index]);
});

// DELETE item by ID
app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const index = data.findIndex(item => item.id === itemId);
  if (index === -1) {
    return res.status(404).send('Item not found');
  }
  const deletedItem = data.splice(index, 1);
  res.json(deletedItem);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```