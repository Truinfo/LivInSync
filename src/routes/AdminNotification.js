const express = require('express');
const router = express.Router();
const { getNotificationsBySociety, updateNotificationStatus } = require('../controllers/AdminNotification');

// Route to get notifications by society ID
router.get('/adminNotificationsBy/:societyId', getNotificationsBySociety);

// Route to update notification status by ID
router.put('/notifications/:id/', updateNotificationStatus);

module.exports = router;