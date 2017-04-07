import uuid from 'uuid';
import msgs from '../data/old_messages.js'

export const ADD_BOT_MESSAGE = 'ADD_BOT_MESSAGE';
export const ADD_USER_DECISION = 'ADD_USER_DECISION';
export const LOAD_EARLIER_MESSAGES = 'LOAD_EARLIER_MESSAGES';
export const SET_LOADING_EARLIER = 'SET_LOADING_EARLIER';
export const SET_IS_TYPING = 'SET_IS_TYPING';
export const actionTypes = {
  ADD_BOT_MESSAGE,
  ADD_USER_DECISION,
  LOAD_EARLIER_MESSAGES,
  SET_LOADING_EARLIER,
  SET_IS_TYPING
}
import ChatUsers from '../data/ChatUsers';


export function SetIsTypingText (text) {
  return {
    type: SET_IS_TYPING,
    typingText: text
  }
}

export function SetLoadingEarlierMessages () {
  return {
    type: SET_LOADING_EARLIER,
    isLoadingEarlier: true
  }
}

export function LoadEarlierMessages () {
  return {
    type: LOAD_EARLIER_MESSAGES,
    messages: msgs,
    loadEarlier: false,
    isLoadingEarlier: false,
  };
}

export function AddBotMessage (message) {
  return {
    type: ADD_BOT_MESSAGE,
    _id: uuid.v4(),
    text: message.text,
    createdAt: message.createdAt || new Date(),
    user: Object.assign({}, ChatUsers.bot),
    decisions: message.decisions || null
  }
}

export function AddUserDecision (decision) {
  console.log(decision);
  return {
    type: ADD_USER_DECISION,
    _id: uuid.v4(),
    text: decision.text,
    createdAt: new Date(),
    user: Object.assign({}, ChatUsers.user),
    selection: decision.selection
  }
}
