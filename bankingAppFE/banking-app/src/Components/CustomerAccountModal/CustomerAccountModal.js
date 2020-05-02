import React from "react";
import './customerAccountModal.css';

class CustomerAccountModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    displayName = () => {
        let result = []
        let accountInfo = this.props.accountInfo
        result.push(<p>account holder name: {accountInfo.fname} {accountInfo.sname}</p>)
        return result
    }

    render() {
        return (
            <div className="camContainer">
                ey yo!
                {this.displayName()}
            </div>
        );
    }
}

export default CustomerAccountModal;