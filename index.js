const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.kb6ch.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("book-shop").collection("products");

    app.post('/addProduct', (req, res) => {
        collection.insertOne(req.body)
            .then(response => {
                res.send("Item added successfully!")
            })
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectID(req.params.id) })
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(res => {
                
            })
    })

});

client.connect(err => {
    const collection = client.db("book-shop").collection("order");

    app.post('/checkout', (req, res) => {
        collection.insertOne(req.body)
            .then(response => {
                res.send("Item added successfully!")
            })
    })
    app.get('/orders', (req, res) => {
        collection.find({ email: req.query.email })
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
})