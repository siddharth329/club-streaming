import React from 'react';
import { Link } from 'react-router-dom';

import './model-card.styles.scss';

const ModelCard = ({ id, name, thumbnail }) => {
	const redirectToModel = `/models/${id}`;
	const finalThumbnail = `${process.env
		.REACT_APP_IMAGEKIT_URL_ENDPOINT}uploads/${thumbnail.path}`;

	return (
		<div className="modelcard">
			<Link to={redirectToModel} className="modelcard__thumbnail">
				<img src={finalThumbnail} alt={name} />
			</Link>
			<div className="modelcard__details">
				<Link to={redirectToModel} className="modelcard__title">
					{name}
				</Link>
			</div>
		</div>
	);
};

export default ModelCard;
