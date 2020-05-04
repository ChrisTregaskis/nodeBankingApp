import React from "react";
import './customerAccountsTable.css';
import CustomerAccountModal from "../CustomerAccountModal/CustomerAccountModal";
const columnHeader = ['First-name', 'Surname', 'Balance', 'Update'];

class CustomerAccountsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customerAccPackage: {
                "customerAccounts": []
            },
            accountInfo: {},
            modalVisible: false
        }
    }

    componentDidMount = () => {
        this.fetchCustomerAccounts();
    };

    updateModalVisible = () => {
        this.setState({modalVisible: false});
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
        for(let i = 0; i < columnHeader.length; i++) {
            result.push(<th key={columnHeader[i]}>{columnHeader[i]}</th>)
        }
        return result;
    };

    generateTableData = () => {
        let result = [];
        let tableData = this.state.customerAccPackage.customerAccounts;

        for(let i = 0; i < tableData.length; i++) {
            result.push(
                <tr key={i}>
                    <td key={tableData[i].customer_fname}>{tableData[i].customer_fname}</td>
                    <td key={tableData[i].customer_sname}>{tableData[i].customer_sname}</td>
                    <td key={tableData[i].balance}><span>£</span>{tableData[i].balance}</td>
                    <td className="text-success updateBalance deposit"
                        data-id={tableData[i]._id}
                        data-fname={tableData[i].customer_fname}
                        data-sname={tableData[i].customer_sname}
                        data-balance={tableData[i].balance}
                        onClick={this.prepareData}>update</td>
                </tr>
            )
        }
        return result;
    };

    prepareData = async (e) => {
        let accountInfo = {
            "id": e.target.dataset.id,
            "fname": e.target.dataset.fname,
            "sname": e.target.dataset.sname,
            "balance": parseInt(e.target.dataset.balance)
        };
        await this.setState({
            accountInfo: accountInfo,
            modalVisible: true
        });
    };


    render() {
        return (
            <div>
                <CustomerAccountModal
                    modalVisible={this.state.modalVisible}
                    updateModalVisible={this.updateModalVisible}
                    accountInfo={this.state.accountInfo}
                    fetchCustomerAccounts={this.fetchCustomerAccounts}
                />
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