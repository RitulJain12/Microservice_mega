const client = require('../db/db');
const axios = require('axios');

exports.getRecommendations = async (req, res) => {
  try {
    
    const userId = req.query.userId || (req.body && req.body.userId) || (req.user && req.user.id);

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const topProducts = await client.zRangeWithScores(
      `user_interactions:${userId}`,
      0,
      0,
      { REV: true }
    );
     console.log(`topproducts---->${topProducts}`)
    if (!topProducts || topProducts.length === 0) {
      return res.json({ recommendations: [] }); // No history
    }

    const mostViewedProductId = topProducts[0].value;

    console.log(`User ${userId} most viewed product: ${mostViewedProductId}`);

    const productServiceUrl = process.env.PRODUCT_SERVICE_URL ;

    const response = await axios.get(`http://localhost:3001/api/product/similar/${mostViewedProductId}`);

    console.log(response.data.products)
    res.json({
      products:response.data.products,
      message:"success"
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};