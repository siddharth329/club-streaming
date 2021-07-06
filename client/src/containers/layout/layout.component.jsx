import React from 'react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

import './layout.styles.scss'

const Layout = ({ children }) => {
	return (
		<div className="layoutcontainer">
			<Navbar />
			<div className="navbar-height-spacer" />
			{children}
			<Footer />
		</div>
	);
};

export default Layout;
