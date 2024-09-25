const Complaint = require('../models/Complaints');
const notifyModel = require('../models/Notifications');

// Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        const newComplaint = new Complaint(req.body);
        newComplaint.complaintId = Math.floor(100000 + Math.random() * 900000).toString();
        await newComplaint.save();
        if (newComplaint) {
            const notifyData = new notifyModel({
                Category: "Complaint",
                societyId: newComplaint.societyId,
                SenderName: newComplaint.complaintBy,
            })
            await notifyData.save()
        }
        res.status(201).json({ success: true, complaint: newComplaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all complaints by societyId
exports.getAllComplaintsBySocietyId = async (req, res) => {
    const { societyId } = req.params;
    try {
        const complaints = await Complaint.find({ societyId });

        res.status(201).json({ success: true, Complaints: complaints });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a complaint by societyId and complaintId
exports.getComplaintBySocietyId = async (req, res) => {
    const { societyId, complaintId } = req.params;
    try {
        const complaint = await Complaint.findOne({ societyId, complaintId });
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(201).json({ success: true, Complaints: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update a complaint by societyId and complaintId
exports.updateComplaint = async (req, res) => {
    const { societyId, complaintId } = req.params;
    try {
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { societyId, complaintId },
            req.body,
            { new: true }
        );
        if (!updatedComplaint) {
            return res.status(404).json({ success: true, message: 'Complaint not found' });
        }
        res.status(201).json({ success: true, Complaints: updatedComplaint });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete a complaint by societyId and complaintId
exports.deleteComplaint = async (req, res) => {
    const { societyId, complaintId } = req.params;
    try {
        const deletedComplaint = await Complaint.findOneAndDelete({ societyId, complaintId });
        if (!deletedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(201).json({ success: true, message: 'Complaint deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateComplaintStatus = async (req, res) => {
    const { societyId, complaintId } = req.params; // Extracting parameters from the request
    const { resolution } = req.body; // Assuming resolution is sent in the request body

    try {
        // Updating the complaint status in the database
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { societyId, complaintId }, // Filter for the specific complaint
            { resolution: "Resolved" }, // Update object
            { new: true, runValidators: true } // Options to return the updated document and run validators
        );

        // Check if the complaint was found and updated
        if (!updatedComplaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Sending a success response with the updated complaint
        res.status(200).json({ success: true, complaint: updatedComplaint });
    } catch (err) {
        // Handle any errors that occur during the update
        res.status(400).json({ success: false, message: err.message });
    }
};
