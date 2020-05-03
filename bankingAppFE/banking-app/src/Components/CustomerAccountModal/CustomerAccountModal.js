import React from "react";
import './customerAccountModal.css';

class CustomerAccountModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            response: ''
        }
    }

    displayName = () => {
        let result = [];
        let accountInfo = this.props.accountInfo;
        result.push(<h3 key="acc-name">{accountInfo.fname} {accountInfo.sname}</h3>);
        return result
    };

    displayBalance = () => {
        let result = [];
        result.push(
            <div>
                <p key="acc-balance-title">Account balance:</p>
                <h3 key="acc-balance"><span>£</span>{this.props.accountInfo.balance}</h3>
            </div>
        );
        return result
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let depositReq = e.target[0].checked;
        let withdrawReq = e.target[1].checked;
        let amountReq = e.target[2].value;

        if (depositReq === false && withdrawReq === false) {
            this.updateResponse('Please select either the deposit or request option.')
        } else if (amountReq === '') {
            this.updateResponse('Please specify how much you would like to deposit or withdraw.')
        }

        

    };

    updateResponse = (newResponse) => {
        setTimeout(()=> {
            this.clearResponse()
        }, 3000);
        this.setState({response : newResponse})
    };

    clearResponse = () => {
        this.setState({response : ''})
    };

    render() {
        return (
            <div className="camContainer">
                {this.displayName()}
                {this.displayBalance()}
                <form onSubmit={this.handleSubmit}>
                    <input type="radio" id="depositRadio" name="updateBalance" value="depositRadio"/>
                        <label htmlFor="depositRadio" className="text-info">Deposit</label>
                    <input type="radio" id="withdrawRadio" name="updateBalance" value="withdrawRadio"/>
                        <label htmlFor="withdrawRadio" className="text-warning">Withdraw</label>
                    <input className="modalInputNum" type="number"/>
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
                <button className="btn btn-danger">Delete Account</button>
                <button className="btn btn-dark">Cancel Update</button>
                <div className="text-danger">{this.state.response}</div>
            </div>
        );
    }
}

export default CustomerAccountModal;