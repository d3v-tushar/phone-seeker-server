const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());

//DB_USER=phoneSeekerDB
//DB_PASS=tushar2151


//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
        const categoriesCollection = client.db("phoneSeeker").collection("categories");
        const phonesCollection = client.db("phoneSeeker").collection("phones");
        const bookingCollection = client.db("phoneSeeker").collection("bookings");
        app.get('/categories', async(req, res)=>{
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get('/phones/:brand', async(req, res) =>{
            const brand = req.params.brand;
            const query = {category: brand};
            const cursor = phonesCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
        });

        app.post('/bookings', async(req, res) =>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        // app.get('/phones', async(req, res)=>{
        //     const query = {};
        //     const cursor = phonesCollection.find(query);
        //     const phones = await cursor.toArray();
        //     res.send(phones);
        // })
    }
    finally{
        //client.close();
    }
};
run().catch(error => console.error(error));


app.get('/', (req, res) =>{
    res.send('Phone Seeker Server is Running');
});

app.listen(port, () =>{
    console.log(`Phone Seeker Server Is Running On Port ${port}`);
});
