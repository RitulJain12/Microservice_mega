// Backend/Product-service/seed.js
const mongoose = require('mongoose');
const productModel = require('./src/models/product.model');
require('dotenv').config();

const sellerId = '6961339e5f1a0f3bc0a425dd';

const products = [
  // Original products with enhanced images
  {
    title: 'Table',
    description: 'Elegant wooden dining/study table with premium finish and durable oak wood construction.',
    price: { amount: 1000, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '1' }],
    stock: 15,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 1000
  },
  {
    title: 'Sofa',
    description: 'Ultra-comfortable 3-seater fabric sofa in charcoal grey, perfect for modern living rooms.',
    price: { amount: 10000, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '2' }],
    stock: 8,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 10000
  },
  {
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear wireless headphones with 40-hour battery life and high-fidelity sound.',
    price: { amount: 616, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '3' }],
    stock: 50,
    discounted: true,
    discountedprice: 616,
    discountpercentage: 30,
    actualprice: 880
  },
  {
    title: 'Watch',
    description: 'Sleek minimalist analog wristwatch with premium leather strap and water resistance.',
    price: { amount: 2100, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '4' }],
    stock: 30,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 2100
  },
  {
    title: 'Macbook',
    description: 'Supercharged laptop featuring Apple silicon chip, stunning Retina display, and all-day battery life.',
    price: { amount: 25500, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '5' }],
    stock: 5,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 25500
  },
  {
    title: 'Mouse',
    description: 'Ergonomic wireless optical mouse with adjustable DPI and silent click buttons.',
    price: { amount: 850, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '6' }],
    stock: 120,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 850
  },
  {
    title: 'Glass',
    description: 'Set of 4 elegant double-walled drinking glasses for hot or cold beverages.',
    price: { amount: 850, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '7' }],
    stock: 45,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 850
  },
  {
    title: 'Shoes',
    description: 'Breathable lightweight running sneakers with cushioned soles for maximum daily comfort.',
    price: { amount: 850, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '8' }],
    stock: 60,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 850
  },
  {
    title: 'Study Book',
    description: 'Premium hardcover lined journal/notebook with thick fountain-pen friendly pages.',
    price: { amount: 850, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '9' }],
    stock: 200,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 850
  },
  {
    title: 'Classic Backpack',
    description: 'Water-resistant vintage canvas backpack with padded laptop sleeve and multiple pockets.',
    price: { amount: 1250, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '10' }],
    stock: 40,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 1250
  },

  // Daily Life Products
  {
    title: 'Organic Honey',
    description: '100% Pure Raw Organic Honey. Rich in antioxidants and perfect for daily wellness or sweetening.',
    price: { amount: 450, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '11' }],
    stock: 150,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 450
  },
  {
    title: 'Specialty Ground Coffee',
    description: 'Premium Medium Roast Ground Coffee. Handpicked Arabica beans with rich chocolate and caramel notes.',
    price: { amount: 890, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '12' }],
    stock: 80,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 890
  },
  {
    title: 'Pure Green Tea',
    description: 'Relaxing organic whole-leaf Green Tea. Packed with catechins and fresh aroma for a perfect morning cup.',
    price: { amount: 350, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '13' }],
    stock: 120,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 350
  },
  {
    title: 'Insulated Water Bottle',
    description: 'Double-walled vacuum insulated stainless steel flask. Keeps beverages ice-cold for 24h or steaming hot for 12h.',
    price: { amount: 1200, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '14' }],
    stock: 90,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 1200
  },
  {
    title: 'Coconut Milk Shampoo',
    description: 'Deeply nourishing hair shampoo infused with creamy organic coconut milk and pure aloe vera.',
    price: { amount: 590, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '15' }],
    stock: 75,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 590
  },
  {
    title: 'Bamboo Toothbrushes (4 Pack)',
    description: 'Eco-friendly biodegradable natural bamboo toothbrushes with soft charcoal-infused bristles.',
    price: { amount: 290, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '16' }],
    stock: 140,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 290
  },
  {
    title: 'Extra Virgin Olive Oil',
    description: 'First cold pressed Extra Virgin Olive Oil imported from Spain. Rich in healthy monounsaturated fats.',
    price: { amount: 1100, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '17' }],
    stock: 65,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 1100
  },
  {
    title: 'Handcrafted Ceramic Mug',
    description: 'Cozy textured beige ceramic coffee mug. Comfortably fits in your hands, dishwasher and microwave safe.',
    price: { amount: 490, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '18' }],
    stock: 110,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 490
  },
  {
    title: 'Premium Dark Chocolate Bar',
    description: '72% Single-Origin Cocoa Rich Dark Chocolate. Smooth, decadent, and slightly bittersweet taste profile.',
    price: { amount: 250, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1549007994-cb92ca8a4bd7?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '19' }],
    stock: 250,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 250
  },
  {
    title: 'Aromatherapy Soy Candle',
    description: 'Eco-soy wax candle hand-poured and scented with French lavender and fresh eucalyptus essential oils.',
    price: { amount: 650, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '20' }],
    stock: 95,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 650
  },
  {
    title: 'Natural Almond Butter',
    description: 'Slow-roasted creamy almond butter with zero additives. High in protein and healthy dietary fiber.',
    price: { amount: 750, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '21' }],
    stock: 85,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 750
  },
  {
    title: 'Smart LED Desk Lamp',
    description: 'Touch-controlled LED desk lamp with 5 brightness levels, 3 color modes, and an integrated USB charging port.',
    price: { amount: 2400, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '22' }],
    stock: 35,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 2400
  },
  {
    title: 'Canvas Grocery Tote Bag',
    description: 'Heavy-duty organic cotton reusable canvas grocery bag with wide straps and inner storage pocket.',
    price: { amount: 190, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '23' }],
    stock: 300,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 190
  },
  {
    title: 'Quick-Dry Travel Towel',
    description: 'Ultra-absorbent lightweight microfiber travel towel. Dries 3x faster than normal cotton towels.',
    price: { amount: 850, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '24' }],
    stock: 120,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 850
  },
  {
    title: 'Leather Laptop Sleeve',
    description: 'Slim water-resistant PU leather sleeve case offering dual protection for 13-14 inch laptops.',
    price: { amount: 1490, currency: 'INR' },
    seller: sellerId,
    images: [{ url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80', thumbnail: '', id: '25' }],
    stock: 55,
    discounted: false,
    discountedprice: 0,
    discountpercentage: 0,
    actualprice: 1490
  }
];

async function seed() {
  console.log('Connecting to database...');
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log('Connected to MongoDB. Purging existing products...');
    await productModel.deleteMany({});
    console.log('Database purged. Seeding new products...');
    const result = await productModel.insertMany(products);
    console.log(`Successfully seeded ${result.length} products!`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
