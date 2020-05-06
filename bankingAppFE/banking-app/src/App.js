import React from 'react';
import './App.css';
import AddAccountForm from "./Components/AddAccountForm/AddAccountForm";
import CustomerAccountsTable from "./Components/CustomerAccountsTable/CustomerAccountsTable";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let lessThan = e.target[0].checked;
    let greaterThan = e.target[1].checked;
    let filterByAmount = e.target[2].value;
    console.log(filterByAmount)
  };

  render() {
    return (
        <div className="App container">
          <h1>Customer Accounts Admin Panel.</h1>
          <AddAccountForm/>
          <h3>Filter accounts by balance.</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="filterRadioBox">
              <input type="radio" id="lessThanRadio" name="filterByBalance" value="lessThanRadio"/>
              <label htmlFor="lessThanRadio" className="radioLabel">Less Than</label>
            </div>
            <div className="filterRadioBox">
              <input type="radio" id="greaterThanRadio" name="filterByBalance" value="greaterThanRadio"/>
              <label htmlFor="greaterThanRadio" className="radioLabel">Greater Than</label>
            </div>
            <div className="filterInput">
              <label htmlFor="filterInput">Enter amount:</label>
              <input id="filterInput" name="filterInput" type="number" className="filterInputElement" required/>
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </form>
          <CustomerAccountsTable/>
        </div>
    );
  }
}

export default App;
