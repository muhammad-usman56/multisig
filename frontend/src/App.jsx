import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
function App() {
  const [count, setCount] = useState(0);

  async function signbst() {
    try {
     let pub = await window.unisat.getPublicKey();
     console.log(pub)
          const response = await axios.post('http://localhost:8080/api/sendInscription');
          const { inputs, psbthex } = response.data;
         console.log(inputs , 'psnt')
       
   let abc = await   window.unisat.signPsbt(psbthex, {
        toSignInputs:  inputs.map((inp, index) => {
              return {
                index: index,
                publicKey: pub,
                disableTweakSigner: true,
              };
            }),
        autoFinalized: false,
      });
      const signature = abc;

// Create an object with the signature as the value
const requestBody = {
    signature: signature,
    inputs:inputs
};
      const responses = await axios.post('http://localhost:8080/api/sendInscriptionSign',requestBody);
     
     console.log(inputs , 'psnt')
      console.log(abc)
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <>
      <button onClick={signbst}>Send inscription</button>
    </>
  );
}

export default App;
