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

    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

    let products = [];
    try {
      const response = await axios.get(`${productServiceUrl}/api/product/similar/${mostViewedProductId}`);
      products = response.data.products || [];
    } catch (axiosError) {
      console.warn(`Failed to fetch similar products for product ID ${mostViewedProductId}:`, axiosError.message);
    }

    res.json({
      products,
      message: "success"
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};