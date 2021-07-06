import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
						<div className="episode__video" />
					</div>
					<div className="episode__recommended">
						<h2>
							Club X | <span>Recommended Videos</span>
						</h2>
						<div className="episode__recommended--small">
							{recommended.map((episode) => (
								<RecCard key={episode.id} {...episode} />
							))}
							{recommended.map((episode, index) => (
								<RecCard key={index} {...episode} />
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
