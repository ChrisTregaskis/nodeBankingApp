import React from "react";
import './customerAccountModal.css';

class CustomerAccountModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            response: '',
            modalClass: 'hidden'
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.modalVisible !== this.props.modalVisible) {
            if(this.props.modalVisible) {
                this.setState({modalClass: 'visible'})
            } else {
                this.setState({modalClass: 'hidden'})
            }
        }
    }

    displayName = () => {
        let result = [];
        let accountInfo = this.props.accountInfo;
        result.push(<h3 key="acc-name" className="name">{accountInfo.fname} {accountInfo.sname}</h3>);
        return result
    };

    displayBalance = (balance) => {
        let result = [];
        result.push(
            <div key="acc-balance-box">
                <p key="acc-balance-title">Account balance:</p>
                <h3 key="acc-balance">£<span id="balance-render-box">{balance}</span></h3>
            </div>
        );
        return result
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let depositReq = e.target[0].checked;
        let withdrawReq = e.target[1].checked;
        let amountReq = parseInt(e.target[2].value);
        let id = e.target[3].value;
        let objId = {"id": id};
        let data = {};

        if (depositReq === false && withdrawReq === false) {
            return this.updateResponse('Please select either the deposit or request option.')
        }

        if (amountReq === '' || isNaN(amountReq)) {
            return this.updateResponse('Please specify how much you would like to deposit or withdraw.')
        }

        if (depositReq === true) {
            data = {
                "id": id,
                "deposit": amountReq
            }
        } else if (withdrawReq === true) {
            data = {
                "id": id,
                "withdrawal": amountReq
            }
        } else {
            this.updateResponse('deposit and withdrawal request invalid')
        }

        let updateAccount = await this.handleFetch(
            'http://localhost:8080/customerAccounts',
            'PUT',
            data
        );

        if (updateAccount.success === true) {
            await this.props.fetchCustomerAccounts();
            document.getElementById('amount-input').value = '';
        } else {
            this.setState({response: updateAccount.message})
        }

        this.updateModalBalance(objId.id);

    };

    updateModalBalance = (id) => {
        let balanceBox = document.getElementById('balance-render-box');
        fetch(`http://localhost:8080/singleCustomerAccount?id=${id}`, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json"
            }
        })
            .then(data=>data.json())
            .then((data)=>{
                console.log(data.singleAccount[0].balance);
                balanceBox.innerText = data.singleAccount[0].balance
            })
    };

    handleFetch = async (url, requestMethod, dataToSend) => {
        let requestData = JSON.stringify(dataToSend);

        const response = await fetch(url, {
            method: requestMethod.toUpperCase(),
            body: requestData,
            headers: {
                "Content-Type" : "application/json"
            }
        });

        let responseData = await response.json();
        this.updateResponse(responseData.message);
        return responseData;
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
        let camClasses = 'camContainer ' + this.state.modalClass;
        return (
            <div className={camClasses}>
                {this.displayName()}
                {this.displayBalance(this.props.accountInfo.balance)}
                <form onSubmit={this.handleSubmit}>
                    <div className="radioBox">
                        <input type="radio" id="depositRadio" name="updateBalance" value="depositRadio"/>
                        <label htmlFor="depositRadio" className="radioLabel">Deposit</label>
                    </div>
                    <div className="radioBox">
                        <input type="radio" id="withdrawRadio" name="updateBalance" value="withdrawRadio"/>
                        <label htmlFor="withdrawRadio" className="radioLabel">Withdraw</label>
                    </div>
                    <label className="amountInput" htmlFor="amountInput">Enter amount...</label>
                    <input id="amount-input" name="amountInput" className="modalInputNum" type="number"/>
                    <input type="hidden" name="value" value={this.props.accountInfo.id}/>
                    <button type="submit" className="btn btn-success modalSubmitBtn">Submit</button>
                </form>
                <div className="modalResponse">{this.state.response}</div>
                <button className="btn btn-danger deleteAccount">Delete Account</button>
                <button className="btn btn-info cancelUpdate" onClick={()=>this.props.updateModalVisible()}>Close Modal</button>
            </div>
        );
    }
}

export default CustomerAccountModal;