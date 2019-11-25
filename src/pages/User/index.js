import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ActivityIndicator,
  LoadMorePage,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParams: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
    loadingPage: true,
    refreshing: false,
  };

  async componentDidMount() {
    const { page } = this.state;
    const response = await this.getItems(page);
    this.setState({ stars: response.data, loading: false, loadingPage: false });
  }

  getItems = async page => {
    const { navigation } = this.props;

    const user = navigation.getParam('user').login;

    const response = await api.get(`/users/${user}/starred?page=${page}`);
    page += 1;

    this.setState({ page, loadingPage: false, refreshing: false });

    return response;
  };

  loadMore = async () => {
    const { page } = this.state;
    this.setState({ loadingPage: true });

    const response = await this.getItems(page);
    this.setState({ stars: response.data });
  };

  refreshList = () => {
    this.setState({ refreshing: true, page: 1 });
    this.getItems(1);
  };

  handleOnPress = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingPage, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator size="large" color="#999" animating={loading} />
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            ListFooterComponent={() => (
              <LoadMorePage visibility={loadingPage}>
                <ActivityIndicator size="large" color="#999" />
              </LoadMorePage>
            )}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.handleOnPress(item)}>
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </TouchableOpacity>
            )}
          />
        )}
      </Container>
    );
  }
}
