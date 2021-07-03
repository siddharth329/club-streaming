import React from 'react';
import { Link } from 'react-router-dom';

import './model-card.styles.scss';

const ModelCard = ({ id, name, thumbnail }) => {
	const redirectToModel = `/models/${id}`;
	return (
		<div className="modelcard">
			<Link to={redirectToModel} className="modelcard__thumbnail">
				{/* <img src={thumbnail} alt={name} /> */}
				<img
					src="https://media-public-ht.project1content.com/m=bIa8a0a4Rr_d/973/fe2/1cd/581/41a/a82/7ef/2c7/7c2/be4/b3/model/profile_001.webp"
					alt={name}
				/>
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
