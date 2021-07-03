import axios from 'axios';
import HomeActionTypes from './home.types';

export const fetchHomeData = () => async (dispatch, getState) => {
	dispatch({ type: HomeActionTypes.FETCH_HOME_DATA_START });

	try {
		const { data: homeContent } = await axios.get('/api/home');
		const { data: banners } = await axios.get('/api/banner/HOME_TOP_BANNER');

		dispatch({
			type: HomeActionTypes.FETCH_HOME_DATA_SUCCESS,
			payload: {
				homeContent,
				banners
			}
		});
	} catch (error) {
		dispatch({
			type: HomeActionTypes.FETCH_HOME_DATA_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
		});
	}
};
