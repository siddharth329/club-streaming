import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoutes = ({ exact, path, component }) => {
	const { isAuthenticated } = useSelector((state) => state.auth);

	return (
		<Route
			exact={exact}
			path={path}
			render={(props) =>
				!isAuthenticated() ? (
					component
				) : (
					<Redirect to={{ pathname: '/home', state: { from: props.location } }} />
				)}
		/>
	);
};

export default GuestRoutes;
