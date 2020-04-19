import React from 'react';
import './App.css';
import AddAccountForm from "./Components/AddAccountForm/AddAccountForm";
import CustomerAccountsTable from "./Components/CustomerAccountsTable/CustomerAccountsTable";

function App() {
  return (
    <div className="App container">
      <h1>Admin Page.</h1>
        <AddAccountForm/>
        <CustomerAccountsTable/>
    </div>
  );
}

export default App;
