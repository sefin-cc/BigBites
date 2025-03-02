
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/layout'
import Dashboard from './pages/dashboard'
import Navigation from './pages/navigation'
import Orders from './pages/orders/orders'
import Menu from './pages/menu/menu'
import Promos from './pages/promos/promos'
import Branches from './pages/branches/branches'
import ManageAdmin from './pages/admin/manageAdmin'
import UserSettings from './pages/userSettings/userSettings'
import Pending from './pages/orders/pending'
import Login from './pages/auth/login'

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
      </Route>
      <Route path="/login" element={<Login/>}  />
    </Routes>
</BrowserRouter>
  )
}

export default App
