import React from 'react';

import EpisodeCard from '../../components/episode-card';
import './episode-generator.styles.scss';

const EpisodeGenerator = ({ episodes }) => {
	return (
		<div className="episodegenerator">
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
			{episodes.map((episode) => (
				<EpisodeCard key={episode.id} {...episode} variant="catalog" />
			))}
		</div>
	);
};

export default EpisodeGenerator;
