import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, NativeSyntheticEvent } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Ensure this is at the top level
import { Modalize } from 'react-native-modalize';

export default function Featured() {
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = (event: NativeSyntheticEvent<any>) => {
    event.persist();
    modalizeRef.current?.open();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* GestureHandlerRootView wraps the whole component */}
      <View style={styles.container}>
        <TouchableOpacity onPress={onOpen}>
          <Text>Open the modal</Text>
        </TouchableOpacity>
      </View>

      <Modalize ref={modalizeRef} snapPoint={500} modalHeight={500}>
        <Text>LALALLALA</Text>
      </Modalize>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

