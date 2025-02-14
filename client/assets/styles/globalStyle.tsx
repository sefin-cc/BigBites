import { StatusBar, StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#FFEEE5",
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
    borderWidth: 5,
    borderColor: "white",
  },
  buttonText: {
    fontFamily: 'MadimiOne',
    color: '#FFEEE5',
    fontSize: 20,
  },
  menuGrid: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    
  },


  headerStyle: {
    alignItems: "center",
    backgroundColor: '#FB7F3B',
  },
  headerTitleStyle:{
    fontFamily: 'MadimiOne',
    color: '#FFEEE5',
    fontSize: 20,
  },

  searchMenu: {
    height: 45,
    backgroundColor: "white",
    borderColor: '#C1272D',
    borderWidth: 2,
    paddingLeft: 10,
    borderRadius: 5,
    fontFamily: 'MadimiOne',
    color: "#2C2C2C",
    flexGrow: 1
  },
});

export default globalStyles;