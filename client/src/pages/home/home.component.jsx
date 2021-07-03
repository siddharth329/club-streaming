import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Carousel from '../../components/carousel';
import HomeContent from './home-content.component';
import { fetchHomeData } from '../../store/home/home.actions';

const LoadingErrorContent = ({ loading, error, loadingData, errorData, children }) =>
	loading ? loadingData : error ? errorData : children;

const Home = () => {
	const dispatch = useDispatch();

	useEffect(() => dispatch(fetchHomeData()), [ dispatch ]);

	const home = useSelector((state) => state.home);
	const { loading, error, banners, homeContent } = home;

	return (
		<LoadingErrorContent
			loading={loading}
			error={error}
			loadingData={<div>Loading</div>}
			errorData={<div>Error</div>}
		>
			{banners && <Carousel banners={banners} />}
			{homeContent &&
				homeContent.map((content, index) => (
					<HomeContent
						key={index}
						title={content.title}
						type={content.type}
						redirect={content.redirect}
						data={content.data}
					/>
				))}
		</LoadingErrorContent>
	);
};

export default Home;
