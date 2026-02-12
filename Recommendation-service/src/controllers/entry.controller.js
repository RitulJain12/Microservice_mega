const client = require('../db/db');

exports.trackEntry = async (req, res) => {
    try {
        console.log(`nejejnss`);
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ error: 'Missing userId or productId' });
        }

        const timestamp = Date.now();
        // Store entry time in Redis
        // Key format: entry:{userId}:{productId}
        await client.set(`entry:${userId}:${productId}`, timestamp);

        res.status(200).json({ message: 'Entry tracked' });
    } catch (error) {
        console.error('Error tracking entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.trackExit = async (req, res) => {
    try {
        console.log(`exxxit`);
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ error: 'Missing userId or productId' });
        }

        const exitTime = Date.now();
        // Retrieve entry time
        const entryTime = await client.get(`entry:${userId}:${productId}`);

        if (entryTime) {
            const duration = exitTime - parseInt(entryTime);

            // Store duration in a Sorted Set for the user
            // Key: user_interactions:{userId}
            // Score: duration
            // Member: productId
            // ZINCRBY allows accumulating time if user visits multiple times
            await client.zIncrBy(`user_interactions:${userId}`, duration, productId);

            // Clean up entry key
            await client.del(`entry:${userId}:${productId}`);

            console.log(`User ${userId} spent ${duration}ms on product ${productId}`);
        }

        res.status(200).json({ message: 'Exit tracked' });
    } catch (error) {
        console.error('Error tracking exit:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
