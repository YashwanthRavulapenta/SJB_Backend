const Cart = require("../models/cartModel");


// =====================================
// ADD PRODUCT TO CART
// =====================================

const addToCart = async (req, res) => {

    try {

        const {
            productId,
            productType
        } = req.body;


        // Check data
        if (!productId || !productType) {

            return res.status(400).json({
                success: false,
                message: "Product ID and product type are required"
            });
        }


        // Check product type
        if (
            productType !== "saree" &&
            productType !== "jewellery"
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid product type"
            });
        }


        // Find logged-in user's cart
        let cart = await Cart.findOne({
            userId: req.userId
        });


        // If user doesn't have a cart
        if (!cart) {

            cart = await Cart.create({

                userId: req.userId,

                items: [
                    {
                        productId: productId,
                        productType: productType,
                        quantity: 1
                    }
                ]

            });

        }

        // User already has a cart
        else {

            // Check whether product already exists
            const existingItem =
                cart.items.find((item) =>

                    item.productId.toString() === productId &&
                    item.productType === productType

                );


            // Product already in cart
            if (existingItem) {

                existingItem.quantity += 1;

            }

            // New product
            else {

                cart.items.push({

                    productId: productId,
                    productType: productType,
                    quantity: 1

                });

            }


            await cart.save();
        }


        return res.status(200).json({

            success: true,

            message: "Product added to cart",

            cart: cart

        });


    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Unable to add product to cart"

        });
    }
};



// =====================================
// GET USER CART
// =====================================

const getCart = async (req, res) => {

    try {

        const cart =
            await Cart.findOne({
                userId: req.userId
            });


        // User doesn't have a cart yet
        if (!cart) {

            return res.status(200).json({

                success: true,

                items: []

            });
        }


        return res.status(200).json({

            success: true,

            items: cart.items

        });


    } catch (error) {

        console.error(
            "GET CART ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Unable to get cart"

        });
    }
};


module.exports = {
    addToCart,
    getCart
};