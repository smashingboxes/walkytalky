import { actionTypes } from '../actions';

const initialState = {
  loadEarlier: true,
  typingText: null,
  isLoadingEarlier: false,
  messages: []
}

export default function handleAction(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_IS_TYPING:
      return Object.assign({}, state, {
        typingText: action.typingText
      });

    case actionTypes.SET_LOADING_EARLIER:
      return Object.assign({}, state, {
        isLoadingEarlier: action.isLoadingEarlier
      });

    case actionTypes.LOAD_EARLIER_MESSAGES:
      return Object.assign({}, state, {
        isLoadingEarlier: action.isLoadingEarlier,
        messages: [].concat(state.messages, action.messages)
      });

    case actionTypes.ADD_BOT_MESSAGE:
      return Object.assign({}, state, {
        messages: [
          action,
          ...state.messages
        ]
      });

    case actionTypes.ADD_USER_DECISION:
      console.log(action);
      return Object.assign({}, state, {
        messages: [
          action,
          ...state.messages
        ]
      });

    default:
      return state
  }
}
