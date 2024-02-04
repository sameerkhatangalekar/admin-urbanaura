import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAppSelector } from "./redux/redux-hooks"
import Login from "./pages/login"
import Layout from "./pages/layout"
import Dashboard from "./pages/dashboard"
import Users from "./pages/users"
import Orders from "./pages/orders"
import Products from "./pages/products"
import Order from "./pages/order"
import CreateProduct from "./pages/create-product"
import UpdateProduct from "./pages/update-product"



function App() {
  const user = useAppSelector(state => state.user.isLoggedIn)

  return (
    <>
      <Routes>
        <Route path='/login' element={user ? <Navigate replace to={"/"} /> : <Login />} />

        <Route path='/' element={user ? <Layout /> : <Navigate replace to={"/login"} />} >
          <Route path='/' index element={<Dashboard />} />
          <Route path='/inventory' element={<Products />} />
          <Route path='/update/product' element={<UpdateProduct />} />
          <Route path='/create' element={<CreateProduct />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<Order />} />
          <Route path='/users' element={<Users />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
