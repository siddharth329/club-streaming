import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Button from '../button';

import './navbar.styles.scss';

const Navbar = () => {
	const { isAuthenticated, info } = useSelector((state) => state.auth);

	const logout = async () => {
		try {
			await axios.get('/api/user/logout');
			window.location.reload();
		} catch (error) {
			alert('Something went wrong');
		}
	};

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
				{isAuthenticated() ? (
					<React.Fragment>
						<div onClick={() => logout()} style={{ cursor: 'pointer' }}>
							Hi, {info.name.split(' ')[0]}!
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Button to="/join">Join Now</Button>
						<Button to="/login" variant="ghost">
							Sign In
						</Button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

export default Navbar;
