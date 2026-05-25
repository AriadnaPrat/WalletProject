// PROJECT MODIFICATIONS
const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { utf8ToBytes, hexToBytes, toHex } = require('ethereum-cryptography/utils');

function recoverPublicKey(mensaje, signature) {
  const { signature: sigHex, recovery } = signature;
  console.log("mensaje: ", mensaje);
  console.log("signature: ", signature);
  console.log("sigHex: ", sigHex);
  console.log("recovery: ", recovery);
  const msgHash = keccak256(utf8ToBytes(JSON.stringify(mensaje)));
  console.log("msgHash: ", toHex(msgHash));
  const sigBytes = hexToBytes(sigHex);
  const publicKey = secp.recoverPublicKey(msgHash, sigBytes, recovery);

  return publicKey;
}

module.exports = {
    recoverPublicKey
};
// PROJECT MODIFICATIONS