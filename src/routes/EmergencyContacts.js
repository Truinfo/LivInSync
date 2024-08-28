const express = require("express");
const router = express.Router();
const {
  createEmergencyContact,
  getAllEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContactBySocietyId,
} = require("../controllers/EmergencyContacts");

// POST /emergency-contacts/createEmergencyContact - Create a new emergency contact
router.post("/createEmergencyContact", createEmergencyContact);

// GET /emergency-contacts/getAllEmergencyContacts - Get all emergency contacts
router.get("/getAllEmergencyContacts", getAllEmergencyContacts);
router.get("/getEmergencyContactBySocietyId/:societyid", getEmergencyContactBySocietyId);

// PUT /emergency-contacts/updateEmergencyContact/:id - Update a specific emergency contact by ID
router.put("/updateEmergencyContact/:id", updateEmergencyContact);

// DELETE /emergency-contacts/deleteEmergencyContact/:id - Delete a specific emergency contact by ID
router.delete("/deleteEmergencyContact/:id", deleteEmergencyContact);

module.exports = router;