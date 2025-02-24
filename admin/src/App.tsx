
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/layout'
import Dashboard from './pages/dashboard'
import Navigation from './pages/navigation'
import Orders from './pages/orders/orders'
import Menu from './pages/menu'
import Promos from './pages/promos'
import Branches from './pages/branches'
import ManageAdmin from './pages/manageAdmin'
import UserSettings from './pages/userSettings'
import Pending from './pages/orders/pending'

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigation />}  >
        <Route index element={<Dashboard />} />
        <Route path="/orders" element={<Orders/>}  />
        <Route path="/orders/pending" element={<Pending />}  />
        <Route path="/menu" element={<Menu/>}  />
        <Route path="/promos" element={<Promos/>}  />
        <Route path="/branches" element={<Branches/>}  />
        <Route path="/admin" element={<ManageAdmin/>}  />
        <Route path="/usersettings" element={<UserSettings/>}  />
        

        {/* <Route path="/register" element={user? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login/>}  />
        <Route path="/create" element={user ? <Create /> : <Login/>}  />

        <Route path="/posts/:id" element={<Show />} />
        <Route path="/posts/update/:id" element={user ? <Update /> : <Login/>}  /> */}
      </Route>
      
    </Routes>
</BrowserRouter>
  )
}

export default App
