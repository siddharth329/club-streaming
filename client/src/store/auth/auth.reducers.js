import AuthActionTypes from './auth.types';

export const authReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case AuthActionTypes.USER_AUTH_VERIFICATION_START:
			return { loading: true };

		case AuthActionTypes.USER_AUTH_VERIFICATION_SUCCESS:
			return { loading: false, isAuthenticated: () => true, info: action.payload };

		case AuthActionTypes.USER_AUTH_VERIFICATION_FAIL:
			return { loading: false, isAuthenticated: () => false, error: action.payload };

		default:
			return state;
	}
};
