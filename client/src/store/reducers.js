import { combineReducers } from 'redux';

import { homeReducer } from './home/home.reducers';
import { episodeCatalogReducer } from './episode-catalog/episode-catalog.reducers';
import { authReducer } from './auth/auth.reducers';

const reducers = combineReducers({
	home: homeReducer,
	episodeCatalog: episodeCatalogReducer,
	auth: authReducer
});

export default reducers;
