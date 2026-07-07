import { Link } from "react-router-dom";

import { useState } from "react";
import { useData } from "../context/DataContext";


export default function Card({ product }) {
    // console.log("hello")

    // const { addToCart, btnStatus, setBtnStatus } = useData();
    const [btnStatus, setBtnStatus] = useState('idle');

    function addToCart(id,name,price,image) {
        const storageKey = "cartItems";
        const userCart = JSON.parse(localStorage.getItem(storageKey)) || [];

        setBtnStatus('packing');

        setTimeout(() => {
            setBtnStatus('added');
        }, 300);

        const existingCartItem = userCart.find((cart) => cart.productId == id);

        if (existingCartItem) {
            existingCartItem.qty += 1;
        } else {
            const newOrder = {
                productId: id,
                productName: name,
                price: price,
                productImgUrl: image,
                qty: 1
            }
            userCart.push(newOrder);
        }

        localStorage.setItem(storageKey, JSON.stringify(userCart));

    }
    return (
        <div className="card" >
            <img src={product.productImgUrl} />
            <div className="card-content">
                <h3 className="title">{product.productName}</h3>
                <p className="price">${product.price}</p>
            </div>
            <div className="card-actions">
                <Link to={`/products/${product._id}`} className='btn btn-secondary'>View Details</Link>
                {
                    btnStatus == 'idle' ? (
                        <button onClick={() => addToCart(product._id, product.productName, product.price, product.productImgUrl)} className='btn btn-primary'>Add to Cart</button>
                    ) : btnStatus == 'packing' ? (
                        <button className='btn btn-primary'>Packing...<i className="fa-solid fa-circle-notch fa-spin"></i></button>
                    ) : (
                        <button style={{ backgroundColor: '#198754' }} className='btn btn-primary'>&#10004; Added</button>
                    )
                }
            </div>
        </div>
    );
}