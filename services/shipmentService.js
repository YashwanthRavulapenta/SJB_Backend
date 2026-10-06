// =====================================================
// SHIPMENT SERVICE
// =====================================================


// =====================================================
// SUPPORTED SHIPMENT STATUSES
// =====================================================

const shipmentStatuses = [

    "not_created",

    "pickup_pending",

    "picked_up",

    "in_transit",

    "out_for_delivery",

    "delivered",

    "delivery_failed",

    "rto"

];


// =====================================================
// CHECK VALID SHIPMENT STATUS
// =====================================================

const isValidShipmentStatus = (
    status
) => {

    return shipmentStatuses.includes(
        status
    );
};


// =====================================================
// GET TRACKING URL
// =====================================================

const getTrackingUrl = (
    courier,
    trackingNumber
) => {

    if (
        !courier ||
        !trackingNumber
    ) {
        return null;
    }


    const normalizedCourier =
        courier
            .toLowerCase()
            .trim();


    // -------------------------------------------------
    // EKART
    // -------------------------------------------------

    if (
        normalizedCourier ===
        "ekart"
    ) {

        return (
            "https://www.ekartlogistics.com/" +
            "ekartlogistics-web/shipmenttrack/" +
            encodeURIComponent(
                trackingNumber
            )
        );
    }


    // -------------------------------------------------
    // UNKNOWN COURIER
    // -------------------------------------------------

    return null;
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    shipmentStatuses,

    isValidShipmentStatus,

    getTrackingUrl

};