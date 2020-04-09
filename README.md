# nodeBankingApp
Exercise building a simple banking app using node and mongoDB

### Setup

1. Clone repo
2. Run `npm init` in root of project to get modules for dependencies
3. Create database in mongoDB with the name `chrispyBank` (make sure host is set to `localhost:27017`) 
4. Create collection called `customerAccounts`
5. Run `nodemon index.js` to start application

### Routes
- for local development use localhost:8080/whatYouRequire as your URL

**/customerAccounts**

POST
- Creates a new customer account
- Required
    - `customer_fname` - customer's first name 
    - `customer_sname` - customer's surname 
    - `balance`
- Sends: 
  - `{ "customer_fname": "string", "customer_sname": "string", "balance": number }`
- Returns:
    - if successful 
        - `status 200`
        - `{ "success": true, "message": "New customer account added!" }`  
    - if unsuccessful
        - `status 500` 
        - `{ "success": false, "message": "First name, surname and balance are required" }`
    
**/customerAccounts**

PUT
- Updates customer account balance following a deposit/ withdrawal request
- Required properties:
    - `id`
    - `deposit` OR `witdrawal`
- Sends an array of:
    - `{ "id": "string", "deposit": number }` 
    - OR
    - `{ "id": "string", "withdrawal": number }` 
- Returns:
    - if successful
        - `status 200`
        - `{ "success": true, "message": "Customer balance updated!" }` 
    - if unsuccessful, either of the following, depending on error:
   	    - `status 500`
	    - missing id or either deposit or withdrawal
                -
	        - `{ "success": false, "message": "Document id and either deposit or withdrawal values are required" }`
	    - trying to send deposit and withdrawal at the same time
	        - `{ "success": false, "message": "Can not send a deposit and withdrawal at the same time. Must be separate requests" }`
	    - if data base failed to update
	        - `{ "success": false, "message": "modifiedCount 0. Failed to update." }`
		


**/customerAccounts**
 
DELETE
- Does a HARD delete and removes customer account from db
- Requires and sends:
    - `{ 'id' : number }` 
- Returns:
	- if successful
		- `'Customer account deleted!'`  
	- if unsuccessful 
		- `'It failed dude'`
