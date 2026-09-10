const axios = require("axios");

const sendWhatsAppText = async (phone, message) => {
    try {
        const url =
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const response = await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phone,
                type: "text",
                text: {
                    preview_url: false,
                    body: message
                }
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type":
                        "application/json"
                }
            }
        );

        console.log(
            "WhatsApp message sent successfully"
        );

        console.log(response.data);

        return response.data;

    } catch (error) {

        console.error(
            "WHATSAPP ERROR:"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


module.exports = {
    sendWhatsAppText
};