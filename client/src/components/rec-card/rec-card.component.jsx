import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import './rec-card.styles.scss';

const RecCard = ({ id, title, thumbnail, models, publishedAt, favCount }) => {
	const redirectToEpisode = `/videos/${id}`;
	let imageSource = '/temp/card-image-1.jpg';

	return (
		<div className="reccard">
			<Link to={redirectToEpisode} className="reccard__thumbnail">
				<img src={imageSource} alt={title} />
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
