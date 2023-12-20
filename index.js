const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
let db;
const connectToMongoDB = async () => {
    try {
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
        console.log('Connected to MongoDB');
        db = client.db('mybookdb');
    } catch (err) {
        console.error("MongoDB Connection Error: ", err);
    }
}
app.post('/books', async (req, res) => {
    const book = req.body;
    try {
        const result = await db.collection('books').insertOne(book);
        book._id = result.insertedId;
        res.status(201).send(book);
    } catch (err) {
        console.error("Insert Error: ", err);
        res.status(500).send(err);
    }
});
app.get('/books', async (req, res) => {
    try {
        const books = await db.collection('books').find({}).toArray();
        res.status(200).send(books);
    } catch (err) {
        console.error("Find Error: ", err);
        res.status(500).send(err);
    }
});
app.put('/books/:id', async (req, res) => {
    const id = req.params.id;
    const updatedBook = req.body;
    try {
        const result = await db.collection('books').updateOne({_id: new ObjectId(id)}, {$set: updatedBook});
        res.status(200).send({matchedCount: result.matchedCount, modifiedCount: result.modifiedCount});
    } catch (err) {
        console.error("Update Error: ", err);
        res.status(500).send(err);
    }
});
app.delete('/books/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.collection('books').deleteOne({_id: new ObjectId(id)});
        res.status(200).send({deletedCount: result.deletedCount});
    } catch (err) {
        console.error("Delete Error: ", err);
        res.status(500).send(err);
    }
});
connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
