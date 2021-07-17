import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '../button';

import './navbar.styles.scss';

const Navbar = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);

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
						<Link to="/account" className="navbar__user">
							<img src="/uploads/user.png" alt="User icon" />
						</Link>
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
