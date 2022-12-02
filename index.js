const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());

// DB_USER=phoneSeekerDB
// DB_PASS=tushar2151
// PORT=4000
// ACCESS_TOKEN=27cb39b961403972b0b938dcb5105160e3c4230b06756fcd98d28dd5918877476e496bbf70aeddbf9e0b65cb60cc64346c2bf9faf2583287c76dacf8d1d68224


//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Verify JWT Token
const verifyJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) =>{
        if(error){
            return res.status(403).send({message: 'Forbidden Access'});
        }
        req.decoded = decoded;
        next();
    });
};

const run = async() =>{
    try{
        const categoriesCollection = client.db("phoneSeeker").collection("categories");
        const phonesCollection = client.db("phoneSeeker").collection("phones");
        const bookingCollection = client.db("phoneSeeker").collection("bookings");
        const usersCollection = client.db("phoneSeeker").collection("users");

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

        app.get('/bookings', verifyJWT, async(req, res) =>{
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if(email !== decodedEmail){
                return res.status(403).send({message: 'Forbidden Access'});
            }
            const query = {email: email};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        });

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/jwt', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'});
                return res.send({accessToken: token})
            }
            res.status(403).send({message: 'Forbidden Access'});
        });

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
