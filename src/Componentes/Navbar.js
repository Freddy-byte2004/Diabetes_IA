import React from "react";
import '../css/Navbar.css';
import Logo from '../Logo.jpeg';
import { AiFillHome, AiFillPlusSquare, AiFillClockCircle, AiFillProfile, AiFillCloseCircle } from "react-icons/ai";
function Navbar() {
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={Logo} alt="Logo" className="logo-navbar" />
            </div>
            <div className="navbar-content">
              <div className="Inicio"><a href='#'> <div className="icono-navbar"><AiFillHome /></div><div className="texto-navbar">Inicio</div></a></div>
              <div className="NuevoAnalisis"><a href='#'><div className="icono-navbar"><AiFillPlusSquare/></div><div className="texto-navbar">Nuevo Análisis</div></a></div>
              <div className="Historial"><a href='#'><div className="icono-navbar"><AiFillClockCircle/></div><div className="texto-navbar">Historial</div></a></div>
              <div className="Perfil"><a href='#'><div className="icono-navbar"><AiFillProfile/></div><div className="texto-navbar">Perfil</div></a></div>
              <div className="CerrarSesion"><a href='#'><div className="icono-navbar"><AiFillCloseCircle/></div><div className="texto-navbar">Cerrar Sesión</div></a></div>
            </div>
        </nav>
    )
}
export {Navbar};