import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import axios from 'axios';

import Player from '../../components/player';
import RecCard from '../../components/rec-card';
import EpisodeCard from '../../components/episode-card';
import Favorite from '../../components/favorite/favorite.component';
import ModelCard from '../../components/model-card';

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

		let episode, recommended, userLikedEpisode;
		if (data) {
			episode = data.episode;
			recommended = data.recommended;
			userLikedEpisode = data.userLikedEpisode || null;
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
							<Player episodeId={episode.id} image={episode.thumbnail.path} />

							<div className="episode__head">
								<div className="episode__description">
									<h1 className="episode__title">{episode.title}</h1>
									<div className="episode__misc">
										<span>ClubX Streaming</span>
										<span>
											{format(new Date(episode.publishedAt), 'dd-MM-yyyy')}
										</span>
										<span>
											<i className="fas fa-eye" />
											{episode.views}
										</span>
									</div>
								</div>

								<div className="episode__favorite">
									<Favorite
										episodeId={episode.id}
										liked={userLikedEpisode}
										favCount={episode.favCount}
									/>
								</div>
							</div>

							{episode.models && (
								<div className="episode__models">
									<h2>Featuring</h2>
									<div className="episode__models-grid">
										{episode.models.map((model) => (
											<ModelCard key={model.id} {...model} />
										))}
									</div>
								</div>
							)}

							<div className="episode__info">
								<h2>Description</h2>
								<div>{episode.info}</div>
							</div>

							{episode.tags && (
								<div className="episode__categories">
									<h2>Categories</h2>
									<div>
										{episode.tags.map((tag) => (
											<Link to={`/categories/${tag.id}`} key={tag.id}>
												{tag.name}
											</Link>
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
									<EpisodeCard
										key={episode.id}
										{...episode}
										tags={[]}
										variant="recommended"
									/>
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
