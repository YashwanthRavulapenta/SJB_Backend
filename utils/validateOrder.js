const validateShippingAddress = (
    address
) => {

    if (!address) {

        return "Shipping address is required";

    }


    const requiredFields = [
        "fullName",
        "phone",
        "address",
        "city",
        "state",
        "pincode"
    ];


    for (
        const field of requiredFields
    ) {

        if (
            !address[field] ||
            !String(address[field]).trim()
        ) {

            return `${field} is required`;

        }

    }


    // ======================================
    // PHONE
    // ======================================

    const phone =
        String(address.phone).trim();


    if (!/^[6-9]\d{9}$/.test(phone)) {

        return (
            "Enter a valid 10-digit mobile number"
        );

    }


    // ======================================
    // PINCODE
    // ======================================

    const pincode =
        String(address.pincode).trim();


    if (!/^\d{6}$/.test(pincode)) {

        return (
            "Enter a valid 6-digit pincode"
        );

    }


    return null;

};


module.exports =
    validateShippingAddress;