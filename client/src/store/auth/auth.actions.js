import axios from 'axios';
import AuthActionTypes from './auth.types';

export const userAuthVerify = () => async (dispatch, getState) => {
	dispatch({ type: AuthActionTypes.USER_AUTH_VERIFICATION_START });

	try {
		const response = await axios.get('/api/user/info');
		dispatch({
			type: AuthActionTypes.USER_AUTH_VERIFICATION_SUCCESS,
			payload: response.data
		});

		//
	} catch (error) {
		dispatch({
			type: AuthActionTypes.USER_AUTH_VERIFICATION_FAIL,
			payload: error.response ? error.response.data : error.message
		});
	}
};
