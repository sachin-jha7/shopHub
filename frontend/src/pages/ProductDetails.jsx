import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function ProductDetails() {
    const { data, setData, setUser } = useData();
    const { id } = useParams();
    const [dataLoading, setDataLoading] = useState(true);
    const [btnStatus, setBtnStatus] = useState('idle');


    useEffect(() => {
        const loadData = async () => {
            const res = await fetch("http://localhost:8080/", {
                credentials: "include"
            });
            const result = await res.json();
            setUser(result.userName);
            setData(result.Products);
            setDataLoading(false);
        }
        loadData();
    }, []);


    const product = data.find(item => item._id === id);

    function addToCart(id, name, price, image) {
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

        dataLoading ? (
            <h1>Loading data...</h1>
        ) : (
            <div className="product-details-box">
                <div className="product-details-wrapper">
                    <div className="product-img">
                        <img src={product.productImgUrl} />
                    </div>
                    <div className="product-details">
                        <div className="product-header">
                            <h1>{product.productName}</h1>
                            <h2>${product.price}</h2>
                        </div>
                        <div className="product-description">
                            <p>{product.productDescription}</p>
                        </div>
                        
                        {
                            btnStatus == 'idle' ? (
                                <button onClick={() => addToCart(product._id, product.productName, product.price, product.productImgUrl)} className='btn btn-primary btn-lg'>Add to Cart</button>
                            ) : btnStatus == 'packing' ? (
                                <button className='btn btn-primary btn-lg'>Packing...<i className="fa-solid fa-circle-notch fa-spin"></i></button>
                            ) : (
                                <button style={{ backgroundColor: '#198754' }} className='btn btn-primary btn-lg'>&#10004; Added</button>
                            )
                        }
                    </div>
                </div>
            </div>
        )

    )
}