import EpisodeCatalogActionTypes from './episode-catalog.types';

export const episodeCatalogReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_START:
			return { loading: true };

		case EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_SUCCESS:
			return { loading: false, data: action.payload };

		case EpisodeCatalogActionTypes.FETCH_EPISODE_CATALOG_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
