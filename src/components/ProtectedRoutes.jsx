import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) =>{
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    return isLoggedIn === "true" ? children:<Navigate to="/403" replace/>
}

export default ProtectedRoute