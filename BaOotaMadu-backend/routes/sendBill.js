// routes/sendBill.js
const express = require('express');
const router = express.Router();
const { sendBillEmail } = require('../controller/sendBillController');

// POST /send-bill-email
router.post('/', sendBillEmail);

module.exports = router;