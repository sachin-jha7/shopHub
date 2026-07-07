
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AuthForm from './pages/Auth'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import DataProvider from './context/DataContext'


function App() {

  return (
    <>
      <DataProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/products/:id' element={<ProductDetails />}></Route>
            <Route path='/auth' element={<AuthForm />}></Route>
            <Route path='/cart' element={<Cart />}></Route>
            <Route path='/admin' element={<Admin />}></Route>
          </Routes>
        </div>

      </DataProvider>
    </>
  )
}

export default App
