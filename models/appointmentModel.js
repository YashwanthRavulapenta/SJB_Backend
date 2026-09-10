const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema(

    {

        appointmentId: {

            type: String,

            required: true,

            unique: true,

            index: true

        },


        customerName: {

            type: String,

            required: true,

            trim: true,

            maxlength: 80

        },


        phone: {

            type: String,

            required: true,

            trim: true

        },


        service: {

            type: String,

            required: true,

            trim: true

        },


        category: {

            type: String,

            required: true,

            trim: true

        },


        price: {

            type: Number,

            required: true,

            min: 0

        },


        date: {

            type: String,

            required: true

        },


        time: {

            type: String,

            required: true

        },


        status: {

            type: String,

            enum: [

                "pending",

                "confirmed",

                "rejected",

                "cancelled",

                "completed"

            ],

            default: "pending"

        },


        rejectionReason: {

            type: String,

            default: ""

        },


        cancellationReason: {

            type: String,

            default: ""

        },


        confirmedAt: {

            type: Date,

            default: null

        },


        rejectedAt: {

            type: Date,

            default: null

        },


        cancelledAt: {

            type: Date,

            default: null

        }

    },

    {

        timestamps: true

    }

);


// ==========================================
// PREVENT TWO ACTIVE APPOINTMENTS
// AT SAME DATE + TIME
// ==========================================

appointmentSchema.index(

    {
        date: 1,
        time: 1
    },

    {

        unique: true,

        partialFilterExpression: {

            status: {

                $in: [

                    "pending",

                    "confirmed"

                ]

            }

        }

    }

);


module.exports =
    mongoose.model(
        "Appointment",
        appointmentSchema
    );