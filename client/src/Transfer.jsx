import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // PROJECT MODIFICATIONS
  const [privateKey] = useState(() => {

    const savedKey = localStorage.getItem("userPrivateKey");
    if (savedKey) {
        return hexToBytes(savedKey);
      } else {
        const newKey = secp.utils.randomPrivateKey();
        const publicKey = secp.getPublicKey(newKey);

        localStorage.setItem("userPrivateKey", toHex(newKey));
        localStorage.setItem("userPublicKey", toHex(publicKey));
        return newKey;
      }
  });

  if (!localStorage.getItem("userPublicKey")){
    const publicKey = secp.getPublicKey(privateKey);
    localStorage.setItem("userPublicKey", toHex(publicKey));
  }
  
  // PROJECT MODIFICATIONS
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      // PROJECT MODIFICATIONS
      const mensaje = {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
      };

      // Sign the message
      const msgHash = keccak256(utf8ToBytes(JSON.stringify(mensaje)));
      const [signature, recovery] = await secp.sign(msgHash, privateKey, {
        recovered: true,
        der: false
      });

      const response = await server.post(`send`, {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
        
        signature: {
          signature: toHex(signature), 
          recovery: recovery                  
        }
      });

      setBalance(response.data.balance);
      // PROJECT MODIFICATIONS

    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
