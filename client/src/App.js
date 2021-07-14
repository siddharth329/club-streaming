import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ScrollToTop from './plugins/ScrollToTop';
// import ProtectedRoute from './plugins/ProtectedRoute';
import GuestRoutes from './plugins/GuestRoutes';
import Layout from './containers/layout';
import Episode from './pages/episode';
import Landing from './pages/landing';
import Login from './pages/login';
import Home from './pages/home';
import ForgotPassword from './pages/forgot-password';

import { userAuthVerify } from './store/auth/auth.actions';

const LoadingContent = ({ children, loading }) => (loading ? <div>Loading</div> : children);

const App = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state.auth);
	useEffect(() => dispatch(userAuthVerify()), [ dispatch ]);

	return (
		<LoadingContent loading={loading}>
			<Router>
				<Layout>
					<ScrollToTop />
					<Route path="/models/:id" />
					<Route path="/models" />
					<Route path="/videos/:id" component={Episode} />
					<Route path="/videos/" />
					<Route path="/home" component={Home} />
					<Route exact path="/" component={Landing} />

					<GuestRoutes path="/login" component={<Login />} />
					<GuestRoutes path="/forgot-password" component={<ForgotPassword />} />

					{/* <ProtectedRoute path="/error" component={<Login />} /> */}
				</Layout>
			</Router>
		</LoadingContent>
	);
};

export default App;
