import React from 'react';
import FadeIn from 'react-native-fade-in-image';
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler';
import HeaderButtons from 'react-navigation-header-buttons';
import { Icon } from 'expo';
const { Ionicons } = Icon;

import SwipeableRow from '../components/SwipeableRow';
import Layout from '../constants/Layout';

const RSS_2_JSON_API_KEY = 'y3x8qzfkpp8qjm1rovjycxmf8522byed1i3rv2nx';
async function fetchLatestEpisodeAsync(rssUrl) {
  let url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl
  )}&api_key=${RSS_2_JSON_API_KEY}&count=1`;
  let response = await fetch(url);
  let result = await response.json();
  return result.items && result.items[0];
}

@connect()
class Row extends React.PureComponent {
  state = {
    latestEpisode: null,
  };

  componentDidMount() {
    this._updateLatestEpisodeAsync();
  }

  _updateLatestEpisodeAsync = async () => {
    let latestEpisode = await fetchLatestEpisodeAsync(
      this.props.podcast.feedUrl
    );
    this.setState({ latestEpisode });
  };

  render() {
    let { podcast } = this.props;
    return (
      <SwipeableRow onDelete={this._handleDelete}>
        <BorderlessButton
          onPress={
            this.state.latestEpisode ? this._playLatestEpisodeAsync : null
          }>
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: '#eee',
              backgroundColor: '#fff',
            }}>
            <View
              style={[
                styles.row,
                {
                  paddingRight: 10,
                  backgroundColor: '#fafafa',
                },
              ]}>
              <FadeIn>
                <Image source={{ uri: podcast.imageUrl }} style={styles.logo} />
              </FadeIn>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  style={{ fontSize: 15, fontWeight: '500' }}>
                  {podcast.title}
                </Text>
              </View>
            </View>
            <View style={styles.row}>{this._maybeRenderLatestEpisode()}</View>
          </View>
        </BorderlessButton>
      </SwipeableRow>
    );
  }

  _handleDelete = () => {
    this.props.dispatch({
      type: 'REMOVE_PODCAST',
      payload: this.props.podcast,
    });
  };

  _maybeRenderLatestEpisode = () => {
    if (!this.state.latestEpisode) {
      return null;
    }

    return (
      <View
        style={{
          paddingLeft: 5,
          paddingVertical: 15,
          paddingRight: 15,
          flex: 1,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 1 }}>
          <Text>{this.state.latestEpisode.title}</Text>
        </View>
        <Ionicons name="ios-arrow-forward" size={20} color="#ccc" />
      </View>
    );
  };

  _playLatestEpisodeAsync = async () => {
    this.props.dispatch({
      type: 'SELECT_EPISODE',
      payload: this.state.latestEpisode,
    });
  };
}

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Latest',
    headerRight: (
      <HeaderButtons IconComponent={Icon.Ionicons} iconSize={23} color="#000">
        <HeaderButtons.Item
          title="search"
          iconName="ios-search"
          onPress={() => navigation.navigate('Search')}
        />
      </HeaderButtons>
    ),
  });

  render() {
    if (!this.props.podcasts.length) {
      return this._renderEmptyState();
    }

    return (
      <FlatList
        data={this.props.podcasts}
        keyExtractor={item => item.id.toString()}
        renderItem={this._renderItem}
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: this.props.isPlayerActive
              ? Layout.bottomInsetForPlayer
              : Layout.defaultBottomInset,
          },
        ]}
        renderScrollComponent={props => <ScrollView {...props} />}
      />
    );
  }

  _renderEmptyState = () => {
    return (
      <View style={{ flex: 1, paddingTop: 30, paddingHorizontal: 20 }}>
        <Text style={{ textAlign: 'center', color: '#888' }}>
          Oh no! You don't have any podcasts on your list. Hit the search button
          up on the right to find one, then tap on it to add it.
        </Text>
      </View>
    );
  };

  _renderItem = ({ item }) => <Row podcast={item} />;
}

export default connect(state => ({
  podcasts: state.podcasts,
  isPlayerActive: !!state.selectedEpisode,
}))(ListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
