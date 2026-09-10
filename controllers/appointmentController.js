const crypto = require("crypto");

const Appointment =
    require("../models/appointmentModel");

const {
    sendWhatsAppText
} = require("../services/whatsappService");


// =====================================================
// CREATE APPOINTMENT
// =====================================================

const createAppointment = async (req, res) => {

    try {

        const {

            customerName,

            phone,

            service,

            category,

            price,

            date,

            time

        } = req.body;


        // ---------------------------------------------
        // 1. REQUIRED FIELDS
        // ---------------------------------------------

        if (

            !customerName ||

            !phone ||

            !service ||

            !category ||

            price === undefined ||

            !date ||

            !time

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        // ---------------------------------------------
        // 2. PHONE VALIDATION
        // ---------------------------------------------

        if (!/^[0-9]{10}$/.test(phone)) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid 10-digit phone number"

            });

        }


        // ---------------------------------------------
        // 3. DATE + TIME VALIDATION
        // ---------------------------------------------

        const requestedDate =
            new Date(
                `${date}T${time}:00`
            );


        if (
            Number.isNaN(
                requestedDate.getTime()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid date or time"

            });

        }


        // ---------------------------------------------
        // 4. FUTURE DATE/TIME
        // ---------------------------------------------

        if (
            requestedDate.getTime()
            <
            Date.now()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a future date and time"

            });

        }


        // ---------------------------------------------
        // 5. CREATE APPOINTMENT ID
        // ---------------------------------------------

        const appointmentId =

            "JC-" +

            crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();


        // ---------------------------------------------
        // 6. SAVE TO MONGODB
        // ---------------------------------------------

        const appointment =

            await Appointment.create({

                appointmentId,

                customerName,

                phone,

                service,

                category,

                price,

                date,

                time,

                status: "pending"

            });


        // ---------------------------------------------
        // 7. CREATE MOM WHATSAPP MESSAGE
        // ---------------------------------------------

        const momMessage = `🔔 NEW J COLLECTIONS APPOINTMENT

Appointment ID:
${appointment.appointmentId}

👤 Customer:
${appointment.customerName}

📱 Phone:
${appointment.phone}

💇 Service:
${appointment.service}

📂 Category:
${appointment.category}

📅 Date:
${appointment.date}

⏰ Time:
${appointment.time}

💰 Price:
₹${appointment.price}

📌 Status:
PENDING

Please review this appointment.

ACCEPT ${appointment.appointmentId}

REJECT ${appointment.appointmentId}`;


        // ---------------------------------------------
        // 8. SEND WHATSAPP TO MOM
        // ---------------------------------------------

        await sendWhatsAppText(

            process.env.MOM_WHATSAPP_NUMBER,

            momMessage

        );


        // ---------------------------------------------
        // 9. SEND RESPONSE TO CUSTOMER
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Appointment request received successfully",

            appointment: {

                appointmentId:
                    appointment.appointmentId,

                customerName:
                    appointment.customerName,

                service:
                    appointment.service,

                date:
                    appointment.date,

                time:
                    appointment.time,

                status:
                    appointment.status

            }

        });


    } catch (error) {

        console.error(
            "CREATE APPOINTMENT:",
            error
        );


        // ---------------------------------------------
        // DUPLICATE APPOINTMENT
        // ---------------------------------------------

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Sorry, this time slot is already requested or booked. Please choose another time."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to create appointment"

        });

    }

};


// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

const getAppointments = async (req, res) => {

    try {

        const appointments =

            await Appointment
                .find()
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            appointments

        });


    } catch (error) {

        console.error(
            "GET APPOINTMENTS:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get appointments"

        });

    }

};


// =====================================================
// CONFIRM APPOINTMENT
// =====================================================

const confirmAppointment = async (req, res) => {

    try {

        const { id } = req.params;


        const appointment =

            await Appointment.findById(id);


        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"

            });

        }


        if (
            appointment.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Appointment is already ${appointment.status}`

            });

        }


        appointment.status =
            "confirmed";

        appointment.confirmedAt =
            new Date();


        await appointment.save();


        return res.status(200).json({

            success: true,

            message:
                "Appointment confirmed",

            appointment

        });


    } catch (error) {

        console.error(
            "CONFIRM APPOINTMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to confirm appointment"

        });

    }

};


// =====================================================
// REJECT APPOINTMENT
// =====================================================

const rejectAppointment = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            reason = ""
        } = req.body;


        const appointment =

            await Appointment.findById(id);


        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"

            });

        }


        if (
            appointment.status !==
            "pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Appointment is already ${appointment.status}`

            });

        }


        appointment.status =
            "rejected";

        appointment.rejectionReason =
            reason;

        appointment.rejectedAt =
            new Date();


        await appointment.save();


        return res.status(200).json({

            success: true,

            message:
                "Appointment rejected",

            appointment

        });


    } catch (error) {

        console.error(
            "REJECT APPOINTMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to reject appointment"

        });

    }

};


// =====================================================
// CANCEL APPOINTMENT
// =====================================================

const cancelAppointment = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            reason = ""
        } = req.body;


        const appointment =

            await Appointment.findById(id);


        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"

            });

        }


        if (

            appointment.status !==
                "pending" &&

            appointment.status !==
                "confirmed"

        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Appointment cannot be cancelled because it is ${appointment.status}`

            });

        }


        appointment.status =
            "cancelled";

        appointment.cancellationReason =
            reason;

        appointment.cancelledAt =
            new Date();


        await appointment.save();


        return res.status(200).json({

            success: true,

            message:
                "Appointment cancelled",

            appointment

        });


    } catch (error) {

        console.error(
            "CANCEL APPOINTMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel appointment"

        });

    }

};


module.exports = {

    createAppointment,

    getAppointments,

    confirmAppointment,

    rejectAppointment,

    cancelAppointment

};