const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nipoy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db('manufacture').collection('tools');
        const allOrders = client.db('allOrders').collection('orders');
        const allReviews = client.db('allReviews').collection('reviews');
        const allProfile = client.db('allProfile').collection('profile');

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tools = await toolsCollection.findOne(query);
            res.send(tools);
        });
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = allOrders.find(query);
            const orders = await cursor.toArray();
            res.send(orders);


        });


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allOrders.deleteOne(query);
            res.send(result);
        });


        app.post('/orders', async (req, res) => {
            const newAdd = req.body;
            const result = await allOrders.insertOne(newAdd);
            res.send(result);
        })
        app.post('/reviews', async (req, res) => {
            const newAdd = req.body;
            const result = await allReviews.insertOne(newAdd);
            res.send(result);
        });


        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = allReviews.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.get('/manageOrders', async (req, res) => {
            const query = {};
            const cursor = allOrders.find(query);
            const AllOrders = await cursor.toArray();
            res.send(AllOrders);
        });

        app.post('/profile', async (req, res) => {
            const newAdd = req.body;
            const result = await allProfile.insertOne(newAdd);
            res.send(result);
        });

    }
    finally {

    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello 12 assignment!')
})

app.listen(port, () => {
    console.log(`12 assignment listening on port ${port}`)
})