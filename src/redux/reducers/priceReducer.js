import { SET_PRICE } from '../consts';

const initialState = {
    prices: {}
};

export const priceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PRICE:
            return {
                ...state,
                prices: { ...state.prices, [action.payload.pair]: action.payload.price }
            };
        default:
            return state;
    }
};

export const setPrice = payload => ({ type: SET_PRICE, payload })