import { ADD_ORDER } from '../consts';

const initialState = {
    orders: []
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload]
            };
        default:
            return state;
    }
};

export const addOrder = payload => ({ type: ADD_ORDER, payload })