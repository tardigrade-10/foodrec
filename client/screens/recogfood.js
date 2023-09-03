import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native';

export default function RecogniseFoodScreen() {
    const [type, setType] = useState(CameraType.back);
    const [hasPermission, setHasPermission] = useState(null);
    const [image, setImage] = useState(null);
    MediaLibrary.requestPermissionsAsync();
    const cameraRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
                const mediaLibPermission = await MediaLibrary.requestPermissionsAsync();
                setHasPermission(mediaLibPermission.status === 'granted');
            }
        })();
    }, []);

    if (hasPermission === null) {
        // Camera permissions are still loading
        return <View />;
    }

    if (hasPermission === false) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    
    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                console.log('test')
                console.log(data);

                setImage(data.uri);

            } catch (e) {
                console.log(e);
            }
        }
    };

    const sendImageToBackend = async (imageUri, imageName) => {
        try {
            const formData = new FormData();
            let fileType = imageUri.substring(imageUri.lastIndexOf(".") + 1);  

            formData.append('image', {  // attaching the image file
                uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                name: `${imageName}.${fileType}`,
                type: `image/${fileType}`  // or whichever type the image is
            });

            navigation.navigate('FoodDetails', {photo: formData})

        } catch (error) {
            console.error('Error Sending Image to Backend:', error);
        }
    };

    
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        {image && <Image source={{ uri: image }} style={styles.capturedImage} />}
      </Camera>
      <View>
        {image ? (
          <View style={styles.buttonRow}>
            <Button title="Re-take" onPress={() => setImage(null)} />
            <Button title="Confirm" onPress={() => sendImageToBackend(image, 'photo')} />
          </View>
        ) : (
          <TouchableOpacity style={styles.bigButton} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Food Picture</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.uploadButtonContainer}>
        <TouchableOpacity style={styles.bigButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(110, 38, 14, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    flex: 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  bigButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
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
  capturedImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  uploadButtonContainer: {
    margin: 20,
  },
});
