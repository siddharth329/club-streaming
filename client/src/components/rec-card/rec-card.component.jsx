import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import './rec-card.styles.scss';

const RecCard = ({ id, title, thumbnail, models, publishedAt, favCount }) => {
	const redirectToEpisode = `/videos/${id}`;
	const finalThumbnail = `${process.env
		.REACT_APP_IMAGEKIT_URL_ENDPOINT}uploads/${thumbnail.path}`;

	return (
		<div className="reccard">
			<Link to={redirectToEpisode} className="reccard__thumbnail">
				<img src={finalThumbnail} alt={title} />
			</Link>
			<div className="reccard__details">
				<Link to={redirectToEpisode} className="reccard__title">
					{title}
				</Link>
				<ul className="reccard__models">
					{models.map((model, index) => (
						<React.Fragment key={index}>
							<Link to={`/models/${model.id}`}>{model.name}</Link>
							{models.length !== index + 1 && ','}
						</React.Fragment>
					))}
				</ul>
				<div className="reccard__stats">
					<span>ClubX</span>
					<span>{format(new Date(publishedAt), 'dd-MM-yyyy')}</span>
					<span>
						<i className="fas fa-heart" /> {favCount}
					</span>
				</div>
			</div>
		</div>
	);
};

export default RecCard;
