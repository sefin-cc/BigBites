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
  bottomSheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // image modal
  image: {
    backgroundColor: "#C1272D",
    height: 200,
  },

  //Modal
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    padding: "3%",
    gap: 15
  },
  modalLabel: {
    fontFamily: 'MadimiOne',
    color: '#C1272D',
    fontSize: 24,
    flexGrow: 1
  },
  modalPrice: {
    fontFamily: 'MadimiOne',
    color: '#2C2C2C',
    fontSize: 24,
  },

  //Line
  dashedLine: {          
    borderBottomWidth: 4,  
    borderColor: 'rgba(194, 39, 45, 0.5)',
    borderStyle: 'dashed',
    flexGrow: 1,
    top: -6 
  },

  //Time
  timeCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B",
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5
  },
  timeText: {
    color: "white",
    fontFamily: 'MadimiOne',
    fontSize: 16,
  },

  //Description
  descriptionText: {
    color: "#7d7c7c",
    fontFamily: 'MadimiOne',
  },

  // AddOns
  addOnsText:{
    color: "#C1272D",
    fontFamily: 'MadimiOne',
    fontSize: 20,
  },
  addOnsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
  },
  addOnsItemCard: {
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "#FB7F3B",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addOnsItemText: {
    fontFamily: 'MadimiOne',
    color: "#FB7F3B",
  },

  //Cart button
  btnCart: {
    flex: 1.5,
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    padding: 10, 
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  cartText: {
    color: "white",
    fontFamily: 'MadimiOne',
    fontSize: 20
  },

  // QTY 
  qtyCard:{
    flex: 1,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 3,
    borderColor: "#FB7F3B"
  },
  qtyCardBtns:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FB7F3B",
  },
  qtyCardView:{
    flex: 1,
    backgroundColor: "white",
    fontFamily: 'MadimiOne',
    color: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyCardViewText:{
    fontFamily: 'MadimiOne',
    fontSize: 20,
  },
});

export default globalStyles;