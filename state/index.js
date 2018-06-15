import { compose, applyMiddleware, createStore } from 'redux';
import { REHYDRATE, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AsyncStorage } from 'react-native';
import { find, without } from 'lodash';

const reducer = (state, action) => {
  const { type } = action;

  if (type === REHYDRATE) {
    if (persistedStateIsInvalid(action.payload)) {
      return getInitialState();
    } else {
      return action.payload;
    }
  } else if (type === 'ADD_PODCAST') {
    return addPodcast(state, action.payload);
  } else if (type === 'REMOVE_PODCAST') {
    return removePodcast(state, action.payload.id);
  } else if (type === 'SELECT_EPISODE') {
    return selectEpisode(state, action.payload);
  } else {
    return state;
  }
};

const getInitialState = () => {
  return {
    podcasts: [],
    selectedEpisode: null,
  };
};

function addPodcast(state, podcast) {
  return {
    ...state,
    podcasts: [...state.podcasts, podcast],
  };
}

function selectEpisode(state, episode) {
  return {
    ...state,
    selectedEpisode: episode,
  }
}

function removePodcast(state, id) {
  let podcast = find(state.podcasts, podcast => podcast.id === id);

  return {
    ...state,
    podcasts: without(state.podcasts, podcast),
  };
}

function persistedStateIsInvalid(state) {
  return !state || Object.keys(state).length === 0;
}

const Store = createStore(
  persistReducer({ key: 'root', storage, blacklist: ['selectedEpisode'], version: 1 }, reducer),
  getInitialState()
);

Store.rehydrateAsync = () => {
  return new Promise(resolve => {
    persistStore(Store, null, () => {
      resolve();
    });
  });
};

export default Store;
