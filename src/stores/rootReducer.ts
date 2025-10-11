import { combineReducers } from 'redux';
import { PageState } from './types/PageState';
import { userStateReducer } from './user/reducer';
import { imageStateReducer } from './image/reducer';

export const rootReducer = combineReducers<PageState>({
    user: userStateReducer,
    image: imageStateReducer,
})