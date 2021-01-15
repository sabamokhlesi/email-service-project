const express = require('express')
const router = express.Router()
const emailControllers = require('../controllers/email')

router.post('/send-email',emailControllers.sendEmail)
router.post('/bounced-email',emailControllers.addToBlackList)

module.exports = router;