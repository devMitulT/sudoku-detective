module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-worklets/plugin must be the LAST plugin (Reanimated 4 requirement)
    plugins: ['react-native-worklets/plugin'],
  };
};
