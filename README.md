# nodeBankingApp
Exercise building a simple banking app using node and mongoDB for the back end and React for the front end

### Setup

1. Clone repo
2. Run `npm init` in root of project to get modules for dependencies
3. Create database in mongoDB with the name `chrispyBank` (make sure host is set to `localhost:27017`) 
4. Create collection called `customerAccounts`
5. Run `nodemon index.js` to start application api and in another tab, `npm start` to start React

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
	    - if database failed to update
	        - `{ "success": false, "message": "modifiedCount 0. Failed to update." }`
		


**/customerAccounts**
 
DELETE
- Does a HARD delete and removes customer account from db
- Requires and sends:
    - `{ 'id' : number }` 
- Returns:
    - if successful
        - `status 200`
        - `{ "success": true, "message": "Customer account successfully deleted!" }`  
    - if unsuccessful 
        - `status 500`
	- missing an id input
	    - `{ "success": false, "message": "Document Id required in order to delete account" }`
	- if database failed to delete
	    - `{ "success": false, "message": "Unsuccessfully deleted from database" }`
	    
	    
**/customerAccounts/filter**
 
GET
- Retrieves customer accounts that are either less than or greater than a given value
- Requires keys and values:
    - `filterType` = string
        - value of filterType must either be `less` OR `greater`
    - `filterValue` = number
- To send example: `/filter?filterType=less&filterValue=10000`
- Returns:
    - if successful
        - `status 200`
        - `{ "customerAccounts": [
		{
		    "_id": "5e8eee8634a11e4cf60e8240",
		    "account_number": 225123421,
		    "branch": "Chrispy SW",
		    "customer_fname": "Gemma",
		    "customer_sname": "Tiel",
		    "balance": 24300
		}
	]}`  
    - if unsuccessful 
        - `status 500`
	- `{
    	"success": false,
    	"message": "Unsuccessful. Api expecting filterType to either be 'less' or 'greater' "
	}`
