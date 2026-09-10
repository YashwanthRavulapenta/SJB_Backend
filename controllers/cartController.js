// controllers/cartController.js

const Cart = require("../models/cartModel");

const Saree = require("../models/sareeModel");

const Jewellery = require("../models/jewelleryModel");


// =========================================
// ADD TO CART
// =========================================

const addToCart = async (req, res) => {

    try {

        const userId = req.userId;

        const {
            productId,
            productType
        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (!productId || !productType) {

            return res.status(400).json({

                success: false,

                message:
                    "Product ID and product type are required"

            });

        }


        // =====================================
        // VALID PRODUCT TYPE
        // =====================================

        if (
            productType !== "saree" &&
            productType !== "jewellery"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product type"

            });

        }


        // =====================================
        // CHECK PRODUCT EXISTS
        // =====================================

        let product;


        if (productType === "saree") {

            product =
                await Saree.findById(
                    productId
                );

        } else {

            product =
                await Jewellery.findById(
                    productId
                );

        }


        // =====================================
        // PRODUCT NOT FOUND
        // =====================================

        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        // =====================================
        // CHECK PRODUCT AVAILABILITY
        // =====================================

        if (product.isAvailable === false) {

            return res.status(400).json({

                success: false,

                message:
                    "This product is currently sold out"

            });

        }


        // =====================================
        // FIND USER CART
        // =====================================

        let cart =
            await Cart.findOne({
                userId: userId
            });


        // =====================================
        // CREATE CART IF NOT EXISTS
        // =====================================

        if (!cart) {

            cart =
                await Cart.create({

                    userId: userId,

                    items: [

                        {
                            productId:
                                productId,

                            productType:
                                productType,

                            quantity: 1
                        }

                    ]

                });


            return res.status(201).json({

                success: true,

                message:
                    "Product added to cart",

                cart

            });

        }


        // =====================================
        // CHECK IF SAME PRODUCT ALREADY EXISTS
        // =====================================

        const existingItem =
            cart.items.find(

                item =>

                    item.productId.toString() ===
                    productId.toString()

                    &&

                    item.productType ===
                    productType

            );


        // =====================================
        // SAME PRODUCT FOUND
        // =====================================

        if (existingItem) {

            // Increase quantity

            existingItem.quantity += 1;


            await cart.save();


            return res.status(200).json({

                success: true,

                message:
                    "Product quantity increased",

                cart

            });

        }


        // =====================================
        // NEW PRODUCT
        // =====================================

        cart.items.push({

            productId:
                productId,

            productType:
                productType,

            quantity: 1

        });


        await cart.save();


        return res.status(200).json({

            success: true,

            message:
                "Product added to cart",

            cart

        });


    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to add product to cart"

        });

    }

};



// =========================================
// GET CART
// =========================================

const getCart = async (req, res) => {

    try {

        const userId = req.userId;


        const cart =
            await Cart.findOne({
                userId: userId
            });


        // =====================================
        // NO CART
        // =====================================

        if (!cart) {

            return res.status(200).json({

                success: true,

                items: []

            });

        }


        const cartItems = [];


        // =====================================
        // GET ACTUAL PRODUCT DETAILS
        // =====================================

        for (
            const item of cart.items
        ) {


            let product;


            // =================================
            // SAREE
            // =================================

            if (
                item.productType ===
                "saree"
            ) {

                product =
                    await Saree.findById(
                        item.productId
                    );

            }


            // =================================
            // JEWELLERY
            // =================================

            if (
                item.productType ===
                "jewellery"
            ) {

                product =
                    await Jewellery.findById(
                        item.productId
                    );

            }


            // =================================
            // PRODUCT STILL EXISTS
            // =================================

            if (product) {

                cartItems.push({

                    cartItemId:
                        item._id,

                    productId:
                        product._id,

                    productType:
                        item.productType,

                    quantity:
                        item.quantity,

                    name:
                        product.name,

                    price:
                        product.price,

                    image:
                        product.image,

                    category:
                        product.category,

                    color:
                        product.color,

                    // NEW
                    isAvailable:
                        product.isAvailable

                });

            }

        }


        return res.status(200).json({

            success: true,

            items: cartItems

        });


    } catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get cart"

        });

    }

};



// =========================================
// UPDATE QUANTITY
// =========================================

const updateQuantity = async (
    req,
    res
) => {

    try {

        const userId = req.userId;

        const itemId =
            req.params.itemId;

        const {
            quantity
        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (
            !quantity ||
            quantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be at least 1"

            });

        }


        // =====================================
        // FIND CART
        // =====================================

        const cart =
            await Cart.findOne({
                userId: userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"

            });

        }


        // =====================================
        // FIND ITEM
        // =====================================

        const item =
            cart.items.id(itemId);


        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart item not found"

            });

        }


        // =====================================
        // CHECK PRODUCT STILL AVAILABLE
        // =====================================

        let product;


        if (
            item.productType ===
            "saree"
        ) {

            product =
                await Saree.findById(
                    item.productId
                );

        } else {

            product =
                await Jewellery.findById(
                    item.productId
                );

        }


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        if (product.isAvailable === false) {

            return res.status(400).json({

                success: false,

                message:
                    "This product is currently sold out"

            });

        }


        // =====================================
        // UPDATE
        // =====================================

        item.quantity =
            Number(quantity);


        await cart.save();


        return res.status(200).json({

            success: true,

            message:
                "Quantity updated",

            quantity:
                item.quantity

        });


    } catch (error) {

        console.error(
            "UPDATE QUANTITY ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update quantity"

        });

    }

};



// =========================================
// REMOVE FROM CART
// =========================================

const removeFromCart = async (
    req,
    res
) => {

    try {

        const userId = req.userId;

        const itemId =
            req.params.itemId;


        const cart =
            await Cart.findOne({
                userId: userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"

            });

        }


        const item =
            cart.items.id(itemId);


        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart item not found"

            });

        }


        // =====================================
        // REMOVE
        // =====================================

        cart.items.pull(itemId);


        await cart.save();


        return res.status(200).json({

            success: true,

            message:
                "Product removed from cart"

        });


    } catch (error) {

        console.error(
            "REMOVE CART ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to remove product"

        });

    }

};



module.exports = {

    addToCart,

    getCart,

    updateQuantity,

    removeFromCart

};