import React, { Component } from 'react';
import plutusLogo from '../plutusLogo.png';
import './App.css';
import Web3 from 'web3';
import PlutonTokenMock from '../abis/PlutonTokenMock.json'; //Must import the PlutonTokenMock.json from the ABI folder

class App extends Component {
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    } else {
        window.alert('Non ethereum browser detected. You should try considering Metamask')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const PlutonTokenAddress = "0xC8345f2a797C67D82bD360f11C7028F7D947c462" // put the address from the PlutonTokenMock.json generated in the ABI or use any other cryptocurrency address
    const PlutonTokenMock = new web3.eth.Contract(PlutonTokenMock.abi, PlutonTokenAddress)
    this.setState({ PlutonTokenMock: PlutonTokenMock })
    const balance = await PlutonTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'ether') })

    //this line registers the entire history of transactions and also the entire history of money the contract sent
    const transactions = await PlutonTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest' , filter: { from: this.state.account } })
    this.setState({ transactions })
    console.log(transactions)
  }

  //Call the blockchain to send cryptocurrency
  transfer(recipient, amount) {
    this.state.PlutonTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
  }

  constructor (props) {
    super(props);
    this.state = {
      account: '',
      PlutonTokenMock: null,
      balance: 0,
      transaction: []
    }
    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="Plutus Wallet"
            target="_blank"
            rel="noopener noreferrer"
          >
            Plutus Wallet
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center" style={{ width: "500px" }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="Plutus Wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={plutusLogo} width="150" />
                </a>
                <form onSubmit={(event) => {
                  //TODO: Handle submit
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'ether')
                  this.transfer(recipient, amount)

                }}>
                  <div className="form-group mr-sm-2">
                    <input 
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }} //the money sent will be stored here
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input 
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }} //the money sent will be stored here
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transactions.map((tx, index) => {
                      return(
                        <tr key={index}>
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'ether')}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
