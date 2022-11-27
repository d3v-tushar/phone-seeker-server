const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//Middleware
app.use(cors());
app.use(express.json());

//DB_USER=phoneSeekerDB
//DB_PASS=tushar2151



const uri = "mongodb+srv://<username>:<password>@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
        const categoriesCollection = client.db("phoneSeeker").collection("categories");
    }
    finally{
        //client.close();
    }
}


app.get('/', (req, res) =>{
    res.send('Phone Seeker Server is Running');
});

app.listen(port, () =>{
    console.log(`Phone Seeker Server Is Running On Port ${port}`);
});
