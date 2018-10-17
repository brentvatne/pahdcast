import React from 'react';
import { Animated, Platform } from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import ListScreen from '../screens/ListScreen';
import SearchScreen from '../screens/SearchScreen';

const Navigator = createStackNavigator(
  {
    List: ListScreen,
    Search: SearchScreen,
  },
  {
    cardStyle: {
      backgroundColor: '#fafafa',
    },
    transitionConfig: (transitionProps, prevTransitionProps) => {
      const destinationRoute = transitionProps.scene.route.routeName;
      const previousRoute = prevTransitionProps
        ? prevTransitionProps.scene.route.routeName
        : null;

      if ([destinationRoute, previousRoute].includes('Search')) {
        return {
          transitionSpec: {
            duration: 0,
            timing: Animated.timing,
          },
        };
      }
    },
  }
);

export default createAppContainer(Navigator);
