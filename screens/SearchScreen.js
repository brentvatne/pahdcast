import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Constants } from 'expo';
import { connect } from 'react-redux';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import FadeIn from 'react-native-fade-in-image';
import SearchLayout from 'react-navigation-addon-search-layout';

import Layout from '../constants/Layout';

function resultToPodcast(result) {
  return {
    id: result.collectionId,
    title: result.collectionName,
    feedUrl: result.feedUrl,
    imageUrl: result.artworkUrl100,
  };
}

async function searchPodcastsAsync(term) {
  let response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=podcast&limit=25`
  );
  let json = await response.json();
  return json.results.map(resultToPodcast);
}

class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    podcasts: [],
    searchText: '',
    loading: false,
  };

  render() {
    return (
      <SearchLayout
        headerBackgroundColor="#fff"
        headerTintColor="#000"
        onChangeQuery={this._handleQueryChange}
        onSubmit={this._executeSearch}>
        <FlatList
          data={this.state.podcasts}
          keyExtractor={item => item.id.toString()}
          renderItem={this._renderItem}
          renderScrollComponent={props => <ScrollView {...props} />}
          contentContainerStyle={{
            paddingBottom: this.props.isPlayerActive
              ? Layout.bottomInsetForPlayer
              : Layout.defaultBottomInset,
          }}
          style={{ flex: 1 }}
        />
        {this._maybeRenderLoading()}
      </SearchLayout>
    );
  }

  _maybeRenderLoading = () => {
    if (this.state.loading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 80,
            },
          ]}>
          <ActivityIndicator color="#fff" />
        </View>
      );
    }
  };

  _renderItem = ({ item }) => {
    return (
      <RectButton style={styles.row} onPress={() => this._addItem(item)}>
        <FadeIn>
          <Image source={{ uri: item.imageUrl }} style={styles.logo} />
        </FadeIn>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={2}>{item.title}</Text>
        </View>
      </RectButton>
    );
  };

  _addItem = item => {
    if (this.props.podcasts.find(p => p.id === item.id)) {
      alert(`${item.title} is already in your list!`);
    } else {
      this.props.dispatch({ type: 'ADD_PODCAST', payload: item });
      alert(`Added ${item.title} to your list!`);
    }
  };

  _handleQueryChange = searchText => {
    this.setState({ searchText });
  };

  _executeSearch = async () => {
    this.setState({ loading: true });
    try {
      let podcasts = await searchPodcastsAsync(this.state.searchText);
      this.setState({ podcasts });
    } finally {
      this.setState({ loading: false });
    }
  };
}

export default connect(state => ({
  podcasts: state.podcasts,
  isPlayerActive: !!state.selectedEpisode,
}))(SearchScreen);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
