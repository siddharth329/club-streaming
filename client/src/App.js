import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './containers/layout';

import Episode from './pages/episode';
import Landing from './pages/landing';
import Home from './pages/home';

class App extends React.Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<Router>
				<Layout>
					<Route path="/models/:id" />
					<Route path="/models" />
					<Route path="/videos/:id" component={Episode} />
					<Route path="/videos/" />
					<Route path="/home" component={Home} />
					<Route exact path="/" component={Landing} />
				</Layout>
			</Router>
		);
	}
}

export default App;
