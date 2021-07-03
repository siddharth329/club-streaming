import HomeActionTypes from './home.types';

export const homeReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case HomeActionTypes.FETCH_HOME_DATA_START:
			return { loading: true };

		case HomeActionTypes.FETCH_HOME_DATA_SUCCESS:
			return { loading: false, ...action.payload };

		case HomeActionTypes.FETCH_HOME_DATA_FAIL: {
			return { loading: false, error: action.payload };
		}

		default:
			return state;
	}
};
