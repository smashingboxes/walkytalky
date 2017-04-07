import ChatUsers from './ChatUsers';
import uuid from 'uuid';

function newAction (action) {
  return Object.assign({
    key: uuid.v4()
  }, action);
}

let getAction1 = () => {
  return newAction({
    text: 'Action 1',
    selection: 'action1'
  });
}
let getAction2 = () => {
  return newAction({
    text: 'Action 2',
    selection: 'action2'
  });
}

export const action1 = (data) => {
  return {
    text: 'Action 1! Cool! What now?',
    decisions:[
      getAction1(),
      getAction2()
    ]
  }
}

export const action2 = (data) => {
  return {
    text: 'Action 2?! You fool! How dare you.',
    decisions:[
      getAction1(),
      getAction2()
    ]
  }
}

export default (data) => {
  return {
    text: 'Awww... how nice. Pick one.',
    decisions:[
      getAction1(),
      getAction2()
    ]
  }
}

