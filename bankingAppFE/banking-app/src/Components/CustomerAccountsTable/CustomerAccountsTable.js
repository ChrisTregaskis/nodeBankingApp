import React from "react";
import './customerAccountsTable.css';
import customerData from './customerData';
const columnHeader = ['First-name', 'Surname', 'Balance', 'Actions...', '', '', ''];

class CustomerAccountsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    generateHeader = () => {
        let result = [];
        for(var i = 0; i < columnHeader.length; i++) {
            result.push(<th key={columnHeader[i]}>{columnHeader[i]}</th>)
        }
        return result;
    };

    generateTableData = () => {
        let result = [];
        let tableData = customerData.customerAccounts;

        for(var i = 0; i < tableData.length; i++) {
            result.push(
                <tr key={i} data-id={tableData[i]._id}>
                    <td key={tableData[i].customer_fname}>{tableData[i].customer_fname}</td>
                    <td key={tableData[i].customer_sname}>{tableData[i].customer_sname}</td>
                    <td key={tableData[i].balance}>{tableData[i].balance}</td>
                    <td className="text-info updateBalance deposit">deposit</td>
                    <td className="text-warning updateBalance withdraw">withdraw</td>
                    <td className="text-success updateBalance update">update</td>
                    <td className="text-danger updateBalance delete">delete</td>
                </tr>
            )
        }
        return result;
    }

    render() {
        return (
            <div>
                <table className="table table-hover">
                    {this.generateHeader()}
                    <tbody>
                        {this.generateTableData()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CustomerAccountsTable;