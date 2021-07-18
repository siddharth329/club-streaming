import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as FavoriteSVG } from './favorite.svg';

import './favorite.styles.scss';

const Favorite = ({ episodeId, liked, favCount }) => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	const [ count, setCount ] = useState(favCount);
	const [ episodeLiked, setEpisodeLiked ] = useState(liked);

	const onChange = (e) => {
		if (isAuthenticated()) {
			if (episodeLiked) dislikeEpisode();
			else likeEpisode();

			setCount(episodeLiked ? count - 1 : count + 1);
			setEpisodeLiked(!episodeLiked);
		}
	};

	const likeEpisode = async () => trytry(axios.get(`/api/favorite/like/${episodeId}`));
	const dislikeEpisode = async () => trytry(axios.get(`/api/favorite/dislike/${episodeId}`));
	const trytry = async (expression) => {
		try {
			await expression;
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<React.Fragment>
			<div id="main-content">
				<div>
					<input
						type="checkbox"
						id="checkbox"
						onChange={onChange}
						checked={!isAuthenticated() ? true : episodeLiked}
						disabled={!isAuthenticated()}
					/>
					<label for="checkbox">
						<FavoriteSVG />
					</label>
				</div>
			</div>
			<div>{count}</div>
		</React.Fragment>
	);
};

export default Favorite;
