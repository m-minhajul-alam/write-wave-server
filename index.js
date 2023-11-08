const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyhxp1w.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const blogCollection = client.db('blogDB').collection('blogs');
        const commentCollection = client.db('blogDB').collection('comments');

        // blog collection
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        app.post('/blogs', async (req, res) => {
            const newBlogs = req.body;
            const result = await blogCollection.insertOne(newBlogs);
            res.send(result);
        })

        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateBlog = req.body;
            const blog = {
                $set: {
                    photo: updateBlog.photo,
                    category: updateBlog.category,
                    title: updateBlog.title,
                    taste: updateBlog.taste,
                    shortDec: updateBlog.shortDec,
                    longDec: updateBlog.longDec,
                    ownerEmail: updateBlog.ownerEmail,
                    ownerPhoto: updateBlog.ownerPhoto,
                    ownerName: updateBlog.ownerName,
                    uploadTime: updateBlog.uploadTime
                }
            };
            const result = await blogCollection.updateOne(query, blog, option);
            res.send(result);
        })


        // comment collection
        app.get('/comments', async (req, res) => {
            const cursor = commentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/comments', async (req, res) => {
            const newComment = req.body;
            const result = await commentCollection.insertOne(newComment);
            res.send(result);
        });
        


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Write-wave server is runing");
})

app.listen(port, () => {
    console.log(`Write Wave server is running on port ${port}`);
})