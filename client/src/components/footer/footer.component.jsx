import React from 'react';
import { Link } from 'react-router-dom';

import './footer.styles.scss';

const Footer = () => {
	return (
		<div className="footer">
			<div className="footer__wrapper">
				<div className="footer__content">
					<h3>What is ClubX Streaming?</h3>
					<p>
						Presented by Insane Tech, <strong>ClubX Streaming</strong> is a AAA grade
						porn streaming unlike any other. We take finest porn very seriously,
						exploring the deep corners of sex and desire in hardcore, taboo sex videos
						that you need to see to believe. Scenes are presented with gritty, film-like
						productions with a cinematic feel and feature today’s top pornstars in their
						most challenging roles.
					</p>
					<p>
						Our videos tackle forbidden subject matters like step-family fantasies,
						perverted doctors and sneaky voyeurs, where nobody is considered innocent
						and everyone is willing to test their limits.
					</p>
					<p>
						Pure Taboo features the most popular and up-and-coming performers in adult
						today, challenging themselves to bring acting and sexual performances in a
						way viewers have never seen before. Now available on the Adult Time
						platform.
					</p>
				</div>
				<div className="footer__content">
					<h3>Why Should I Join?</h3>
					<p>
						<strong>ClubX Streaming</strong> brings you a weekly dose of intense, story
						driven porn. You’ll find full length features like the AVN award winning
						scene The Ghost Rocket which stars Cherie DeVille and Michael Vegas in a
						controversial story you have to see to believe.
					</p>
					<p>
						Watch the amazing Angela White play doctor in Immersion Therapy, where her
						patient agrees to partake in double penetration therapy to cure her of her
						most extreme phobia. You’ll also find the Future Darkly series, which is a
						running, porn taboo series based on thrilling, sci fi themes.
					</p>
					<p>
						All videos are available to download and are in beautiful HD quality and
						comes with the entire Adult Time library of content, so join Pure Taboo
						today!
					</p>
				</div>
				<div className="footer__content">
					<h3>Your Subscription Includes</h3>
					<ul>
						<li>1 Release per Day</li>
						<li>Access to 1000+ videos</li>
						<li>Exclusive Porn Quality</li>
						<li>Over 150+ Models to choose from</li>
						<li>Personalized Member's Experience</li>
						<li>24/7 Customer Support</li>
						<li>Compatible with any device</li>
						<li>Now available in a fresh new design</li>
					</ul>
				</div>
				<div className="footer__content">
					<h3>ClubX Streaming Site Map</h3>
					<ul style={{ listStyle: 'none', marginLeft: 0 }}>
						<li>
							<Link to="/home">Home</Link>
						</li>
						<li>
							<Link to="/videos">Episodes</Link>
						</li>
						<li>
							<Link to="/models">Models</Link>
						</li>
						<li>
							<Link to="/login">Sign In</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer__copy">
				<p>Copyright &copy; 2021 Insane Technologies. All Rights reserved</p>
				<p>
					This website does not host any content. All content is served from third party
					website.
				</p>
			</div>
		</div>
	);
};

export default Footer;
