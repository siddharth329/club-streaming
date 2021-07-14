import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ exact, path, component }) => {
	const { isAuthenticated } = useSelector((state) => state.auth);

	return (
		<Route
			exact={exact}
			path={path}
			render={(props) =>
				isAuthenticated() ? (
					component
				) : (
					<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
				)}
		/>
	);
};

export default ProtectedRoute;
