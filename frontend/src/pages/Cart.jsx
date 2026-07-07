import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useData } from '../context/DataContext';
export default function Cart() {

    const navigate = useNavigate();
    const storageKey = "cartItems";
    const userCart = JSON.parse(localStorage.getItem(storageKey)) || [];

    const [orderCount, setOrderCount] = useState(false);
    const [orderRemoved, setOrderRemoved] = useState(false);
    const { setMode, notifiMsg, setNotfiMsg, setNotifiStatus, notifiStatus,setUser } = useData();

    let totalPrice = 0;
    function calculateTotalPrice() {
        userCart.map((cart) => {
            totalPrice += (cart.price) * (cart.qty);
            totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
        });
    }
    calculateTotalPrice();


    function decCount(id) {
        for (let i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == id) {
                if (userCart[i].qty == 1) {
                    userCart[i].qty = 0;
                } else if (userCart[i].qty > 1) {
                    userCart[i].qty -= 1;
                } else if (userCart[i].qty == 0) {
                    break;
                }
                setOrderCount(!orderCount);
                localStorage.setItem(storageKey, JSON.stringify(userCart));
            }
        }
        calculateTotalPrice();
    }

    function incCount(id) {
        for (let i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == id) {
                if (userCart[i].qty >= 0) {
                    userCart[i].qty += 1;
                }
                setOrderCount(!orderCount);
                localStorage.setItem(storageKey, JSON.stringify(userCart));
            }
        }
        calculateTotalPrice();
    }

    function removeOrder(id) {
        for (let i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == id) {
                userCart.splice(i, 1);
                setOrderRemoved(!orderRemoved);
                localStorage.setItem(storageKey, JSON.stringify(userCart));
            }
        }
        calculateTotalPrice();
    }

    async function placeOrder() {
        try {
            const res = await fetch("http://localhost:8080/place-order", {
                credentials: "include"
            });
            const result = await res.json();
            // setNotifiStatus("success")
            if (result.message == "Token not found!") {
                setMode("Login");
                setNotfiMsg("You're not logged in");
                setNotifiStatus("error");
                navigate("/auth");
            } else if (result.message == "order has been placed") {
                setNotfiMsg("Order has been successfully placed :)");
                setNotifiStatus("success");
            }
        } catch (err) {
            console.log(err)
        }
    }

    // setNotifiStatus("success")
    function closeNotification() {
        setNotifiStatus("close");
    }

    useEffect(() => {
        const loadData = async () => {
            const res = await fetch("http://localhost:8080/", {
                credentials: "include"
            });
            const result = await res.json();
            setUser(result.userName);
        }
        loadData();
    }, []);


    return (
        <>
            {
                notifiStatus == "error" ? (
                    <div className="notification">
                        <p>{notifiMsg}</p>
                        <button onClick={closeNotification}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                ) : notifiStatus == "success" ? (
                    <div className="notification notification-color">
                        <p>{notifiMsg}</p>
                        <button onClick={closeNotification}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                ) : null
            }
            <div className="cart-parent">


                <div className="cart-container">
                    <h2>Checkout</h2>
                    <div className="cart-wrapper">
                        <div className="left">
                            <h3>Order Summary</h3>
                            <div className="order-list">
                                {
                                    userCart.length > 0 ? (
                                        userCart.map((cart) => {
                                            return (
                                                <div key={cart.productId} className="each-order">
                                                    <div className="cart-card">
                                                        <img src={cart.productImgUrl} alt={cart.productName} />
                                                        <div>
                                                            <h4>{cart.productName}</h4>
                                                            <h5>${cart.price} each</h5>
                                                        </div>
                                                    </div>
                                                    <div className="card-info">
                                                        <div className="cart-plus-minus">
                                                            <button onClick={() => decCount(cart.productId)}><i className="fa-solid fa-minus"></i></button>
                                                            <p>{cart.qty}</p>
                                                            <button onClick={() => incCount(cart.productId)}><i className="fa-solid fa-plus"></i></button>
                                                        </div>
                                                        <h4>${Math.round(((cart.price * cart.qty) + Number.EPSILON) * 100) / 100}</h4>
                                                        <button onClick={() => removeOrder(cart.productId)} className="btn btn-secondary">Remove</button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                                            <h2>You haven't ordered anything yet!</h2>
                                            <Link to='/' className='btn btn-primary btn-lg'>Start Shopping Now</Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        {
                            userCart.length > 0 ? (
                                <div className="right">
                                    <h3>Total</h3>
                                    <div className="price-wrapper">
                                        <div>
                                            <p className="total">Subtotal:</p>
                                            <h4>${totalPrice}</h4>
                                        </div>
                                        <div>
                                            <p className="total">Total</p>
                                            <h2>${totalPrice}</h2>
                                        </div>
                                        <hr />
                                        <button onClick={placeOrder} className="btn btn-primary btn-lg">Place Order</button>
                                    </div>
                                </div>
                            ) : null
                        }

                    </div>
                </div>
            </div>
        </>
    )
}