import React from 'react';
import './App.css';
import AddAccountForm from "./Components/AddAccountForm/AddAccountForm";
import CustomerAccountsTable from "./Components/CustomerAccountsTable/CustomerAccountsTable";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: '',
      filteredCustomerAccPackage: {
        "customerAccounts": []
      }
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let lessThan = e.target[0].checked;
    let greaterThan = e.target[1].checked;
    let filterByAmount = e.target[2].value;
    let reqUrl =  '';


    if (lessThan === false && greaterThan === false) {
      return this.updateResponse('Please select either less than or greater than to filter')
    }

    if (filterByAmount === '') {
      return this.updateResponse('Please specify what amount you wish to filter by')
    }

    if (lessThan === true && greaterThan === false) {
      reqUrl = `http://localhost:8080/customerAccounts/filter?filterType=less&filterValue=${filterByAmount}`
    } else if (greaterThan === true && lessThan === false) {
      reqUrl = `http://localhost:8080/customerAccounts/filter?filterType=greater&filterValue=${filterByAmount}`
    }

    await this.fetchFilteredAccounts(reqUrl);

  };

  fetchFilteredAccounts = async (url) => {
    await fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(data => data.json())
    .then((data) => {
      this.setState({
        filteredCustomerAccPackage: data
      })
    })
  };

  updateResponse = (newResponse) => {
    setTimeout(()=> {
      this.clearResponse()
    }, 3000);
    this.setState({response: newResponse})
  };

  clearResponse = () => {
    this.setState({response: ''})
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
              <input id="filterInput" name="filterInput" type="number" className="filterInputElement"/>
              <button type="submit" className="btn btn-success">Filter Accounts</button>
            </div>
          </form>
          <div className="messageBox text-danger">{this.state.response}</div>
          <CustomerAccountsTable filteredCustomerAccPackage={this.state.filteredCustomerAccPackage}/>
        </div>
    );
  }
}

export default App;
