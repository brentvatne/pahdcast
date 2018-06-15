import React from 'react';
import {
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
        onSubmit={this._executeSearch}
        searchInputSelectionColor="#fff"
        searchInputTextColor={Platform.OS === 'android' ? '#fff' : 'black'}
        searchInputPlaceholderTextColor={
          Platform.OS === 'ios' ? '#898989' : '#fafafa'
        }>
        <FlatList
          data={this.state.podcasts}
          keyExtractor={item => item.id.toString()}
          renderItem={this._renderItem}
          renderScrollComponent={props => <ScrollView {...props} />}
          contentContainerStyle={{paddingBottom: this.props.isPlayerActive ? 70 : 0}}
          style={{ flex: 1 }}
        />
      </SearchLayout>
    );
  }

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
    this.props.dispatch({ type: 'ADD_PODCAST', payload: item });
    alert(`Added ${item.title} to your list!`);
  };

  _handleQueryChange = searchText => {
    this.setState({ searchText });
  };

  _executeSearch = async () => {
    let podcasts = await searchPodcastsAsync(this.state.searchText);
    this.setState({ podcasts });
  };
}

export default connect(state => ({
  isPlayerActive: !!state.selectedEpisode
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
