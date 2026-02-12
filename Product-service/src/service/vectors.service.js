const { Pinecone } = require('@pinecone-database/pinecone');
const pn = new Pinecone({
  apiKey: process.env.PINECONE
})
const idx = pn.Index('products');
const embeds = require('./embed.service');

async function main(obj) {
  try {
    const vector = await embeds(obj);
    if (!vector || !Array.isArray(vector)) {
      console.error("Error: Embedding generation failed, vector is invalid:", vector);
      return;
    }

    // Pinecone upsert takes an array of records
    const val = `price:${obj.price.amount},title:${obj.title},description:${obj.description},id:${obj.id}`
    await idx.namespace('products').upsert({
      records: [
        {
          id: String(obj.id),
          values: vector,
          metadata: {
            text: val,
            pid: `${obj.id}`,
            price: `${obj.price.amount}`,
            title: `${obj.title}`,
            description: `${obj.description}`,
            source: "product-service",
          },
        },
      ],
    });
    console.log(`Upserted product ${obj.id}`);
  } catch (error) {
    console.error("Error in vector upsert:", error);
  }
}

async function findSimilarProducts(obj) {
  try {

    const productVector = await embeds(obj);
    const queryResponse = await idx.namespace('products').query({
      vector: productVector,
      topK: 5,
      includeMetadata: true,
      filter: {
        pid: { '$ne': obj.pid }
      }
    });

    if (!queryResponse.matches) {
      return [];
    }
    else console.log(`querry matches: ${JSON.stringify(queryResponse.matches, null, 2)}`);
    // Return just the array of products (or IDs)
    // We can return the metadata directly
    return queryResponse.matches.map(match => ({
      id: match.id,
      score: match.score,
      ...match.metadata
    }));

  } catch (error) {
    console.error("Error finding similar products:", error);
    return [];
  }
}

module.exports = {
  upsertProduct: main,
  findSimilarProducts
}; 