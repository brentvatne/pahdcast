import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Icon } from 'expo';
const { Ionicons } = Icon;

class Player extends React.Component {
  state = {
    status: 'stopped',
    selectedEpisode: null,
    loaded: false,
  };

  static getDerivedStateFromProps(props, prevState) {
    if (prevState.selectedEpisode === props.selectedEpisode) {
      return null;
    }

    return {
      status: 'stopped',
      selectedEpisode: props.selectedEpisode,
      loaded: false,
    };
  }

  render() {
    if (!this.props.selectedEpisode) {
      return null;
    }

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000',
          paddingHorizontal: 15,
          justifyContent: 'center',
          height: 60,
        }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <View
            style={{
              paddingRight: 20,
              paddingTop: 3,
              width: 35,
              justifyContent: 'center',
            }}>
            {this.state.status === 'loading' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <RectButton onPress={this._handleButtonPress}>
                <Ionicons
                  name={
                    this.state.status === 'playing' ? 'ios-pause' : 'ios-play'
                  }
                  size={25}
                  color="#fff"
                />
              </RectButton>
            )}
          </View>
          <Text style={{ color: '#fff', fontSize: 15 }}>
            {this.props.selectedEpisode.title}
          </Text>
        </View>
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedEpisode != this.props.selectedEpisode &&
      this.props.selectedEpisode
    ) {
      this._playAsync();
    }
  }

  _handleButtonPress = () => {
    if (this.state.status === 'playing') {
      this._pauseAsync();
    } else {
      this._playAsync();
    }
  };

  _pauseAsync = async () => {
    try {
      await this.soundObject.pauseAsync();
      this.setState({ status: 'paused' });
    } catch (e) {
      alert(e.message);
    }
  };

  _playAsync = async () => {
    if (this.state.loaded) {
      try {
        await this.soundObject.playAsync();
        this.setState({ status: 'playing' });
      } catch (e) {
        alert(e.message);
      }
    } else {
      if (this.soundObject) {
        await this.soundObject.unloadAsync();
      } else {
        this.soundObject = new Expo.Audio.Sound();
      }
      let uri = this.props.selectedEpisode.enclosure.link;
      this.setState({ status: 'loading' });
      try {
        await this.soundObject.loadAsync({ uri });
        this.setState({ status: 'playing', loaded: true });
        await this.soundObject.playAsync();
      } catch (e) {
        alert(e.message);
      }
    }
  };
}

export default connect(state => ({ selectedEpisode: state.selectedEpisode }))(
  Player
);
