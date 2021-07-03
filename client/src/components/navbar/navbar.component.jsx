import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../button';

import './navbar.styles.scss';

const Navbar = () => {
	return (
		<div className="navbar">
			<Link to="/home" className="navbar__logo-link">
				<img
					className="navbar__logo"
					src="https://www.puretaboo.com/m/dk5p8yumd20ck0c4/logo-h.svg"
					alt="Logo"
					title="clubx"
				/>
			</Link>
			<div className="navbar__links">
				<Button to="/join">Join Now</Button>
				<Button to="/login" variant="ghost">
					Sign In
				</Button>
			</div>
		</div>
	);
};

export default Navbar;
