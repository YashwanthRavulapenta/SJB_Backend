const Cart = require("../models/cartModel");
const Saree = require("../models/sareeModel");
const Jewellery = require("../models/jewelleryModel");


// =====================================
// ADD TO CART
// =====================================

const addToCart = async (req, res) => {

    try {

        const { productId, productType } = req.body;

        if (!productId || !productType) {
            return res.status(400).json({
                success: false,
                message: "Product ID and product type are required"
            });
        }

        if (
            productType !== "saree" &&
            productType !== "jewellery"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product type"
            });
        }


        // Check product exists

        let product;

        if (productType === "saree") {
            product = await Saree.findById(productId);
        } else {
            product = await Jewellery.findById(productId);
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        // Find user's cart

        let cart = await Cart.findOne({
            userId: req.userId
        });


        // Create cart

        if (!cart) {

            cart = await Cart.create({
                userId: req.userId,

                items: [
                    {
                        productId,
                        productType,
                        quantity: 1
                    }
                ]
            });

        } else {

            const existingItem = cart.items.find(
                item =>
                    item.productId.toString() === productId &&
                    item.productType === productType
            );


            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                cart.items.push({
                    productId,
                    productType,
                    quantity: 1
                });

            }

            await cart.save();
        }


        res.status(200).json({
            success: true,
            message: "Product added to cart"
        });


    } catch (error) {

        console.error("ADD CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add product to cart"
        });

    }

};



// =====================================
// GET CART
// =====================================

const getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            userId: req.userId
        });


        if (!cart) {

            return res.status(200).json({
                success: true,
                items: []
            });

        }


        const items = [];


        for (const item of cart.items) {

            let product;


            if (item.productType === "saree") {

                product = await Saree.findById(
                    item.productId
                );

            } else {

                product = await Jewellery.findById(
                    item.productId
                );

            }


            if (!product) {
                continue;
            }


            items.push({

                cartItemId: item._id,

                productId: product._id,

                productType: item.productType,

                quantity: item.quantity,

                name: product.name,

                price: product.price,

                image: product.image,

                category: product.category,

                color: product.color

            });

        }


        res.status(200).json({
            success: true,
            items
        });


    } catch (error) {

        console.error("GET CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get cart"
        });

    }

};



// =====================================
// UPDATE QUANTITY
// =====================================

const updateQuantity = async (req, res) => {

    try {

        const { itemId } = req.params;
        const { quantity } = req.body;


        if (!quantity || quantity < 1) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });

        }


        const cart = await Cart.findOne({
            userId: req.userId
        });


        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }


        const item = cart.items.id(itemId);


        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });

        }


        item.quantity = quantity;

        await cart.save();


        res.status(200).json({
            success: true,
            message: "Quantity updated"
        });


    } catch (error) {

        console.error(
            "UPDATE QUANTITY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to update quantity"
        });

    }

};



// =====================================
// REMOVE FROM CART
// =====================================

const removeFromCart = async (req, res) => {

    try {

        const { itemId } = req.params;


        const cart = await Cart.findOne({
            userId: req.userId
        });


        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }


        const item = cart.items.id(itemId);


        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });

        }


        cart.items.pull(itemId);

        await cart.save();


        res.status(200).json({
            success: true,
            message: "Product removed from cart"
        });


    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to remove product"
        });

    }

};



module.exports = {

    addToCart,
    getCart,
    updateQuantity,
    removeFromCart

};