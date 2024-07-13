const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.get('/api/rates', async (req, res) => {
  try {
    const apiURL = 'https://api.metalpriceapi.com/v1/';
    const apiKEY = process.env.API_KEY;
    const response = await axios.get(`${apiURL}latest?api_key=${apiKEY}&base=AUD&currencies=XAU,XAG,XPD,XPT,USD,EUR,GBP,CNY`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});