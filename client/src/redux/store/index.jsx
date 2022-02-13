import {createStore} from "redux";

const userReducer = (state = {user: ''}, action) => {
    if (action.type === 'user') {
        return {
            user: state.user = action.users
        }
    }

    return state
}

const store = createStore(userReducer)

export default store;
