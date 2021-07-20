import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { fetchEpisodeCatalog } from '../../store/episode-catalog/episode-catalog.actions';
import EpisodeCard from '../../components/episode-card';

import './episode-catalog.styles.scss';

const queryGenerator = (params) => {
	return {
		sortBy: params.get('sortBy') || 'latest',
		page: params.get('page') || 1
	};
};

const LoadingErrorContent = ({ loading, error, loadingData, errorData, children }) =>
	loading ? loadingData : error ? errorData : children;

const EpisodeCatalog = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const currentParam = params.get('sortBy') || 'latest';

	const episodeCatalog = useSelector((state) => state.episodeCatalog);
	const { loading, error, data } = episodeCatalog;

	const fetchData = () => dispatch(fetchEpisodeCatalog(queryGenerator(params)));
	useEffect(() => fetchData(), [ location ]);

	return (
		<LoadingErrorContent
			loading={loading}
			error={error}
			loadingData={<div />}
			errorData={<div />}
		>
			<div className="episodecatalog">

				<div className="episodecatalog__content">
					<ul className="episodecatalog__filter">
						<li className={`${currentParam === 'latest' && 'selected'}`}>
							<Link to="/videos?sortBy=latest">Latest</Link>
						</li>
						<li className={`${currentParam === 'favorite' && 'selected'}`}>
							<Link to="/videos?sortBy=favorite">Most Engaging</Link>
						</li>
						<li className={`${currentParam === 'views' && 'selected'}`}>
							<Link to="/videos?sortBy=views">Most Watched</Link>
						</li>
						<li className={`${currentParam === 'coming-soon' && 'selected'} span3`}>
							<Link>Coming Soon</Link>
						</li>
					</ul>

					{data && (
						<div className="episodecatalog__episodes">
							{data.episodes.map((episode) => (
								<EpisodeCard key={episode.id} {...episode} variant="catalog" />
							))}
							{data.episodes.map((episode) => (
								<EpisodeCard key={episode.id} {...episode} variant="catalog" />
							))}
							{data.episodes.map((episode) => (
								<EpisodeCard key={episode.id} {...episode} variant="catalog" />
							))}
							{data.episodes.map((episode) => (
								<EpisodeCard key={episode.id} {...episode} variant="catalog" />
							))}
						</div>
					)}
				</div>
			</div>
		</LoadingErrorContent>
		// null
	);
};

export default EpisodeCatalog;
