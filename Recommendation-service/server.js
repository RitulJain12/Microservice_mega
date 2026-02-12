require('dotenv').config();
const app = require('./src/app');
const redis = require('./src/db/db');

// Connect to Redis
(async () => {
   try {
      await redis.connect();
      console.log('Redis connected successfully');

      app.listen(process.env.PORT || 3009, () => {
         console.log(`Recommendation Service running on port ${process.env.PORT || 3009}`);
      });
   } catch (err) {
      console.error('Failed to start Recommendation Service:', err);
      process.exit(1);  
   }   
})();  
