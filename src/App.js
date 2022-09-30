
import './App.css';
import React, {useEffect, useState, Component} from 'react';
// eslint-disable-next-line
import web3 from './web3';
import lottery from './lottery';
//function App() {

//web3.eth.getAccounts().then(console.log);
  //const Ether = props=>{
    // eslint-disable-next-line no-unused-vars
//     const [manager, setManager] = useState()
//       //manager_:null)
//      useEffect(()=>{
//         (async()=>{
//     const manager1 = await lottery.methods.manager().call();
//     setManager(manager1);
//     //console.log(manager1);
//   })();
//   //}
  
// },[]);
// console.log(manager+"m1");
// state = {
//   manager:''
// };
class App extends Component{
  // constructor(props){
  //   super(props);
  //   this.state 
  state ={
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
  };
  //}
  
  async componentDidMount() {
   const manager = await lottery.methods.manager().call();
   const players = await lottery.methods.getPlayers().call();
   const balance = await web3.eth.getBalance(lottery.options.address);
   console.log(`***${manager} HIIIII`);
    this.setState({manager, players, balance});
}
onSubmit = async (event)=> {
  event.preventDefault();
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);
  this.setState({message: 'Waiting for transaction success......'})
  await lottery.methods.entry().send({
    from : accounts[0],
    value: web3.utils.toWei(this.state.value, 'ether')
  });
  this.setState({message:'Your transcation has been completed successfuly!'});
}

onClick = async ()=>{
  const accounts = await web3.eth.getAccounts();
  this.setState({message:'Waiting for transaction success......'});
  await lottery.methods.pickWinner().send({
    from: accounts[0]
  });
  this.setState({message:'A Winner has been picked!'});
}

render(){
 //console.log(manager1);
 //console.log(lottery);
  return (
   <div>  
     {console.log(lottery)}
     <h2>Lottery Contract</h2>
     <p>This Contract is Managed by {this.state.manager}.
        There are currently {this.state.players.length} players entered the lottery,
        to win {web3.utils.fromWei(this.state.balance,'ether')} ether!
     </p>
     <hr />
     <form onSubmit = {this.onSubmit}>
       <h4>Want to Try Your Luck?</h4>
       <div>
         <label>Amount of Ether to Enter</label>
         <input
         value = {this.state.value}
         onChange = {event=> this.setState({value: event.target.value})} />
       </div>
       <button>Enter</button>
     </form>
     <hr />
     <h4>Pick a Winner</h4>
     <button onClick={this.onClick}>Select Winner</button>

     <hr />
     <h3>{this.state.message}</h3>
   </div>
  );
}
}

export default App;
