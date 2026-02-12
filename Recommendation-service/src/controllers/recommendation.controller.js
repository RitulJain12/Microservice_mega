const client = require('../db/db');
const axios = require('axios');

exports.getRecommendations = async (req, res) => {
  try {
    // Check query first, then body, then user object (if auth middleware used)
    const userId = req.query.userId || (req.body && req.body.userId) || (req.user && req.user.id);

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get the product with the highest duration (score) from the Sorted Set
    // ZREVRANGE returns elements from high to low score. We want the top 1.
    // For node-redis v4:
    // .zRangeWithScores(key, min, max, options) -> returns array of objects {value, score}
    // To get the one with highest score, we can use zRange with specific indices if strictly ordered, 
    // but ZREV range is better for "highest score".
    // In v4: .zRange(key, '+inf', '-inf', { BY: 'SCORE', REV: true, LIMIT: { offset: 0, count: 1 } })

    // Let's try the modern v4 syntax:
    // REV: true sorts from high to low.
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

    // Call Product Service to get similar products
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001/api/product/';

    const response = await axios.get(`http://localhost:3001/api/product/similar/${mostViewedProductId}`);

    // response.data is { products: [...] } from Product Service
    // We send back array directly to match HomePage expectation of response.data (if it expects array)
    // Or if HomePage expects { recommendations: [] }, let's check HomePage again.
    // HomePage: setRecommendedProducts(response.data || [])
    // usually axios response.data is the body.
    // If we send res.json(productsArray), then response.data IS productsArray.
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