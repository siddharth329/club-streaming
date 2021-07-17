import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import axios from 'axios';

import Player from '../../components/player';
import RecCard from '../../components/rec-card';
import EpisodeCard from '../../components/episode-card';

import './episode.styles.scss';

const LoadingErrorContent = ({ loading, error, loadingData, errorData, children }) =>
	loading ? loadingData : error ? errorData : children;

class Episode extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loading: true, data: null, error: null };
	}

	componentDidMount() {
		this.fetchEpisodeData();
	}

	fetchEpisodeData = async () => {
		const episodeId = this.props.match.params.id;
		try {
			const { data: displayData } = await axios.get(
				`/api/episode/${episodeId}?recommended=true`
			);

			if (this.props.auth.isAuthenticated()) {
				const { data: { userLikedEpisode } } = await axios.get(
					`/api/favorite/info/${episodeId}`
				);

				return this.setState({
					loading: false,
					data: { ...displayData, userLikedEpisode }
				});
			}

			return this.setState({ loading: false, data: { ...displayData } });
		} catch (error) {
			this.setState({ loading: false, error: error });
		}
	};

	render() {
		const { data, loading, error } = this.state;

		let episode, recommended;
		if (data) {
			episode = data.episode;
			recommended = data.recommended;
		}

		return (
			<LoadingErrorContent
				loading={loading}
				error={error}
				loadingData={<div>Loading...</div>}
				errorData={<div>{error}</div>}
			>
				{episode && (
					<div className="episode">
						<div className="episode__wrapper">
							<Player episodeId={episode.id} />

							<div className="episode__head">
								<div className="episode__description">
									<h1 className="episode__title">{episode.title}</h1>
									<div>
										<span>ClubXStream</span>
										<span>
											{format(new Date(episode.publishedAt), 'dd-MM-yyyy')}
										</span>
										<span>
											<i className="fas fa-eye" />
											{episode.views}
										</span>
									</div>
								</div>

								<div className="episode__favorite" />
							</div>

							<p>{episode.info}</p>

							{episode.models && (
								<div className="episode__models">
									<h2>Cast</h2>
									<div>
										{episode.models.map((model) => (
											<Link
												key={model.id}
												to={`/models/${model.id}`}
												className="episode__model"
											>
												<img src={model.thumbnail} alt={model.name} />
												<span>{model.name}</span>
											</Link>
										))}
									</div>
								</div>
							)}

							{episode.tags && (
								<div className="episode__categories">
									<h2>Categories</h2>
									<div>
										{episode.tags.map((tag) => (
											<Link key={tag.id}>{tag.name}</Link>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="episode__recommended">
							<h2>
								Club X | <span>Recommended Videos</span>
							</h2>
							<div className="episode__recommended--small">
								{recommended.map((episode) => (
									<RecCard key={episode.id} {...episode} />
								))}
							</div>
							<div className="episode__recommended--large">
								{recommended.map((episode) => (
									<EpisodeCard key={episode.id} {...episode} tags={[]} />
								))}
							</div>
						</div>
					</div>
				)}
			</LoadingErrorContent>
		);
	}
}

const mapStateToProps = (state) => {
	const { auth } = state;
	return { auth };
};

export default connect(mapStateToProps)(Episode);
