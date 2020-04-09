const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const port = 8080;

const url = 'mongodb://localhost:27017';

//------------------- See all accounts route -------------------//

app.get('/customerAccounts', (req, res) => {

    //db connection with ASYNC callback
    MongoClient.connect(url,
        { useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db('chrispyBank');

            //call get method - add AWAIT
            let customerAccounts = await getCustomerAccounts(db);

            //return response json with result of get method
            res.json({"customerAccounts": customerAccounts});
    })

});

var getCustomerAccounts = async (db) => {
    let collection = db.collection('customerAccounts');
    let result = await collection.find({}).toArray();
    return result;
};

//------------------- Add new customer account route -------------------//

app.post('/customerAccounts', jsonParser, (req, res) => {

    let branch = "Chrispy SW";
    let accountNumber = 1234567890;

    //create new customer account to pass in
    const newCustomerAccount = {
        account_number: accountNumber,
        branch: branch,
        customer_name: req.body.name,
        balance: req.body.balance
    };

    //connect to mongodb ASYNC
    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db('chrispyBank');

            //call AWAIT insertNewCustomerAccount
            let createCustomerAccount = await insertNewCustomerAccount(db, newCustomerAccount);

            //res success message following result from await
            // ERROR! how do I access docs.insertedCount? currently getting
            // "UnhandledPromiseRejectionWarning: ReferenceError: docs is not defined"
            if(docs.insertedCount === 1) {
                res.send('New customer account added!')
            } else {
                res.send('It failed dude')
            }
            client.close()

        })

});

//create insertNewCustomerAccount
var insertNewCustomerAccount = async (db, newCustomerAccountToSend) => {
    let collection = db.collection('/customerAccounts');
    let result = await collection.insertOne(newCustomerAccountToSend);
    return result;
};

//create random number generator 10 digits












app.listen(port, () => console.log(`nodeBankingApp listening at http://localhost:${port}`));