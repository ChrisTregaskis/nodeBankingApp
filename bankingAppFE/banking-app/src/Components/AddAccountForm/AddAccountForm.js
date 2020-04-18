import React from "react";
import './addAccountForm.css';

class AddAccountForm extends React.Component {
    render() {
        return (
            <div className="addAccountContainer">
                <form method="post" name="addAccountForm">
                    <input type="text" name="firstName" id="input-first-name" placeholder="First name..." 
                           className="col-md-4 formInputs"/>
                    <input type="text" name="surname" id="input-surname" placeholder="Surname..."
                           className="col-md-4 formInputs"/>
                    <input type="number" name="balance" id="input-balance" placeholder="Balance..."
                           className="col-md-4 formInputs"/>
                    <button type="submit" value="submit" id="addAccount-submit" 
                            className="btn btn-success">Add Account
                    </button>
                </form>
            </div>
        );
    }
}

export default AddAccountForm;