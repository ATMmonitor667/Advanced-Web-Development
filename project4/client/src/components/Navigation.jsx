import React from 'react'
import { NavLink } from 'react-router-dom'
import '../App.css'

const Navigation = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <NavLink to="/" className="nav-logo">
                    Bolt Bucket
                </NavLink>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `nav-link${isActive ? ' active' : ''}`
                            }
                        >
                            Customize
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/customcars"
                            className={({ isActive }) =>
                                `nav-link${isActive ? ' active' : ''}`
                            }
                        >
                            Garage
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navigation
