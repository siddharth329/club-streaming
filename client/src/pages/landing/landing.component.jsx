import React from 'react';
import { Link } from 'react-router-dom';
import './landing.styles.scss';

const Landing = () => {
	return (
		<React.Fragment>
			<header className="landing__header">
				<div className="landing__header-wrapper">
					<h2>Some Porn Is Worth Watching</h2>
					<h3>The Most Award-Winning Taboo Studio In Adult Entertainment</h3>
				</div>
				<Link to="/join" className="landing__header-cta">
					Start Watching
				</Link>
			</header>
			{/* <Link to="/join" className="landing__promo-video">
				<video src={videoSrc} autoPlay muted playsInline loop />
			</Link> */}
		</React.Fragment>
	);
};

export default Landing;
