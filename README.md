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
- Requires and sends: 
  - `{"customer_name": "string", "balance": number}`
- Returns:
	- if successful
		- `'New customer account added!'`  
	- if unsuccessful 
		- `'It failed dude'`
    
