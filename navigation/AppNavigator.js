import React from 'react';
import { Animated, Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import ListScreen from '../screens/ListScreen';
import SearchScreen from '../screens/SearchScreen';

const ListSearchSwitch = createStackNavigator(
  {
    List: ListScreen,
    Search: SearchScreen,
  },
  {
    cardStyle: {
      backgroundColor: '#fafafa',
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
      },
    }),
  }
);

export default createSwitchNavigator({
  ListAndSearch: ListSearchSwitch,
});
