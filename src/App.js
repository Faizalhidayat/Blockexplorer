import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [blockWithTransactions, setBlockWithTransactions] = useState();
  const [txReceipt, setTxReceipt] = useState();
  const [selectedBlock, setSelectedBlock] = useState();
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [searchAddress, setSearchAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlock() {
      const latestBlock = await alchemy.core.getBlock(blockNumber);
      setBlock(latestBlock);
    }

    if (blockNumber) {
      getBlock();
    }
  }, [blockNumber]);

  useEffect(() => {
    async function getBlockWithTransactions() {
      const latestBlockWithTx = await alchemy.core.getBlockWithTransactions(selectedBlock);
      setBlockWithTransactions(latestBlockWithTx);
    }

    if (selectedBlock) {
      getBlockWithTransactions();
    }
  }, [selectedBlock]);

  useEffect(() => {
    async function getTransactionReceipt() {
      const receipt = await alchemy.core.getTransactionReceipt(selectedTransaction);
      setTxReceipt(receipt);
    }

    if (selectedTransaction) {
      getTransactionReceipt();
    }
  }, [selectedTransaction]);

  async function handleBlockClick(blockNumber) {
    setSelectedBlock(blockNumber);
    setSelectedTransaction(null);
  }

  async function handleTransactionClick(txHash) {
    setSelectedTransaction(txHash);
  }

  async function handleSearch() {
    const balance = await alchemy.token.getBalance(searchAddress, 'latest');
    setAccountBalance(balance);
  }

  return (
    <div className="App">
      <div>
        Block Number:
        {blockNumber &&
          <ul>
            {[...Array(10)].map((_, i) => {
              const blockNum = blockNumber - i;
              return (
                <li key={blockNum} onClick={() => handleBlockClick(blockNum)}>
                  {blockNum}
                </li>
              );
            })}
          </ul>
        }
      </div>
      {selectedBlock &&
        <div>
          <h3>Block Details (Block Number: {selectedBlock})</h3>
          <div>Hash: {blockWithTransactions?.hash}</div>
          <div>Timestamp: {new Date(blockWithTransactions?.timestamp * 1000).toString()}</div>
          <h4>Transactions:</h4>
          <ul>
            {blockWithTransactions?.transactions.map((tx, i) => (
              <li key={i} onClick={() => handleTransactionClick(tx.hash)}>
                {tx.hash}
              </li>
            ))}
          </ul>
        </div>
      }
      {selectedTransaction &&
        <div>
          <h3>Transaction Details (Tx Hash: {selectedTransaction})</h3>
          <div>Block Number: {txReceipt?.blockNumber}</div>
          <div>From: {txReceipt?.from}</div>
          <div>To: {txReceipt?.to}</div>
          <div>Value: {
      txReceipt?.value}</div>
      </div>
    }
    <div>
      <h3>Account Balance Lookup</h3>
      <label>
        Enter Address:
        <input type="text" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
      </label>
      <button onClick={handleSearch}>Search</button>
      {accountBalance &&
        <div>
          Balance: {accountBalance.toString()} ETH
        </div>
      }
    </div>
  </div>
);
}

export default App;  
