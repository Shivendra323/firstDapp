import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MessageContract from "./truffle/build/contracts/Message.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      const ganacheUrl = "http://127.0.0.1:8545"; // URL of your Ganache server
      const ganacheProvider = new Web3.providers.HttpProvider(ganacheUrl);
      const web3Instance = new Web3(ganacheProvider);
      setWeb3(prevWeb3 => prevWeb3 ? prevWeb3 : web3Instance); // Use functional update to avoid infinite loop
    };
  
    const loadBlockchainData = async () => {
      if (web3) {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MessageContract.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          MessageContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
        setLoaded(true);
      }
    };
  
    loadWeb3();
    loadBlockchainData();
  }, [web3]); // Include 'web3' in the dependency array
  
  

  const getMessage = async () => {
    const result = await contract.methods.getMessage().call();
    setMessage(result);
  };

  const setMessageHandler = async () => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.setMessage(newMessage).send({ from: accounts[1] });
    console.log(accounts);
    setNewMessage("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Basic dApp</h1>
      </header>
      {loaded ? (
        <div>
          <p>Current Message: {message}</p>
          <input
            type="text"
            placeholder="New Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={setMessageHandler}>Set Message</button>
          <button onClick={getMessage}>Get Message</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
