import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropType from 'prop-types';

import { Container } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propType = {
    navigation: PropType.shape({
      getParam: PropType.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const url = navigation.getParam('repository').html_url;

    return (
      <Container>
        <WebView source={{ uri: url }} styled={{ flex: 1 }} />
      </Container>
    );
  }
}
