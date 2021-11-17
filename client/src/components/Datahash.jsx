import React, { Component } from 'react';
import renderNotification from '../utils/notification-handler';


class Datahash extends Component {
    constructor() {
    super();
    this.state = {name: '',
    aadhar:'',
    };
    
    this.datahash="";
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }
     
    handleChange1(event) {    this.setState({name: event.target.value});  }
    handleChange2(event) {    this.setState({aadhar: event.target.value});  }
    handleSubmit(event) 
    {
        const crypto = require('crypto');
        var hash = crypto.getHashes();
        var x=this.state.name+this.state.aadhar;
        const Web3 = require('web3');
        var result=Web3.utils.sha3(x)
        alert('DataHash : ' + result);
        event.preventDefault();
    }
    
    render() {
        
            return  (
         
                <div class="container center">
                  <div class="row">
                    <div class="container left">
                        
                      <h4 >Generate Datahash</h4>
        
        
                    <form onSubmit={this.handleSubmit}>        <label>
                    Enter your Name:
                  <input type="text" value={this.state.name} onChange={this.handleChange1} />        </label>
                  <label>
                  Enter your Aadhar Number:
                  <input type="number" value={this.state.aadhar} onChange={this.handleChange2} />        </label><br></br>
                  <input type="file"  alt="Submit" width="48" height="48"></input><br></br><br></br><br></br>
                <input type="submit" value="Submit" />
                </form>
                   
                    </div>
                  </div>
                </div>
              );
        
        
      
    }
  }
  
  export default Datahash;