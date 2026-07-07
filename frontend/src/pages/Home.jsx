// import img from '../assets/mutton rogan josh img.jpg'
import Card from '../components/Card';
import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
export default function Home() {

    
    const { data, setData, setUser } = useData();
    const [loadingData, setLoadingData] = useState(true);

    
    // console.log(data)

    useEffect(() => {
        const loadData = async () => {
            const res = await fetch("https://shophub-backend-hw2g.onrender.com/", {
                credentials: "include"
            });
            const result = await res.json();
            // console.log(result.userName)
            setUser(result.userName);
            setData(result.Products);
            setLoadingData(false);
        }
        loadData();
    }, []);

    return (

        loadingData ? (
            <h1>Loading Data...</h1>
        ) : (
            <div className="home-page">
                <div className="page">
                    <div className="page-header">
                        <h1>Welcome to ShopHub</h1>
                        <p>Discover amazing products at great prices.</p>
                    </div>
                    <div className="product-container">
                        <h2>Our Products</h2>
                        <div className="card-container">

                            {data.map((product) => {
                                return <Card product={product} key={product._id} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}
