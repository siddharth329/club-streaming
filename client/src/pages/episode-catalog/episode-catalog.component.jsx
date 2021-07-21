import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { fetchEpisodeCatalog } from '../../store/episode-catalog/episode-catalog.actions';
import EpisodeGenerator from '../../containers/episode-generator';
import Paginator from '../../components/paginator';

import './episode-catalog.styles.scss';

const queryGenerator = (params) => {
	return {
		sortBy: params.get('sortBy') || 'latest',
		page: params.get('page') || 1
	};
};

const headingGenerator = (query) => {
	switch (query) {
		case 'latest':
			return 'Latest Episodes';
		case 'views':
			return 'Most Viewed Episodes';
		case 'favorite':
			return 'Most Viewed Episodes';
		case 'comming-soon':
			return 'Upcoming Episodes';

		default:
			break;
	}
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
				<h2>{headingGenerator(currentParam)}</h2>
				{data && (
					<div className="episodecatalog__numresults">{data.results} RESULTS FOUND</div>
				)}

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
							<Link to="/videos?sortBy=coming-soon">Coming Soon</Link>
						</li>
					</ul>

					{data && (
						<React.Fragment>
							<EpisodeGenerator episodes={data.episodes} />
							<Paginator
								currentPage={data.currentPage}
								totalPages={data.totalPages}
							/>
						</React.Fragment>
					)}
				</div>
			</div>
		</LoadingErrorContent>
		// null
	);
};

export default EpisodeCatalog;
