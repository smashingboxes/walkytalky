import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

import { GiftedChat, Actions } from 'react-native-gifted-chat';
import ActionBubble from './ActionBubble';
import CustomActions from './CustomActions';
import CustomView from './CustomView';

import {
  LoadEarlierMessages,
  SetLoadingEarlierMessages,
  AddBotMessage,
  AddUserDecision,
  SetIsTypingText
} from './actions';

import InitMessages from './data/messages';
import * as ChatBotResponses from './data/ChatBotResponses';
import Reducer from './reducers';

let store = createStore(Reducer, {
  ui: 'chat',
  loadEarlier: true,
  typingText: null,
  isLoadingEarlier: false,
  messages: InitMessages
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.doUnsubscribe = store.subscribe(this.onStoreChange.bind(this));

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.sendChatbotReply = this.sendChatbotReply.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  onStoreChange() {
    this.setState(()=>{
      return store.getState();
    });
    //console.log('onStoreChange', this.state);
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    store.dispatch(SetLoadingEarlierMessages());

    setTimeout(() => {
      if (this._isMounted === true) {
        store.dispatch(LoadEarlierMessages());
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    this.onUserDecision(messages[0]);
  }

  onUserDecision(decision) {
    console.log(decision);
    store.dispatch(AddUserDecision(decision));
    this.answerDemo(this.state.messages, decision);
  }

  answerDemo(messages, userMessage) {
    console.log('answer demo', ChatBotResponses);

    if (messages.length > 0) {
      if ((userMessage.image || userMessage.location) || !this._isAlright) {
        store.dispatch(SetIsTypingText('The Chat Bot is typing'));
      }
    }
    if (userMessage.selection) {
      setTimeout(()=>{
        this.sendChatbotReply({ text: 'Alright... I\'ll look that up.' });
      }, 100);


      setTimeout(() => {
        if (this._isMounted === true && messages.length > 0) {
          if (ChatBotResponses[userMessage.selection]) {
            this.sendChatbotReply(ChatBotResponses[userMessage.selection](userMessage));
          }
        }

        store.dispatch(SetIsTypingText(null));
      }, 1000);
    } else {
      setTimeout(()=>{
        store.dispatch(SetIsTypingText(null));
        this.sendChatbotReply(ChatBotResponses.default(userMessage));
      }, 100);
    }
  }

  sendChatbotReply(message) {
    store.dispatch(AddBotMessage(message));
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <ActionBubble onDecision={this.onUserDecision.bind(this)} {...props}/>
    );
  }

  renderCustomView(props) {
    return (
      <CustomView {...props}/>
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}

        user={{
          _id: 1, // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
