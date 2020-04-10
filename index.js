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
    let reqBody = req.body;
    let status = 500;
    let response = {
        "success": false,
        "message": "err!",
    };

    const newCustomerAccount = {
        account_number: accountNumber,
        branch: branch,
        customer_fname: reqBody.customer_fname,
        customer_sname: reqBody.customer_sname,
        balance: req.body.balance
    };

    if(!(reqBody.hasOwnProperty('customer_fname')) ||
        !(reqBody.hasOwnProperty('customer_sname')) ||
        !(reqBody.hasOwnProperty('balance'))) {

        response.message = 'First name, surname and balance are required';
        res.status(status).send(response);
        return
    }

    MongoClient.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
        console.log('connected correctly to mongodb');
        let db = client.db(dbName);

        let createCustomerAccount = await insertNewCustomerAccount(db, newCustomerAccount);

        if(createCustomerAccount.insertedCount === 1) {
            response.success = true;
            response.message = 'New customer account added!';
            status = 200;
            res.status(status).send(response)
        } else {
            response.message = 'It failed dude';
            res.status(status).send(response)
        }

        client.close()

    })

});

var insertNewCustomerAccount = async (db, newCustomerAccountToSend) => {
    let collection = db.collection(dbCollection);
    let result = await collection.insertOne(newCustomerAccountToSend);
    return result;
};

function generateAccountNumber() {
    return Math.floor(Math.random() * 1000000000);
}


//------------------- Update customer balance route -------------------//

app.put('/customerAccounts', jsonParser, (req, res) => {

    let id = ObjectId(req.body.id);
    let depositAmount = req.body.deposit;
    let withdrawalAmount = req.body.withdrawal;
    let updatedCustomerBalanceData = '';
    let reqBody = req.body;
    let status = 500;
    let response = {
        "success": false,
        "message": "err!",
    };

    if (!(reqBody.hasOwnProperty('id')) ||
        !(reqBody.hasOwnProperty('deposit') || reqBody.hasOwnProperty('withdrawal'))) {
        response.message = 'Document id and either deposit or withdrawal values are required';
        res.status(status).send(response);
        return
    }

    if (reqBody.hasOwnProperty('id') &&
        reqBody.hasOwnProperty('deposit') && reqBody.hasOwnProperty('withdrawal')) {
        response.message = 'Can not send a deposit and withdrawal at the same time. Must be separate requests';
        res.status(status).send(response);
        return
    }

    if (reqBody.hasOwnProperty('id') && reqBody.hasOwnProperty('deposit')) {
        updatedCustomerBalanceData = depositAmount;
    } else if (reqBody.hasOwnProperty('id') && reqBody.hasOwnProperty('withdrawal')) {
        updatedCustomerBalanceData = withdrawalAmount;
    } else {
        response.message = 'Missing either id, deposit or withdrawal';
        res.status(status).send(response);
        return
    }

    MongoClient.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
        console.log('connected correctly to mongodb');
        let db = client.db(dbName);

        let customerBalance = await updateCustomerBalance(db, id, updatedCustomerBalanceData);

        if(customerBalance.modifiedCount === 1) {
            response.success = true;
            response.message = 'Customer balance updated!';
            status = 200;
            res.status(status).send(response)
        } else {
            response.message = 'modifiedCount 0. Failed to update.';
            res.status(status).send(response)
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


//------------------- Hard-Delete customer account route -------------------//

app.delete('/customerAccounts', jsonParser, (req, res) => {

    let id = ObjectId(req.body.id);
    let reqBody = req.body;
    let status = 500;
    let response = {
        "success": false,
        "message": "err!",
    };

    if(!(reqBody.hasOwnProperty('id'))) {
        response.message = 'Document Id required in order to delete account';
        res.status(status).send(response);
        return
    }

    MongoClient.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, client) => {
        console.log('connected correctly to mongodb');
        let db = client.db(dbName);

        let deletedCustomerAccount = await deleteCustomerAccount(db, id);

        if(deletedCustomerAccount.deletedCount === 1) {
            response.success = true;
            response.message = 'Customer account successfully deleted!';
            status = 200;
            res.status(status).send(response)
        } else {
            response.message = 'Unsuccessfully deleted from database';
            res.status(status).send(response)
        }

        client.close()

    })

});

var deleteCustomerAccount = async (db, id) => {
    let collection = db.collection(dbCollection);
    let result = await collection.deleteOne({ _id: id });
    return result
};


//------------------- See customer accounts with balance LESS or GREATER THAN x route -------------------//

app.get('/customerAccounts/filter', (req, res) => {

    let filterType = req.query.filterType;
    let filterValue = req.query.filterValue;
    let reqParams = req.query;
    let status = 500;
    let response = {
        "success": false,
        "message": "err!",
    };

    if ((reqParams.filterType === 'less') || (reqParams.filterType === 'greater')) {

        MongoClient.connect(url,
        { useUnifiedTopology: true },
        async (err, client) => {
            console.log('connected correctly to mongodb');
            let db = client.db(dbName);
            let customerAccounts = [];

            if (filterType === 'less') {
                customerAccounts = await getCusAccountsLessThan(db, filterValue);
                status = 200;
            } else if (filterType === 'greater') {
                customerAccounts = await getCusAccountsGreaterThan(db, filterValue);
                status = 200;
            } else {
                response.message = 'Unknown filter type used';
                res.send(response)
            }

            res.json({"customerAccounts": customerAccounts});
        })
    } else {
        response.message = 'Unsuccessful. Api expecting filterType to either be \'less\' or \'greater\' ';
        res.status(status).send(response);
        return
    }
    
});

var getCusAccountsLessThan = async (db, filterValue) => {
    let value = Number(filterValue);
    let collection = db.collection(dbCollection);
    let result = await collection.find({ balance: { $lt: value } }).toArray();
    return result;
};

var getCusAccountsGreaterThan = async (db, filterValue) => {
    let value = Number(filterValue);
    let collection = db.collection(dbCollection);
    let result = await collection.find({ balance: { $gt: value } }).toArray();
    return result;
};


app.listen(port, () => console.log(`nodeBankingApp listening at http://localhost:${port}`));