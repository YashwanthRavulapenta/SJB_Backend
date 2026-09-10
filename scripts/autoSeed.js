require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinary");

const Saree = require("../models/sareeModel");
const Jewellery = require("../models/jewelleryModel");


// ======================================================
// SAREE CATEGORY CONFIGURATION
// ======================================================

const sareeConfig = {

    cotton: {
        category: "Cotton Sarees",
        name: "Cotton Saree",
        basePrice: 1299,

        colors: [
            "Blue",
            "Red",
            "Green",
            "Pink",
            "Yellow",
            "Purple",
            "Orange",
            "White"
        ]
    },


    silk: {
        category: "Silk Sarees",
        name: "Silk Saree",
        basePrice: 2999,

        colors: [
            "Royal Blue",
            "Maroon",
            "Green",
            "Red",
            "Purple",
            "Pink",
            "Golden",
            "Navy Blue"
        ]
    },


    chiffon: {
        category: "Chiffon Saree",
        name: "Chiffon Saree",
        basePrice: 1599,

        colors: [
            "Pink",
            "Blue",
            "Black",
            "Green",
            "Red",
            "Purple",
            "Grey",
            "Peach"
        ]
    },


    georgette: {
        category: "Georgette Saree",
        name: "Georgette Saree",
        basePrice: 1899,

        colors: [
            "Pink",
            "Black",
            "Blue",
            "Green",
            "Red",
            "Peach",
            "Purple",
            "Grey"
        ]
    },


    kanjivaram: {
        category: "Kanjivaram Saree",
        name: "Kanjivaram Saree",
        basePrice: 3999,

        colors: [
            "Maroon",
            "Golden",
            "Green",
            "Red",
            "Purple",
            "Blue",
            "Pink",
            "Orange"
        ]
    }

};


// ======================================================
// JEWELLERY CATEGORY CONFIGURATION
// ======================================================

const jewelleryConfig = {

    necklace: {
        category: "Necklace",
        name: "Necklace",
        basePrice: 1499
    },


    earrings: {
        category: "Earrings",
        name: "Earrings",
        basePrice: 599
    },


    bangles: {
        category: "Bangles",
        name: "Bangles",
        basePrice: 799
    },


    bracelet: {
        category: "Bracelet",
        name: "Bracelet",
        basePrice: 699
    },


    ring: {
        category: "Ring",
        name: "Ring",
        basePrice: 499
    },


    jewelleryset: {
        category: "Jewellery Set",
        name: "Jewellery Set",
        basePrice: 2499
    }

};


// ======================================================
// UPLOAD IMAGE TO CLOUDINARY
// ======================================================

async function uploadToCloudinary(filePath, folder) {

    const result =
        await cloudinary.uploader.upload(
            filePath,
            {

                folder: folder,

                resource_type: "image"

            }
        );


    return result;
}


// ======================================================
// GET PRODUCT NUMBER FROM FILE NAME
// Example:
// cotton1.svg → 1
// silk8.jpg → 8
// ======================================================

function getNumber(fileName) {

    const match =
        fileName.match(/\d+/);


    if (match) {

        return Number(match[0]);

    }


    return 1;

}


// ======================================================
// SEED SAREES
// ======================================================

async function seedSarees() {

    console.log(
        "\n========== STARTING SAREES ==========\n"
    );


    const sareeFolder =
        path.join(
            __dirname,
            "..",
            "seed-images",
            "sarees"
        );


    // Check folder exists

    if (!fs.existsSync(sareeFolder)) {

        console.log(
            "❌ Sarees folder not found"
        );

        return;

    }


    const files =
        fs.readdirSync(sareeFolder);


    for (const file of files) {

        // Only image files

        if (
            !/\.(jpg|jpeg|png|webp|svg)$/i.test(file)
        ) {

            continue;

        }


        const fileName =
            file.toLowerCase();


        let config = null;


        // Detect category from filename

        for (const key in sareeConfig) {

            if (
                fileName.startsWith(key)
            ) {

                config =
                    sareeConfig[key];

                break;

            }

        }


        // Unknown category

        if (!config) {

            console.log(
                `⚠️ Unknown saree category: ${file}`
            );

            continue;

        }


        const number =
            getNumber(file);


        const productName =
            `${config.name} ${number}`;


        // Check if already exists

        const existing =
            await Saree.findOne({

                name: productName,

                category:
                    config.category

            });


        if (existing) {

            console.log(
                `⏭️ Already exists: ${productName}`
            );

            continue;

        }


        try {

            console.log(
                `⬆️ Uploading ${productName}...`
            );


            const filePath =
                path.join(
                    sareeFolder,
                    file
                );


            // Upload to Cloudinary

            const result =
                await uploadToCloudinary(
                    filePath,
                    "sarees"
                );


            // Select color

            const color =
                config.colors[
                    (number - 1) %
                    config.colors.length
                ];


            // Generate price

            const price =
                config.basePrice +
                ((number - 1) * 150);


            // Save to MongoDB

            await Saree.create({

                name: productName,

                category:
                    config.category,

                color: color,

                price: price,

                image:
                    result.secure_url,

                imagePublicId:
                    result.public_id

            });


            console.log(
                `✅ Added: ${productName}`
            );


        } catch (error) {

            console.log(
                `❌ Failed: ${productName}`
            );

            console.log(
                error.message
            );

        }

    }


    console.log(
        "\n🎉 SAREES FINISHED"
    );

}


// ======================================================
// SEED JEWELLERY
// ======================================================

async function seedJewellery() {

    console.log(
        "\n========== STARTING JEWELLERY ==========\n"
    );


    const jewelleryFolder =
        path.join(
            __dirname,
            "..",
            "seed-images",
            "jewellery"
        );


    // Check folder exists

    if (!fs.existsSync(jewelleryFolder)) {

        console.log(
            "❌ Jewellery folder not found"
        );

        return;

    }


    const files =
        fs.readdirSync(jewelleryFolder);


    for (const file of files) {

        // Only image files

        if (
            !/\.(jpg|jpeg|png|webp|svg)$/i.test(file)
        ) {

            continue;

        }


        const fileName =
            file.toLowerCase();


        let config = null;


        // Detect category

        for (const key in jewelleryConfig) {

            if (
                fileName.startsWith(key)
            ) {

                config =
                    jewelleryConfig[key];

                break;

            }

        }


        if (!config) {

            console.log(
                `⚠️ Unknown jewellery category: ${file}`
            );

            continue;

        }


        const number =
            getNumber(file);


        const productName =
            `${config.name} ${number}`;


        // Duplicate check

        const existing =
            await Jewellery.findOne({

                name: productName,

                category:
                    config.category

            });


        if (existing) {

            console.log(
                `⏭️ Already exists: ${productName}`
            );

            continue;

        }


        try {

            console.log(
                `⬆️ Uploading ${productName}...`
            );


            const filePath =
                path.join(
                    jewelleryFolder,
                    file
                );


            // Upload to Cloudinary

            const result =
                await uploadToCloudinary(
                    filePath,
                    "jewellery"
                );


            // Generate price

            const price =
                config.basePrice +
                ((number - 1) * 100);


            // Save MongoDB

            await Jewellery.create({

                name: productName,

                category:
                    config.category,

                price: price,

                image:
                    result.secure_url,

                imagePublicId:
                    result.public_id

            });


            console.log(
                `✅ Added: ${productName}`
            );


        } catch (error) {

            console.log(
                `❌ Failed: ${productName}`
            );

            console.log(
                error.message
            );

        }

    }


    console.log(
        "\n🎉 JEWELLERY FINISHED"
    );

}


// ======================================================
// MAIN FUNCTION
// ======================================================

async function startSeeding() {

    try {

        console.log(
            "\n🚀 STARTING AUTO SEEDER\n"
        );


        // Connect MongoDB

        await mongoose.connect(
            process.env.MONGO_URI
        );


        console.log(
            "✅ MongoDB Connected"
        );


        // Seed Sarees

        await seedSarees();


        // Seed Jewellery

        await seedJewellery();


        console.log(
            "\n🎉🎉 ALL PRODUCTS SEEDED SUCCESSFULLY 🎉🎉\n"
        );


    } catch (error) {

        console.log(
            "\n❌ SEEDER ERROR:"
        );

        console.log(
            error.message
        );


    } finally {

        // Close MongoDB

        await mongoose.connection.close();


        console.log(
            "🔌 MongoDB Connection Closed"
        );

    }

}


// ======================================================
// RUN SCRIPT
// ======================================================

startSeeding();