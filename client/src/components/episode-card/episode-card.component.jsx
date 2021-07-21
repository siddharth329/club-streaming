import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import './episode-card.styles.scss';

const calculatedDuration = (duration) => {
	if (duration > 3600)
		return `${Math.floor(duration / 3600)}:${Math.floor((duration % 3600) / 60)}:${duration %
			60}`;
	if (duration > 60) return `00:${Math.floor(duration / 60)}:${duration % 60}`;
	return `00:00:${duration}`;
};

const LinkFromVariant = ({ variant, children, className, link }) =>
	variant === 'recommended' ? (
		<a className={className} href={link}>
			{children}
		</a>
	) : (
		<Link to={link} className={className}>
			{children}
		</Link>
	);

const EpisodeCard = ({
	id,
	title,
	thumbnail,
	models,
	favCount,
	publishedAt,
	duration,
	variant
}) => {
	const redirectToEpisode = `/videos/${id}`;
	const finalThumbnail = `${process.env
		.REACT_APP_IMAGEKIT_URL_ENDPOINT}uploads/${thumbnail.path}`;

	return (
		<div className="episodecard">
			<LinkFromVariant
				variant={variant}
				link={redirectToEpisode}
				className="episodecard__thumbnail"
			>
				<img src={finalThumbnail} alt={title} />

				<div className="episodecard__tags">
					<span>{calculatedDuration(duration)}</span>
				</div>
			</LinkFromVariant>

			<div className="episodecard__details">
				<LinkFromVariant
					link={redirectToEpisode}
					className="episodecard__title"
					variant={variant}
				>
					{title}
				</LinkFromVariant>

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
