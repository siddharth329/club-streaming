import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LoadingErrorContent = ({ loading, error, loadingData, errorData, children }) =>
	loading ? loadingData : error ? errorData : children;

const Episode = () => {
	const params = useParams();
	const [ loading, setLoading ] = useState(true);
	const [ data, setData ] = useState(null);
	const [ error, setError ] = useState(null);

	const fetchEpisodeData = async () => {
		try {
			const { data } = await axios.get(`/api/episode/${params.id}`);
			setLoading(false);
			setData(data);
		} catch (error) {
			setLoading(false);
			setError(error);
		}
	};

	useEffect(() => {
		fetchEpisodeData();
	});

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
            
          </div>
          <div className="episode__recommended">

          </div>
				</div>
			)}
		</LoadingErrorContent>
	);
};

export default Episode;
