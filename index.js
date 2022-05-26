const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nipoy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db('manufacture').collection('tools');
        const allOrders = client.db('allOrders').collection('orders');
        const allReviews = client.db('allReviews').collection('reviews');
        const allProfile = client.db('allProfile').collection('profile');
        const allUsers = client.db('allUsers').collection('users');

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await allUsers.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECERT, { expiresIn: '1h' })
            res.send({ result, token });
        });

        app.post('/addTools', async (req, res) => {
            const newAdd = req.body;
            const result = await toolsCollection.insertOne(newAdd);
            res.send(result);
        });
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });
        app.get('/allUsers', verifyJWT, async (req, res) => {
            const query = {};
            const cursor = allUsers.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });
        app.delete('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toolsCollection.deleteOne(query);
            res.send(result);
        });
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tools = await toolsCollection.findOne(query);
            res.send(tools);
        });
        app.get('/orders', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = allOrders.find(query);
                const orders = await cursor.toArray();
                return res.send(orders);
            }
            else {
                return res.status(403).send({ message: 'forbidden access' })
            }


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