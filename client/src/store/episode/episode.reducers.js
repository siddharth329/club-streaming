import EpisodeActionTypes from './episode.types';

export const episodeReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case EpisodeActionTypes.FETCH_EPISODES_START:
			return { loading: true };

		case EpisodeActionTypes.FETCH_EPISODES_SUCCESS:
			return { loading: false, data: action.payload };

		case EpisodeActionTypes.FETCH_EPISODES_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
