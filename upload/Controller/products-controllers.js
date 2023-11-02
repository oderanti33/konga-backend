const HttpError = require('../Model/http-error');
const { validationResult } = require('express-validator');
const Products = require('../Model/product');


const getallProducts = async (req, res, next) => {
    let product;
    try {
        product = await Products.find({});
    } catch (err) {
        const error = new HttpError('cannot find any user', 505);
        return next(error);
    };

    if (!product || product.length === 0) {
        const error = new HttpError('cannot find any user', 505);
        return next(error);
    };

    res.json(product.map(u => u.toObject({ getters: true })))
};


const getproductbyUrl = async (req, res, next) => {
    const url = req.params.turl;
    let product;
    try {
        product = await Products.findOne({ url: url });
    } catch (err) {
        const error = new HttpError('url', 500);

        return next(error);
    }

    if (!product) {
        const error = new HttpError('could not get note for the particular ticket Id', 404);
        return next(error);
    }
    res.json(product.toObject({ getters: true }));
};

const createProduct = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const eror = new HttpError('invalid input', 422);
        return next(eror);
    };

    const { id, category1, category2, category, image, title, productCode, price, soldBy, url, realPrice } = req.body;

    const products = new Products({
        id,
        category1,
        category2,
        category,
        image,
        title,
        productCode,
        price,
        soldBy,
        url,
        realPrice,
    });

    try {
        await products.save()
    } catch (err) {
        const error = new HttpError('user cannot be added', 505);
        return next(error);
    };

    res.status(201).json(products.toObject({ getters: true }));
};


exports.createProduct = createProduct;
exports.getallProducts = getallProducts;
exports.getproductbyUrl = getproductbyUrl;