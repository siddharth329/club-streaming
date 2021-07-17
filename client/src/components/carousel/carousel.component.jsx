import React from 'react';
import { useHistory } from 'react-router-dom';
import { Carousel as ReactCarousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Carousel = (props) => {
	const history = useHistory();
	const banners = props.banners;

	const onClickItem = (itemIndex) => {
		history.push(banners[itemIndex].redirect);
	};

	return (
		<ReactCarousel
			autoPlay
			infiniteLoop
			interval={4000}
			swipeable
			showThumbs={false}
			showStatus={false}
			onClickItem={onClickItem}
			className="mb-xl"
		>
			{banners.map((banner) => (
				<div key={banner.id} style={{ cursor: 'pointer' }}>
					<img
						src={`${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}uploads/${banner.data
							.path}`}
						alt="carousel banner"
					/>
				</div>
			))}
		</ReactCarousel>
	);
};

export default Carousel;
