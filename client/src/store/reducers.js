import { combineReducers } from 'redux';

import { homeReducer } from './home/home.reducers';
import { episodeReducer } from './episode/episode.reducers';

const reducers = combineReducers({
	home: homeReducer,
	episodes: episodeReducer
});

export default reducers;
