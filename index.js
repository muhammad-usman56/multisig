const express = require('express');
const { sendInscriptionFromMultisigWallet , sendTrnasaction} = require('./new');

const app = express();
const cors = require('cors'); // Import cors middleware
app.use(cors()); // Use cors middleware
app.use(express.json());
app.post('/api/sendInscription', async (req, res) => {
 
  try {
    const { inputs, psbthex } = await sendInscriptionFromMultisigWallet();
    res.status(200).json({ inputs, psbthex });
  } catch (error) {
    console.error('Error sending inscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/sendInscriptionSign', async (req, res) => {
  try {
    // const sign = req.body.signature;
   
    await sendTrnasaction(req.body.signature, req.body.inputs);
    res.status(200).json({ status: true});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});