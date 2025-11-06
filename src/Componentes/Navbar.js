import React from "react";
import '../css/Navbar.css';
import Logo from '../Logo.jpeg';
import { Link } from 'react-router-dom';
import { AiFillHome, AiFillPlusSquare, AiFillClockCircle, AiFillProfile, AiFillCloseCircle } from "react-icons/ai";
function cerrarSesion(){
    localStorage.removeItem('token');
}
function Navbar() {
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={Logo} alt="Logo" className="logo-navbar" />
            </div>
            <div className="navbar-content">
              <div className="Inicio"><a href='#'> <div className="icono-navbar"><AiFillHome /></div><div className="texto-navbar">Inicio</div></a></div>
              <div className="Historial"><Link to='#'><div className="icono-navbar"><AiFillClockCircle/></div><div className="texto-navbar">Historial</div></Link></div>
              <div className="Perfil"><Link to='/perfil'><div className="icono-navbar"><AiFillProfile/></div><div className="texto-navbar">Perfil</div></Link></div>
              <div className="CerrarSesion" onClick={cerrarSesion}><Link to='https://diabetes-ia-1.onrender.com/'><div className="icono-navbar"><AiFillCloseCircle/></div><div className="texto-navbar">Cerrar Sesión</div></Link></div>
            </div>
        </nav>
    )
}
export {Navbar};