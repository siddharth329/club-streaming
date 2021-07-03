import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import './episode-card.styles.scss';

const EpisodeCard = ({ id, title, thumbnail, models, tags, favCount, publishedAt }) => {
	const redirectToEpisode = `/videos/${id}`;

	return (
		<div className="episodecard">
			<Link to={redirectToEpisode} className="episodecard__thumbnail">
				{/* <img src={thumbnail} alt={title} /> */}
				<img src="https://oshi.at/ukeMqi/pDMj.jpg" alt={title} />
				<div className="episodecard__tags">
					{tags.slice(0, 3).map((tag) => <span key={tag.id}>{tag.name}</span>)}
					{tags.length > 3 && <span>More ...</span>}
				</div>
			</Link>

			<div className="episodecard__details">
				<Link to={redirectToEpisode} className="episodecard__title">
					{title}
				</Link>
				<ul className="episodecard__models">
					{models.map((model, index) => (
						<React.Fragment key={index}>
							<Link to={`/models/${model.id}`}>{model.name}</Link>
							{models.length !== index + 1 && ','}
						</React.Fragment>
					))}
				</ul>
				<div className="episodecard__stats">
					<span>ClubXStream</span>
					<span>{format(new Date(publishedAt), 'dd-MM-yyyy')}</span>
					<span>
						<i className="fas fa-heart" /> {favCount}
					</span>
				</div>
			</div>
		</div>
	);
};

EpisodeCard.propTypes = {
	title: PropTypes.string.isRequired
};

export default EpisodeCard;