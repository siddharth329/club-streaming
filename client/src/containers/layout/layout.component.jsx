import React from 'react';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const Layout = ({ children }) => {
	return (
		<div>
			<Navbar />
			<div className="navbar-height-spacer" />
			{children}
			<Footer />
		</div>
	);
};

export default Layout;
