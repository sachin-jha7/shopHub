import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"]
    },
    productDescription: {
        type: String,
        required: [true, "Product description is required"]
    },
    price: {
        type: Number,
        required: true
    },
    productImgUrl: {
        type: String,
        required: true
    }
});

const product = mongoose.model("product", productSchema);

export default product;