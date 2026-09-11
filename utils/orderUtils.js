const DISCOUNT_PERCENTAGE = 10;

const DELIVERY_CHARGE = 25;


// ==========================================
// ROUND MONEY
// ==========================================

const roundMoney = (amount) => {

    return Math.round(
        (amount + Number.EPSILON) * 100
    ) / 100;

};


// ==========================================
// DISCOUNTED PRICE
// ==========================================

const calculateDiscountedPrice = (
    originalPrice
) => {

    const discount =
        originalPrice *
        (DISCOUNT_PERCENTAGE / 100);


    return roundMoney(
        originalPrice - discount
    );

};


// ==========================================
// COMPLETE ORDER TOTAL
// ==========================================

const calculateOrderTotals = (
    cartItems
) => {

    let subtotal = 0;

    let discount = 0;

    let productTotal = 0;


    cartItems.forEach((item) => {

        const originalPrice =
            Number(item.originalPrice);

        const quantity =
            Number(item.quantity);


        const itemSubtotal =
            originalPrice * quantity;


        const discountedPrice =
            calculateDiscountedPrice(
                originalPrice
            );


        const itemTotal =
            discountedPrice * quantity;


        const itemDiscount =
            itemSubtotal - itemTotal;


        subtotal += itemSubtotal;

        discount += itemDiscount;

        productTotal += itemTotal;

    });


    subtotal = roundMoney(subtotal);

    discount = roundMoney(discount);

    productTotal = roundMoney(productTotal);


    const totalAmount =
        roundMoney(
            productTotal +
            DELIVERY_CHARGE
        );


    return {

        subtotal,

        discount,

        deliveryCharge:
            DELIVERY_CHARGE,

        totalAmount

    };

};


module.exports = {

    DISCOUNT_PERCENTAGE,

    DELIVERY_CHARGE,

    roundMoney,

    calculateDiscountedPrice,

    calculateOrderTotals

};