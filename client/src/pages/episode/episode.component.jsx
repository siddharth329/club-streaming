import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import RecCard from '../../components/rec-card';
import EpisodeCard from '../../components/episode-card';

import './episode.styles.scss';

const LoadingErrorContent = ({ loading, error, loadingData, errorData, children }) =>
	loading ? loadingData : error ? errorData : children;

const Episode = () => {
	const params = useParams();
	const [ loading, setLoading ] = useState(true);
	const [ data, setData ] = useState(null);
	const [ error, setError ] = useState(null);

	let imageSource = '/temp/card-image-1.jpg';

	let episode, recommended;
	if (data) {
		episode = data.episode;
		recommended = data.recommended;
	}

	const fetchEpisodeData = async () => {
		try {
			const { data } = await axios.get(`/api/episode/${params.id}?recommended=true`);
			setLoading(false);
			setData(data);
		} catch (error) {
			setLoading(false);
			setError(error);
		}
	};

	useEffect(() => {
		fetchEpisodeData();
		//eslint-disable-next-line
	}, []);

	return (
		<LoadingErrorContent
			loading={loading}
			error={error}
			loadingData={<div>Loading...</div>}
			errorData={<div>{error}</div>}
		>
			{data && (
				<div className="episode">
					<div className="episode__wrapper">
						<div className="episode__image-overlay">
							<i class="fal fa-play-circle" />
							<img src={imageSource} alt={episode.title} />
						</div>
						<h1 className="episode__title">{episode.title}</h1>

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

					{/* RECOMMENDED VIDEOS LOGIC */}
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
};

export default Episode;
