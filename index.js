const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
const MONGO_URI = 'mongodb://localhost:27017/my-db';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());

app.post('/client/addTodo', async (req, res) => {
  const collection = db.collection('user_todos');
  await collection.insertMany(req.body);
  await client.close();
  res.send('Todos added successfully');
});

app.post('/client/updateTodo', async (req, res) => {
    const collection = db.collection('user_todos');
    const filter = {_id: new ObjectId(req.body.id)};
    let update = {};
    
    if (req.body.todoText !== undefined) {
      update.todoText = req.body.todoText;
    }
    if (req.body.todoOrder !== undefined) {
      update.todoOrder = req.body.todoOrder;
    }
    if (req.body.todoDueDate !== undefined) {
      update.todoDueDate = req.body.todoDueDate;
    }
    await collection.updateOne(filter, {$set: update});
    await client.close();
    res.send('Todo updated successfully');
  });

    app.get('/client/getOne', async (req, res) => {
      try{
        const collection = db.collection('user_todos');
        const userId = parseInt(req.query.userId, 10)
        const records = await collection.find({userId, _id: new ObjectId(req.query.id)}).toArray();
        await client.close();
        console.log(records)
        res.send(`User todos: ${JSON.stringify(records)}`);
    } catch (err) {
        console.log(err)
        res.send('an error occured');
    }
  });

    app.post('/client/deleteTodo', async (req, res) => {
      const collection = db.collection('user_todos');
    
      const filter = {_id: new ObjectId(req.query.id)};
      await collection.deleteOne(filter);
      await client.close();
      res.send('Todo deleted successfully');
    });

    app.get('/client/getAllTodos', async (req, res) => {
      try{
        const collection = db.collection('user_todos');
        const userId = parseInt(req.query.userId, 10)
        const records = await collection.find({userId}).toArray();
        await client.close();
        console.log(records)
        res.send(`User todos: ${JSON.stringify(records)}`);
    } catch (err) {
        console.log(err)
        res.send('an error occured');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
