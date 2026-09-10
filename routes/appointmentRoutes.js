const express = require("express");


const {

    createAppointment,

    getAppointments,

    confirmAppointment,

    rejectAppointment,

    cancelAppointment

} = require("../controllers/appointmentController");


const router =
    express.Router();


// CREATE
router.post(
    "/",
    createAppointment
);


// GET ALL
router.get(
    "/",
    getAppointments
);


// CONFIRM
router.patch(
    "/:id/confirm",
    confirmAppointment
);


// REJECT
router.patch(
    "/:id/reject",
    rejectAppointment
);


// CANCEL
router.patch(
    "/:id/cancel",
    cancelAppointment
);


module.exports = router;