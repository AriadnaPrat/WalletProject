const { hexToBytes, toHex } = require("ethereum-cryptography/utils");
const { recoverPublicKey } = require("./keys");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "0x04f5b7bab7d51f539b27ee2a4c7e730587113d7c6c8db690b297ab39fecf41385327e90d0f685e5fee4a14f5f67abdd79d1b58767e3bda643a144a80c4d923614d": 100,
  "0x04867780f7b4388cfdaaa7885474027eb99682424ffb9f19be33556ed9bf58664606d063d797b3c66852d923f5715fbdeb70bfd8707e3c9e6d34c6a2f87181da08":250

};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;

  setInitialBalance(address)

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  // PROJECT MODIFICATIONS
  const { sender, recipient, amount, signature } = req.body;

  const tx = {
    sender: sender,
    recipient: recipient,
    amount: amount
  };

  const pk = toHex(recoverPublicKey(tx, signature));

  //verify signature
  if ( `0x${pk}` !== sender) {
    return res.status(400).send({ message: "Invalid signature!" });
  }
  // PROJECT MODIFICATIONS

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount || amount < 0) {
    res.status(400).send({ message: "Not enough funds or not enough amount!" });
  }else {
    balances[sender] -= amount;
    console.log("Sender balance after transfer: ", balances[sender]);
    console.log("Recipient balance before transfer: ", amount);
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
