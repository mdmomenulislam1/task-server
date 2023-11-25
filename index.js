const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mwjflvc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        //property collection
        const propertyCollection = client.db("propertyDB").collection("property");
        app.get('/property', async (req, res) => {
            const result = await propertyCollection.find().toArray();
            res.send(result);
        });


        app.get('/property/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { property_image: 1, property_title: 1, agent_name: 1, property_description: 1, property_location: 1, price_range: 1, verification_status: 1, agent_image: 1 },
            };
            const result = await propertyCollection.findOne(query, options);
            res.send(result);
        });



        //wished collection
        const wishedCollection = client.db("wishedPropertyDB").collection("wishedProperty");
        app.post("/wishedProperty", async (req, res) => {
            const order = req.body;
            const result = await wishedCollection.insertOne(order);
            res.send(result);
        });

        app.get("/wishedProperty", async (req, res) => {
            const result = await wishedCollection.find().toArray();
            res.send(result);
        });

        app.get('/wishedProperty/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: {  property_title: 1, agent_name: 1, property_location: 1, price_range: 1 },
            };
            const result = await wishedCollection.findOne(query, options);
            res.send(result);
        });

        app.delete('/wishedProperty/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await wishedCollection.deleteOne(query);
            res.send(result);
          })




        //review collection
        const reviewCollection = client.db("reviewDB").collection("review");
        app.get("/review", async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        });

        app.post("/review", async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.send(result);
        });





        //user collection 
        const userCollection = client.db("userDb").collection("user");
        app.post('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.get("/user", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });




        //offered collection
        const offeredCollection = client.db("offeredDB").collection("offered");
        app.post("/offeredProperty", async (req, res) => {
            const order = req.body;
            const result = await offeredCollection.insertOne(order);
            res.send(result);
        });

        app.get("/offeredProperty", async (req, res) => {
            const result = await offeredCollection.find().toArray();
            res.send(result);
        });





        

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Food is coming')
})

app.listen(port, () => {
    console.log(`Food is running on port ${port}`);
})
