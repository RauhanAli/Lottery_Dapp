const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let account;
let lottery;
beforeEach(async () => {
    account = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: account[0], gas: '1000000' });
});

describe( 'Lottery', () => {
 it('deploys a contract', () => {
    assert.ok(lottery.options.address);
 });

 it('allows to enter the lottery', async()=>{
    await lottery.methods.entry().send({
        from: account[0],
        value: web3.utils.toWei('0.02', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({
        from: account[0]
    });
    assert.equal(account[0],players[0]);
    assert.equal(1,players.length);
 });
 it('allows multiple accounts to enter the lottery', async()=>{
    await lottery.methods.entry().send({
        from: account[0],
        value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.entry().send({
        from: account[1],
        value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.entry().send({
        from: account[2],
        value: web3.utils.toWei('0.02', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({
        from: account[0]
    });
    assert.equal(account[0],players[0]);
    assert.equal(account[1],players[1]);
    assert.equal(account[2],players[2]);
    assert.equal(3,players.length);
 });
 it('minimum amount to enter the lottery', async()=>{
    try{ 
    await lottery.methods.entry().send({
         from: account[0],
         value: 0
     });
     assert(false);
    } catch(err){
        assert.ok(err);
    };
 });
 it('only manager can pick winner', async()=>{
    try{
        await lottery.methods.pickWinner().send({
            from: account[1]
        });
        assert(false);
    }catch(err){
        assert(err);
    }
 });
it('sends ether to the winner and resets the players array', async()=>{
    await lottery.methods.entry().send({
        from: account[0],
        value: web3.utils.toWei('0.5','ether')

    });
    const WalletBalance = await web3.eth.getBalance(account[0]);
    await lottery.methods.pickWinner().send({from: account[0]});
    const finalBalance = await web3.eth.getBalance(account[0]);
    const diff = finalBalance - WalletBalance;
    console.log(diff);
    assert(diff>web3.utils.toWei('0.25','ether'));
});

});