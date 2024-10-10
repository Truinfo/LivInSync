const marketPlaceModel = require("../models/MarketPlace");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');
const AdminNotification = require("../models/AdminNotification");
const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        const destinationPath = path.join(__dirname, '../Uploads/Advertisements')
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true })
        }
        cb(null, destinationPath)
    },
    filename: function (res, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

const upload = multer({ storage }).fields([
    { name: "pictures", maxCount: 5 }
]);
exports.addProduct = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'An error occurred while uploading files' });
            }
            try {
                const { societyId,
                    userId, title, description, price, category, type, contactNumber } = req.body;
                let pictures = [];

                if (req.files && req.files['pictures']) {
                    pictures = req.files['pictures'].map(image => ({
                        img: `/publicPictures/${image.filename}`,
                    }));
                }
                const newProduct = new marketPlaceModel({
                    societyId,
                    userId,
                    pictures,
                    title,
                    description,
                    price,
                    category,
                    type,
                    contactNumber
                });
                await newProduct.save();

                // Notification
                const notification = new AdminNotification({
                    societyId: societyId,
                    title: "Advertisement",
                    message: "New Post uploaded",
                    category: "Adds_notification",
                    userId: userId,
                });
                await notification.save();
                return res.status(201).json({ success: true, message: 'Successfully added', notification });
            } catch (error) {
                console.log(`Error: ${error}`);
                return res.status(401).json({ success: false, message: `Error: ${error.message}` });
            }
        })

    } catch (error) {
        res.status(500).json({ error: 'Error posting product' });
    }
};

exports.getSocietyProducts = async (req, res) => {
    try {
        const products = await marketPlaceModel.find({ societyId: req.params.societyId })
            .populate('userId') 
            .populate('societyId'); 
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await marketPlaceModel.findById(req.params.id)
            .populate('userId',)
            .populate('societyId',);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await marketPlaceModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Check if the logged-in user is the owner of the product
        if (product.owner.toString() !== req.user.id) return res.status(401).json({ error: 'Not authorized' });

        await product.remove();
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};