require("dotenv").config();

const axios = require("axios");

const test = async () => {
    try {

        const url =
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const response = await axios.post(
            url,
            {
                messaging_product: "whatsapp",

                to: "919346179135",

                type: "template",

                template: {
                    name: "hello_world",

                    language: {
                        code: "en_US"
                    }
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

        console.log("TEMPLATE SENT SUCCESSFULLY");
        console.log(response.data);

    } catch (error) {

        console.error("TEMPLATE FAILED");

        console.error(
            error.response?.data ||
            error.message
        );
    }
};

test();