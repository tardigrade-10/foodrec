import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native';

export default function ScanMenuScreen() {
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

            navigation.navigate('MenuDetails', {photo: formData})

        } catch (error) {
            console.error('Error Sending Image to Backend:', error);
        }
    };

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    
    return (
        <View style={styles.container}>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            {image && <Image source={{ uri: image }} style={styles.capturedImage} />}
          </Camera>
          <View>
            {image ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setImage(null)}>
                  <Text style={styles.actionButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => sendImageToBackend(image, 'photo')}>
                  <Text style={styles.actionButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text style={styles.captureButtonText}>Take a Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.uploadButtonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F6F6F6', // Light gray background
        justifyContent: 'center',
        alignItems: 'center',
      },
      camera: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      captureButton: {
        backgroundColor: '#007AFF', // Blue color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      captureButtonText: {
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
      actionButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
      },
      actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
      },
      uploadButtonContainer: {
        margin: 20,
      },
      uploadButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
      },
      uploadButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
      },
    });
