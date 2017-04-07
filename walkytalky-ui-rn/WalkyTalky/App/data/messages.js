import ChatUsers from './ChatUsers';
import uuid from 'uuid';

export default [
  {
    _id: uuid.v4(),
    text: 'Cool! What action would you like to take?',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 19, 0)),
    user: Object.assign({}, ChatUsers.bot),
    decisions:[
      {
        text: 'Action 1',
        selection: 'action1',
        key: uuid.v4()
      },
      {
        text: 'Action 2',
        selection: 'action2',
        key: uuid.v4()
      }
    ],
  },
  {
    _id: uuid.v4(),
    text: 'Yes, yes I am!',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: Object.assign({}, ChatUsers.user),
    // location: {
    //   latitude: 48.864601,
    //   longitude: 2.398704
    // },
  },
  {
    _id: uuid.v4(),
    text: 'Are you building a chat app?',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 19, 0)),
    user: Object.assign({}, ChatUsers.bot),
  },
  {
    _id: uuid.v4(),
    text: 'Maybe...',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 18, 0)),
    user: Object.assign({}, ChatUsers.user),
  },
  {
    _id: uuid.v4(),
    text: 'Are you building a chat app?',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 17, 0)),
    user: Object.assign({}, ChatUsers.bot),
  },
  {
    _id: uuid.v4(),
    text: 'Maybe...',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 16, 0)),
    user: Object.assign({}, ChatUsers.user),
  },
  {
    _id: uuid.v4(),
    text: 'Are you building a chat app?',
    createdAt: new Date(Date.UTC(2016, 7, 30, 17, 15, 0)),
    user: Object.assign({}, ChatUsers.bot),
  },
];
