const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const port = 8080;

const url = 'mongodb://localhost:27017';
const dbName = 'chrispyBank';
const dbCollection = 'customerAccounts';


//------------------- See all accounts route -------------------//

app.get('/customerAccounts', (req, res) => {

    MongoClient.connect(url,
        { useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            let customerAccounts = await getCustomerAccounts(db);

            res.json({"customerAccounts": customerAccounts});
    })

});

var getCustomerAccounts = async (db) => {
    let collection = db.collection(dbCollection);
    let result = await collection.find({}).toArray();
    return result;
};


//------------------- Add new customer account route -------------------//

app.post('/customerAccounts', jsonParser, (req, res) => {

    let branch = "Chrispy SW";
    let accountNumber = generateAccountNumber();

    const newCustomerAccount = {
        account_number: accountNumber,
        branch: branch,
        customer_fname: req.body.customer_fname,
        customer_sname: req.body.customer_sname,
        balance: req.body.balance
    };

    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            let createCustomerAccount = await insertNewCustomerAccount(db, newCustomerAccount);

            if(createCustomerAccount.insertedCount === 1) {
                res.send('New customer account added!')
            } else {
                res.send('It failed dude')
            }
            client.close()

        })

});

var insertNewCustomerAccount = async (db, newCustomerAccountToSend) => {
    let collection = db.collection(dbCollection);
    let result = await collection.insertOne(newCustomerAccountToSend);
    return result;
};

//Random 9 digit number for account number
function generateAccountNumber() {
    return Math.floor(Math.random() * 1000000000);
}


//------------------- Update customer balance route -------------------//

app.put('/customerAccounts', jsonParser, (req, res) => {

    let id = ObjectId(req.body.id);
    let depositAmount = req.body.deposit;
    let withdrawalAmount = req.body.withdrawal;
    let updatedCustomerBalanceData = '';

    if (depositAmount === null) {
        updatedCustomerBalanceData = withdrawalAmount;
    } else if (withdrawalAmount === null) {
        updatedCustomerBalanceData = depositAmount;
    } else {
        res.send('deposit and withdrawal values empty');
        return
    }

    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            let customerBalance = await updateCustomerBalance(db, id, updatedCustomerBalanceData);

            if(customerBalance.modifiedCount === 1) {
                res.send('Customer balance updated!')
            } else {
                res.send('It failed dude')
            }

            client.close()

        })

});

var updateCustomerBalance = async (db, id, updatedCustomerBalanceData) => {
    let collection = db.collection(dbCollection);
    let result = await collection.updateOne(
        { _id: id },
        { $inc: { balance: updatedCustomerBalanceData } }
    );
    return result;
};


//------------------- Update customer balance route -------------------//

app.delete('/customerAccounts', jsonParser, (req, res) => {

    let id = ObjectId(req.body.id);

    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            let deletedCustomerAccount = await deleteCustomerAccount(db, id);

            if(deletedCustomerAccount.deletedCount === 1) {
                res.send('Customer account deleted!')
            } else {
                res.send('It failed dude')
            }

            client.close()

        })

});


var deleteCustomerAccount = async (db, id) => {
    let collection = db.collection(dbCollection);
    let result = await collection.deleteOne({ _id: id });
    return result
};





app.listen(port, () => console.log(`nodeBankingApp listening at http://localhost:${port}`));