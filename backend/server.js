import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';


import product from '../backend/src/models/products.js';

import authMiddleware from './src/middleware/auth.middleware.js';
import { cloudinary, upload } from './src/config/cloud-config.js';


// console.log(process.env.CLOUD_API_KEY)

const app = express();
app.use(cors({
    origin: "https://tech-crt.netlify.app/",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


app.get("/", async (req, res) => {
    try {
        const Products = await product.find({});
        const token = req.cookies.accessToken;
        let userName = "";
        if (!token) {
            userName = "";
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userName = decoded.userName;
        }
        const response = {
            Products,
            userName
        }
        res.json(response);
    } catch (err) {
        console.log(err)
    }
});

app.get("/place-order", authMiddleware.verify, (req, res) => {
    res.status(201).send({ message: "order has been placed" });
});



app.post("/create", upload.single("image"), (req, res) => {
    const { name, price, description } = req.body;
    // console.log(req.file)
    // console.log(req.body.name);
    try {
        if (!req.file) {
            return res.status(500).json(`Error: No File`);
        }
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "tech-products",
            resource_type: 'image'
        },
            (error, result) => {
                if (error) {
                    console.log("Cloudinary upload error:", error);
                    return res.status(500).json({ error: "Cloudinary upload failed" });
                }
                res.status(200).json({
                    message: 'Upload successfull',
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        uploadStream.end(req.file.buffer);

    } catch (err) {
        res.status(500).json(`Error: ${err.message}`);
    }
})

app.get("/logout", authMiddleware.logout);

app.post("/signup", authMiddleware.signUp);

app.post("/login", authMiddleware.login);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is live at port: ${PORT}`);
});
