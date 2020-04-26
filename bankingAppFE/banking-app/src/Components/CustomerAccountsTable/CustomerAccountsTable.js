import React from "react";
import './customerAccountsTable.css';
const columnHeader = ['First-name', 'Surname', 'Balance', 'Deposit', 'Withdraw', 'Delete'];

class CustomerAccountsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customerAccPackage: {
                "customerAccounts": []
            }
        }
    }

    componentDidMount = () => {
        this.fetchCustomerAccounts();
    };

    fetchCustomerAccounts = () => {
        fetch('http://localhost:8080/customerAccounts', {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(data=>data.json())
        .then((data)=>{
            this.setState({
                customerAccPackage: data
            });
        })
    };

    generateHeader = () => {
        let result = [];
        for(var i = 0; i < columnHeader.length; i++) {
            result.push(<th key={columnHeader[i]}>{columnHeader[i]}</th>)
        }
        return result;
    };

    generateTableData = () => {
        let result = [];
        let tableData = this.state.customerAccPackage.customerAccounts;

        for(var i = 0; i < tableData.length; i++) {
            result.push(
                <tr key={i} data-id={tableData[i]._id}>
                    <td key={tableData[i].customer_fname}>{tableData[i].customer_fname}</td>
                    <td key={tableData[i].customer_sname}>{tableData[i].customer_sname}</td>
                    <td key={tableData[i].balance}><span>£</span>{tableData[i].balance}</td>
                    <td className="text-info updateBalance deposit">deposit</td>
                    <td className="text-warning updateBalance withdraw">withdraw</td>
                    <td className="text-danger updateBalance delete">delete</td>
                </tr>
            )
        }
        return result;
    };

    render() {
        return (
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {this.generateHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.generateTableData()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CustomerAccountsTable;