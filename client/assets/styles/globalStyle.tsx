import { StatusBar, StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#FFEEE5",
    paddingTop: StatusBar.currentHeight,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: 5,
  },

  bodyText: {
    fontSize: 16,
    color: "#2C2C2C",
    fontFamily: 'MadimiOne'
  },
  button: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 40,
    borderWidth: 4,
    borderColor: "#FFEEE5",
  },
  buttonText: {
    fontFamily: 'MadimiOne',
    color: '#FFEEE5',
    fontSize: 20,
  }
});

export default globalStyles;