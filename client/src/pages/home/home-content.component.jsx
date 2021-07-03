import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EpisodeCard from '../../components/episode-card';
import ModelCard from '../../components/model-card';

import './home.styles.scss';

const HomeContent = ({ title, redirect, type, data }) => {
	return (
		<div className="homecontent">
			<div className="homecontent__head">
				<h2 className="homecontent__title">
					CLUB X | &nbsp;<span>{title}</span>
				</h2>
				<Link className="homecontent__link" to={redirect}>
					View More
				</Link>
			</div>
			{type === 'EPISODE' && (
				<div className="homecontent__wrapper--episodes">
					{data.map((episode, index) => <EpisodeCard key={index} {...episode} />)}
				</div>
			)}
			{type === 'MODEL' && (
				<div className="homecontent__wrapper--models">
					{data.map((model, index) => <ModelCard key={index} {...model} />)}
				</div>
			)}
		</div>
	);
};

HomeContent.propTypes = {
	title: PropTypes.string.isRequired,
	redirect: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired
};

export default HomeContent;
