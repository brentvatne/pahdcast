import { Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const playerHeight = 60;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  playerHeight,
  bottomInsetForPlayer: playerHeight + (isIphoneX() ? 25 : 0),
  defaultBottomInset: (isIphoneX ? 25 : 0),
};
