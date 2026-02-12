const { default: mongoose } = require('mongoose');
const productModel = require('../models/product.model');
const { uploadImage } = require('../service/imagekit.service');
const { upsertProduct, findSimilarProducts } = require('../service/vectors.service');
const main=require('../service/vectors.service');
async function createProduct(req, res) {
    try {
        let { stock } = req.body;
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        if (!title || !description || (priceAmount === undefined)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const amount = Number(priceAmount);
        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid price amount" });
        }

        const seller = req.user?.id || req.user?._id;
        if (!seller) {
            return res.status(401).json({ message: "Unauthorized: seller not found" });
        }

        const price = {
            amount: amount,
            currency: priceCurrency
        }

        const images = [];
        if (Array.isArray(req.files) && req.files.length) {
            const uploads = await Promise.all(req.files.map(async (file) => {
                const { url, fileId, thumbnailUrl } = await uploadImage(file.buffer);
                return { url, thumbnail: thumbnailUrl || '', id: fileId || '' };
            }));
            uploads.forEach(u => images.push(u));
        }
        stock = stock !== undefined ? Number(stock) : 0;
        const product = await productModel.create({
            title,
            description,
            price,
            seller,
            images, stock,
            discounted: false,
            discountedprice: 0,
            discountpercentage: 0,
            actualprice: price.amount
        });

        res.status(201).json({ message: 'Product created', product });
       // res.status(201).json({ message: 'Product created', product });
        await upsertProduct({ title, description, price, id: product._id });
        return;
    }
    catch (err) {
        console.error('createProduct error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
} 


async function getAllProducts(req, res) {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;
    const filter = {};
    console.log(`q:${q}`);
    if (q) {
        filter.$text = { $search: q };
    }
    filter.discounted = false;
    if (minprice) {
        filter['price.amount'] = { $gte: Number(minprice) };
    }
    if (maxprice) {
        filter['price.amount'] = filter['price.amount'] || {};
        filter['price.amount'].$lte = Number(maxprice);
    }

    let sortOption = {};
    if (req.query.sort === 'price_asc') {
        sortOption = { 'price.amount': 1 };
    } else if (req.query.sort === 'price_desc') {
        sortOption = { 'price.amount': -1 };
    }

    const products = await productModel.find(filter).sort(sortOption).skip(Number(skip)).limit(Math.min(Number(limit), 20));
    console.log(`ye lo${products}`)
    return res.status(200).json({ message: 'Products fetched successfully', data: products });
}


async function getProductById(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product fetched successfully', product });
    }
    catch (err) {
        console.error('getProductById error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


async function updateProduct(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }
    try {
        const product = await productModel.findOne({ _id: id, seller: req.user?.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { title, description, priceAmount } = req.body;
        if (title) {
            product.title = title;
        }
        if (description) {
            product.description = description;
        }
        if (priceAmount) {
            const amount = Number(priceAmount);
            if (Number.isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: "Invalid price amount" });
            }
        }

        await product.save();
        return res.status(200).json({ message: 'Product updated successfully', product });

    }

    catch (err) {
        console.error('updateProduct error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


async function deleteProduct(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }
    try {

        const product = await productModel.findOneAndDelete({ _id: id, seller: req.user?.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });


    }

    catch (err) {
        console.error('deleteProduct error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function getProductsBySeller(req, res) {
    try {
        const sellerId = req.user?.id;
        const { skip = 0, limit = 20 } = req.query;
        const products = await productModel.find({ seller: sellerId }).skip(Number(skip)).limit(Math.min(Number(limit), 20));
        return res.status(200).json({ message: 'Products fetched successfully', products });
    }
    catch (err) {
        console.error('getProductsBySeller error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function decreaseStockForProducts(req, res) {
    const { items } = req.body;
    console.log(items);
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    console.log(items);
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid items array' });
    }
    try {
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.productId, 'stock': { $gte: item.quantity } },
                update: { $inc: { stock: -item.quantity } }
            }
        }));
        const result = await productModel.bulkWrite(bulkOps);
        return res.status(200).json({ message: 'Stock decreased successfully', modifiedCount: result.modifiedCount });

    }
    catch (err) {
        console.error('decreaseStockForProducts error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getProductsByIds(req, res) {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(200).json({ products: [] });
        }
        const products = await productModel.find({ _id: { $in: ids } });
        return res.status(200).json({ products });
    } catch (err) {
        console.error('getProductsByIds error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function applyDiscount(req, res) {
    try {
        const productId = req.params.id;
        const { discountPercentage } = req.body;
        console.log(req);
        const product = await productModel.findById(productId);
        if (!product) {
            console.log(productId);
            return res.status(404).json({ message: 'Product not found' });
        }
        const discountedPrice = product.price.amount - (product.price.amount * discountPercentage / 100);
        product.discounted = true;
        product.discountedprice = discountedPrice;
        product.discountpercentage = discountPercentage;
        product.actualprice = product.price.amount;
        product.price.amount=discountedPrice;
        await product.save();
        return res.status(200).json({ message: 'Discount applied successfully', product });
    } catch (err) {
        console.error('applyDiscount error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function removeDiscount(req, res) {
    try {
        const productId = req.params.id;
        const product = await productModel.findOne({ _id: productId, seller: req.user?.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.price.amount=product.actualprice;
        product.discounted = false;
        product.discountedprice = 0;
        product.discountpercentage = 0;
        product.actualprice = product.price.amount;
        await product.save();
        return res.status(200).json({ message: 'Discount removed successfully', product });
    } catch (err) {
        console.error('removeDiscount error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateDiscount(req, res) {
    try {
        const productId = req.params.id;
        const { discountPercentage } = req.body;
        const product = await productModel.findOne({ _id: productId, seller: req.user?.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const discountedPrice = product.actualprice.amount - (product.actualprice.amount * discountPercentage / 100);
        product.discounted = true;
        product.discountedprice = discountedPrice;
        product.discountpercentage = discountPercentage;
        product.price=discountPrice;

        await product.save();
        return res.status(200).json({ message: 'Discount updated successfully', product });
    } catch (err) {
        console.error('updateDiscount error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getDiscountedProducts(req, res) {
    try {
        const { q, limit = 20, skip = 0 } = req.query;
        const filter={discounted:true};
          if (q) {
        filter.$text = { $search: q };
    }
        const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20));
        console.log(products);
        return res.status(200).json({ products });
    } catch (err) {
        console.error('getDiscountedProducts error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getSimilarProducts(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product ID required" });

        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const similarProducts = await main.findSimilarProducts({
            pid:product._id,
            title:product.title,
            price:product.price.amount,
            description:product.description});

        if (similarProducts.length === 0) {
            return res.status(200).json({ products: [] });
        }

        const productIds = similarProducts.map(p => p.id);
        const products = await productModel.find({ _id: { $in: productIds } });
          
        return res.status(200).json({ products });
    } catch (err) {
        console.error('getSimilarProducts error', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller,
    decreaseStockForProducts,
    getProductsByIds,
    applyDiscount,
    removeDiscount,
    updateDiscount,
    getDiscountedProducts,
    getSimilarProducts
};