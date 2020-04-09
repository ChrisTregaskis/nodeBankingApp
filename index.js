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

    //db connection with ASYNC callback
    MongoClient.connect(url,
        { useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            //call get method - add AWAIT
            let customerAccounts = await getCustomerAccounts(db);

            //return response json with result of get method
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

    //create new customer account to pass in
    const newCustomerAccount = {
        account_number: accountNumber,
        branch: branch,
        customer_name: req.body.customer_name,
        balance: req.body.balance
    };

    //connect to mongodb ASYNC
    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            //call AWAIT insertNewCustomerAccount
            let createCustomerAccount = await insertNewCustomerAccount(db, newCustomerAccount);

            //res success message following result from await
            if(createCustomerAccount.insertedCount === 1) {
                res.send('New customer account added!')
            } else {
                res.send('It failed dude')
            }
            client.close()

        })

});

//create insertNewCustomerAccount function
var insertNewCustomerAccount = async (db, newCustomerAccountToSend) => {
    let collection = db.collection(dbCollection);
    let result = await collection.insertOne(newCustomerAccountToSend);
    return result;
};

//create random number generator 9 digits
function generateAccountNumber() {
    return Math.floor(Math.random() * 1000000000);
}


//------------------- Update customer balance route -------------------//

app.put('/customerAccounts', jsonParser, (req, res) => {

    let id = ObjectId(req.body.id);
    let depositAmount = req.body.deposit;
    let withdrawalAmount = req.body.withdrawal;

    //grab id, deposit and withdrawal from body
    let updatedCustomerBalanceData = '';

    //check if a deposit or withdrawal
    if (depositAmount === null) {
        updatedCustomerBalanceData = withdrawalAmount;
    } else if (withdrawalAmount === null) {
        updatedCustomerBalanceData = depositAmount;
    } else {
        res.send('deposit and withdrawal values empty');
        return
    }


    //connect to mongodb ASYNC
    MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);

            //call AWAIT updateCustomerBalance
            let customerBalance = await updateCustomerBalance(db, id, updatedCustomerBalanceData);

            //res success message following result from await
            if(customerBalance.modifiedCount === 1) {
                res.send('Customer balance updated!')
            } else {
                res.send('It failed dude')
            }

            client.close()

        })

});

//create updateCustomerBalance function
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