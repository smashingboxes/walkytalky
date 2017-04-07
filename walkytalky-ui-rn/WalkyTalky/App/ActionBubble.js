import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import {Bubble} from 'react-native-gifted-chat';
let onDecisionHandler;

export default class ActionBubble extends React.Component {
  constructor(props) {
    super(props);
    onDecisionHandler = props.onDecision;
  }

  render(props) {
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Bubble
          {...this.props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            }
          }}
        />
        {this.renderBubbleActions(this.props)}
      </View>
    );
  }

  renderBubbleActions(props) {
    if (props.currentMessage && props.currentMessage.decisions) {
      return (
        <View style={styles.decisionWrapper}>
          {props.currentMessage.decisions.map((action, key)=>{
            return this.renderBubbleAction(action);
          })}
        </View>
      )
    }
    return null;
  }

  renderBubbleAction(action) {
    return (
      <TouchableHighlight key={action.key} onPress={this.onActionPress.bind(action)} style={styles.decision}>
        <Text style={styles.decisionText}>
          {action.text}
        </Text>
      </TouchableHighlight>
    );
  }

  onActionPress() {
    console.log('action:', this);
    onDecisionHandler(this);
  }
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  decision: {
    backgroundColor: '#afafaf',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    flex: 1
  },
  decisionText: {
    color:'#000000'
  },
  decisionWrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginRight: -10,
    marginLeft: -10,
  },
});
