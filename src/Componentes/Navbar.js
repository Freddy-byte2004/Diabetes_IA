import React from "react";
import '../css/Navbar.css';
import Logo from '../Logo.png';
import { Link } from 'react-router-dom';
import { AiFillHome, AiFillClockCircle, AiFillProfile, AiFillCloseCircle, AiOutlineTeam } from "react-icons/ai";
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
              <div className="Inicio"><Link to='/dashboard'> <div className="icono-navbar"><AiFillHome /></div><div className="texto-navbar">Inicio</div></Link></div>
              <div className="Historial"><Link to='/historial'><div className="icono-navbar"><AiFillClockCircle/></div><div className="texto-navbar">Historial</div></Link></div>
              <div className="Perfil"><Link to='/perfil'><div className="icono-navbar"><AiFillProfile/></div><div className="texto-navbar">Perfil</div></Link></div>
                              <div className="Pacientes"><Link to='/pacientes'><div className="icono-navbar"><AiOutlineTeam/></div><div className="texto-navbar">Pacientes</div></Link></div>
              <div className="CerrarSesion" onClick={cerrarSesion}><Link to='/login'><div className="icono-navbar"><AiFillCloseCircle/></div><div className="texto-navbar">Cerrar Sesión</div></Link></div>
            </div>
        </nav>
    )
}
export {Navbar};