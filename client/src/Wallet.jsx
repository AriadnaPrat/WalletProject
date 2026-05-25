import server from "./server";
import { useState, useEffect } from "react";

import * as secp from 'ethereum-cryptography/secp256k1';
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance}) {

  async function onChange(evt) {

    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address" value={address} onChange={onChange}></input>
        <p className="address"> Your address: 0x{localStorage.getItem("userPublicKey")}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
