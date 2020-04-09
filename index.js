const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const port = 8080;

const url = 'mongodb://localhost:27017';

//See all accounts route
app.get('/customerAccounts', (req, res) => {

    //db connection
    MongoClient.connect(url,
        { useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db('chrispyBank');

            //call get method - add await
            let customerAccounts = await getCustomerAccounts(db);

            //return response json with result of get method
            res.json(customerAccounts);
    })

});

var getCustomerAccounts = async (db) => {
    let collection = db.collection('customerAccounts');
    let result = await collection.find({}).toArray();
    return result;
};



app.listen(port, () => console.log(`nodeBankingApp listening at http://localhost:${port}`));