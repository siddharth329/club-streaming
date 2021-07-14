import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ScrollToTop from './plugins/ScrollToTop';
import Layout from './containers/layout';

import Episode from './pages/episode';
import Landing from './pages/landing';
import Login from './pages/login';
import Home from './pages/home';
import ForgotPassword from './pages/forgot-password';

class App extends React.Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<Router>
				<Layout>
					<ScrollToTop />
					<Route path="/models/:id" />
					<Route path="/models" />
					<Route path="/videos/:id" component={Episode} />
					<Route path="/videos/" />
					<Route path="/home" component={Home} />
					<Route path="/forgot-password" component={ForgotPassword} />
					<Route path="/login" component={Login} />
					<Route exact path="/" component={Landing} />
				</Layout>
			</Router>
		);
	}
}

export default App;
