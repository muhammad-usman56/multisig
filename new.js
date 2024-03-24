const { AddressType } = require('@unisat/wallet-sdk');
const { NetworkType } = require('@unisat/wallet-sdk/lib/network');
const { LocalWallet } = require('@unisat/wallet-sdk/lib/wallet');
const { sendBTC, sendInscription } = require('@unisat/wallet-sdk/lib/tx-helpers');
const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').default;
const { OpenApi } = require('./open-api');
const ecc = require('tiny-secp256k1');
const { getAddressUtxoDust } = require('@unisat/wallet-sdk/lib/transaction');

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const openapi = new OpenApi({
  baseUrl: 'https://open-api-testnet.unisat.io',
  apiKey: '225d88b1745e7241f3621cf2f9e4c6d65c1783b8e924581ce86a966226c20088', // Unisat API key
});

const toXOnly = (pubKey) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

const network = bitcoin.networks.testnet;
const networkType = NetworkType.TESTNET;

// // Project owner wallet
const pk1 = '';
const signer1 = ECPair.fromWIF(pk1, network);
const wallet1 = new LocalWallet(pk1, AddressType.P2TR, networkType);
// // Platform wallet
// const pk2 = 'XXX';
// const signer2 = ECPair.fromWIF(pk2, network);
// const wallet2 = new LocalWallet(pk2, AddressType.P2TR, networkType);

// 2 of 2 p2tr multisig wallet
const createOrGetMultiSigWallet = async (key) => {
let bpub = "02cec5ce85471394aa2833e359854954a6a84a222873b3b95dede1d4e056f4d6cc"

const leafPubkeys = [
    toXOnly(signer1.publicKey).toString('hex'),
    toXOnly(bpub).toString('hex'),
  ];
  const leafScriptAsm = `${leafPubkeys[1]} OP_CHECKSIG ${leafPubkeys[0]} OP_CHECKSIGADD OP_2 OP_NUMEQUAL`;

  const leafScript = bitcoin.script.fromASM(leafScriptAsm);

  const scriptTree = [
    {
      output: bitcoin.script.fromASM(
        '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0 OP_CHECKSIG'
      ),
    },
    [
      {
        output: bitcoin.script.fromASM(
          '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0 OP_CHECKSIG'
        ),
      },
      {
        output: leafScript,
      },
    ],
  ];
  const redeem = {
    output: leafScript,
    redeemVersion: 192,
  };

  const multisigWallet = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(signer1.publicKey),
    scriptTree,
    redeem,
    network,
  });



  return { multisigWallet, redeem };
};

const sendInscriptionFromMultisigWallet = async () => {
  const { multisigWallet, redeem } = await createOrGetMultiSigWallet();
 console.log(multisigWallet.address)
  const toAddress =
    'tb1pzg0d7rcx4eatk6pspmaf7yxkzct290jnhah8wzalzcqds9tee8ts443r4a'; // Receiver address
  const btcUtxos = await openapi.getAddressUtxoData(multisigWallet.address);
  const inscriptionId =
    'b33195b40d93ce82861fc11b37025330b621aa6cfd88a6412d6826cb3c46c867i0'; // Inscription to send
  const inscriptionInfo = await openapi.getInscriptionInfo(inscriptionId);

  const tapLeafScript = [
    {
      leafVersion: redeem.redeemVersion,
      script: redeem.output,
      controlBlock: multisigWallet.witness[multisigWallet.witness.length - 1],
    },
  ];

  const { psbt, toSignInputs } = await sendInscription({
    assetUtxo: {
      txid: inscriptionInfo.utxo.txid,
      vout: inscriptionInfo.utxo.vout,
      satoshis: inscriptionInfo.utxo.satoshi,
      scriptPk: inscriptionInfo.utxo.scriptPk,
      pubkey: multisigWallet.pubkey.toString('hex'),
      addressType: AddressType.P2TR,
      inscriptions: inscriptionInfo.utxo.inscriptions,
      atomicals: [],
    },
    btcUtxos: btcUtxos.utxo.map((v) => ({
      txid: v.txid,
      vout: v.vout,
      satoshis: v.satoshi,
      scriptPk: v.scriptPk,
      pubkey: multisigWallet.pubkey.toString('hex'),
      addressType: AddressType.P2TR,
      inscriptions: v.inscriptions,
      atomicals: [],
    })),
    toAddress,
    networkType: networkType,
    changeAddress: multisigWallet.address,
    feeRate: 2,
    outputValue: inscriptionInfo.utxo.satoshi,
  });

  const inputs = psbt.data.inputs;

  for (let i = 0; i < inputs.length; i++) {
    psbt.updateInput(i, {
      tapLeafScript,
    });
  }
console.log(inputs,psbt)
let psbthex = psbt.toHex()
console.log(inputs)
return {inputs,psbthex}
  // Use wallets to sign
  // await wallet1.signPsbt(psbt, {
  //   toSignInputs: inputs.map((inp, index) => {
  //     return {
  //       index: index,
  //       publicKey: wallet1.pubkey,
  //       disableTweakSigner: true,
  //     };
  //   }),
  // });

  // await wallet2.signPsbt(psbt, {
  //   toSignInputs: inputs.map((inp, index) => {
  //     return {
  //       index: index,
  //       publicKey: wallet2.pubkey,
  //       disableTweakSigner: true,
  //     };
  //   }),
  // });

  // psbt.finalizeAllInputs();
  // const rawtx = psbt.extractTransaction(true).toHex();

  // const txid = await openapi.pushtx(rawtx);
  // console.log('txid:', txid);
};

const sendTrnasaction  = async (abc,inputss) =>{
 

 
   const inputs = inputss;
 console.log('calling1')
  const psbt2 = bitcoin.Psbt.fromHex(abc, {
    network,
  });
  console.log("calling2",psbt2);
  try {
    let re = await wallet1.signPsbt(psbt2, {
 
      toSignInputs: inputs.map((inp, index) => ({
        index,
        publicKey: wallet1.pubkey,
        disableTweakSigner: true,
      })),
    });
  } catch (error) {
    console.log(error);
  }

  console.log("calling3",re);
  psbt2.finalizeAllInputs();
  const rawtx = psbt2.extractTransaction(true).toHex();
console.log(rawtx)
  const txid = await openapi.pushtx(rawtx);
  console.log("TxID: ", txid);
}

// createOrGetMultiSigWallet()
module.exports = { sendInscriptionFromMultisigWallet,sendTrnasaction };


