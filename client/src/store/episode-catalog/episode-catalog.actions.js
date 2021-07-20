import axios from 'axios';
import EpisodeCatalogActionTypes from './episode-catalog.types';

export const fetchEpisodeCatalog = (queryParams) => async (dispatch, getState) => {
	dispatch({ type: EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_START });

	try {
		const { data } = await axios.get('/api/episode', { params: queryParams });

		dispatch({ type: EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_FAIL });
	}
};
