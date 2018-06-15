import React from 'react';
import { Animated, Platform } from 'react-native';
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import HeaderButtons from 'react-navigation-header-buttons';
import { Icon } from 'expo';

import ListScreen from '../screens/ListScreen';
import SearchScreen from '../screens/SearchScreen';

const ListSearchSwitch = createStackNavigator(
  {
    List: ListScreen,
    Search: SearchScreen,
  },
  {
    headerMode: 'none',
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

ListSearchSwitch.navigationOptions = ({ navigation }) => {
  if (navigation.state.routes[navigation.state.index].routeName === 'List') {
    return {
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
    };
  } else {
    return {
      header: null,
    };
  }
};

const MainStack = createStackNavigator({
  ListAndSearch: ListSearchSwitch,
});

export default createSwitchNavigator({
  Main: MainStack,
});
