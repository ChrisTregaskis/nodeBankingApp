import React from "react";
import './addAccountForm.css';

class AddAccountForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            surname: '',
            balance: 'Enter balance...'
        };
    }

    handleChangeFirstName = (event) => {
        this.setState({firstName: event.target.value});
    };

    handleChangeSurname = (event) => {
        this.setState({surname: event.target.value});
    };

    handleChangeBalance = (event) => {
        this.setState({balance: event.target.value})
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        let data = {
            "customer_fname": this.state.firstName,
            "customer_sname": this.state.surname,
            "balance": parseInt(this.state.balance)
        };

        console.log(data)

        await this.sendRequest('http://localhost:8080/customerAccounts', 'POST', data)
    };


    sendRequest = async (url, requestMethod, data) => {
        let requestData = JSON.stringify(data);

        let response = await fetch(url, {
            method: requestMethod.toUpperCase(),
            body: requestData,
            headers: {
                "Content-Type" : "application/json"
            }
        });

        let responseData = await response.json();
        //use set state in order to rerender a box that holds the success/failure message
        console.log(responseData);

    };


    render() {
        return (
            <div className="addAccountContainer">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.firstName} onChange={this.handleChangeFirstName} placeholder="First name..."
                           className="col-md-4 formInputs" required/>
                    <input type="text" value={this.state.surname} onChange={this.handleChangeSurname} placeholder="Surname..."
                           className="col-md-4 formInputs" required/>
                    <input type="number" value={this.state.balance} onChange={this.handleChangeBalance} placeholder="Balance..."
                           className="col-md-4 formInputs" required/>
                    <input type="submit" value="Add Account" className="btn btn-success"/>
                </form>
            </div>
        );
    }
}

export default AddAccountForm;