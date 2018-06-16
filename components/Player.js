import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'expo';
const { Ionicons } = Icon;

import Layout from '../constants/Layout';

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
    if (!this.state.selectedEpisode) {
      return null;
    }

    return (
      <SafeAreaView
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000',
          paddingHorizontal: 15,
          justifyContent: 'center',
          paddingBottom: 5,
          height: Layout.playerHeight,
        }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          {this.state.status === 'loading' ? (
            <View
              style={{
                paddingRight: 20,
                paddingTop: 13,
                paddingBottom: 10,
                width: 35,
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <BorderlessButton
              style={{
                paddingRight: 20,
                paddingTop: 3,
                width: 35,
                justifyContent: 'center',
              }}
              onPress={this._handleButtonPress}>
              <Ionicons
                name={
                  this.state.status === 'playing' ? 'ios-pause' : 'ios-play'
                }
                size={25}
                color="#fff"
              />
            </BorderlessButton>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 15 }} numberOfLines={2}>
              {this.state.selectedEpisode.title}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedEpisode != this.state.selectedEpisode &&
      this.state.selectedEpisode
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
        if (this.state.status === 'loading') {
          await this.soundObject.stopAsync();
        }
        await this.soundObject.unloadAsync();
      } else {
        this.soundObject = new Expo.Audio.Sound();
      }

      let uri = this.state.selectedEpisode.enclosure.link;
      this.setState({ status: 'loading' });
      try {
        await this.soundObject.loadAsync({ uri });
        this.setState({ status: 'playing', loaded: true });
        await this.soundObject.playAsync();
      } catch (e) {
        if (__DEV__) {
          alert(e.message);
        }
      }
    }
  };
}

export default connect(state => ({ selectedEpisode: state.selectedEpisode }))(
  Player
);
