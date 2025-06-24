const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/price-check', async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get('https://walmart-product-search.p.rapidapi.com/search', {
      params: { keyword: query },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'walmart-product-search.p.rapidapi.com',
      },
    });

    const items = response.data.items.slice(0, 3).map((item, index) => ({
      id: item.itemId || `walmart-${index}`,
      name: item.title,
      vendor: 'Walmart',
      price: parseFloat(item.salePrice || item.price || 10.0),
    }));

    res.json(items);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 SumLove backend running on port ${PORT}`);
});
