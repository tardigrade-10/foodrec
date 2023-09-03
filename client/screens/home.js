import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/home_bg.jpg')} // Add your background image source
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>Bharat Bhoj</Text>
        <Text style={styles.appSubtitle}>Aims to provide culinary knowledge to Indian youth</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RecogniseFood')}
        >
          <Text style={styles.buttonText}>Recognise Food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ScanMenu')}
        >
          <Text style={styles.buttonText}>Scan Menu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background overlay
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent button background
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
