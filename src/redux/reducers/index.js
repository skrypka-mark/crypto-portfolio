import { combineReducers } from 'redux';
import { orderReducer } from './orderReducer';
import { priceReducer } from './priceReducer';

const rootReducer = combineReducers({
    orderReducer,
    priceReducer
});

export default rootReducer;