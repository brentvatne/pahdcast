import React from 'react';
import FadeIn from 'react-native-fade-in-image';
import {
  AsyncStorage,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { RectButton } from 'react-native-gesture-handler';

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
      <View>
        <View
          style={[styles.row, { paddingRight: 10 }]}>
          <FadeIn>
            <Image source={{ uri: podcast.imageUrl }} style={styles.logo} />
          </FadeIn>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2}>
              {podcast.title}
            </Text>
          </View>
        </View>
        <View style={styles.row}>{this._maybeRenderLatestEpisode()}</View>
      </View>
    );
  }

  _maybeRenderLatestEpisode = () => {
    if (!this.state.latestEpisode) {
      return null;
    }

    return (
      <RectButton
        style={{
          padding: 10,
          backgroundColor: '#fafafa',
          flex: 1,
          marginBottom: 20,
        }}
        onPress={this._playLatestEpisodeAsync}>
        <Text>{this.state.latestEpisode.title}</Text>
      </RectButton>
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
  render() {
    return (
      <FlatList
        data={this.props.podcasts}
        keyExtractor={item => item.id.toString()}
        renderItem={this._renderItem}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />
    );
  }

  _renderItem = ({ item }) => <Row podcast={item} />;
}

export default connect(state => ({ podcasts: state.podcasts }))(ListScreen);

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
