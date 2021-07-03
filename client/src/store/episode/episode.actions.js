import axios from 'axios';
import EpisodeActionTypes from './episode.types';

export const fetchEpisodes = (query) => async (dispatch, getState) => {
	dispatch({ type: EpisodeActionTypes.FETCH_EPISODES_START });

	try {
		const { data: episodes } = await axios.get('/api/episode', { params: query });
		dispatch({ type: EpisodeActionTypes.FETCH_EPISODES_SUCCESS, payload: episodes });
	} catch (error) {
		dispatch({ type: EpisodeActionTypes.FETCH_EPISODES_FAIL, payload: error });
	}
};
