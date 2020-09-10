const initialState = {
  user: {
    name: "",
  },
  chatList: [],
};

const ADD_NAME = "addName";

export function addName(username) {
  return {
    type: ADD_NAME,
    payload: {
      username,
    },
  };
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NAME:
      const updatedUser = {
        name: action.payload.username,
      };
      return { ...state, user: updatedUser };
    default:
      return state;
  }
};

export default userReducer;
