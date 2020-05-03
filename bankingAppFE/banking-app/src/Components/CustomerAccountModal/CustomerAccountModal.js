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
        let camClasses = 'camContainer ' + this.state.modalClass;
        return (
            <div className={camClasses}>
                {this.displayName()}
                {this.displayBalance()}
                <form onSubmit={this.handleSubmit}>
                    <div className="radioBox">
                        <input type="radio" id="depositRadio" name="updateBalance" value="depositRadio"/>
                        <label htmlFor="depositRadio" className="radioLabel">Deposit</label>
                    </div>
                    <div className="radioBox">
                        <input type="radio" id="withdrawRadio" name="updateBalance" value="withdrawRadio"/>
                        <label htmlFor="withdrawRadio" className="radioLabel">Withdraw</label>
                    </div>
                    <input className="modalInputNum" type="number" placeholder="Enter amount..."/>
                    <button type="submit" className="btn btn-success modalSubmitBtn">Submit</button>
                </form>
                <div className="modalResponse">{this.state.response}</div>
                <button className="btn btn-danger deleteAccount">Delete Account</button>
                <button className="btn btn-info cancelUpdate" onClick={()=>this.props.updateModalVisible()}>Cancel Update</button>
            </div>
        );
    }
}

export default CustomerAccountModal;