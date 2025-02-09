module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',  // Use '@env' to import variables from the .env file
        path: '.env',        // Path to your .env file
      }],
    ],
  };
  