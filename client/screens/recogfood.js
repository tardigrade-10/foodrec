import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

export default function RecogniseFoodScreen() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [image, setImage] = useState(null);
    MediaLibrary.requestPermissionsAsync();
    const cameraRef = useRef(null);

    // Define your backend API endpoint here
    const backendAPIEndpoint = 'http://127.0.0.1:8000/analyse';
    const navigation = useNavigation();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const saveImage = async () => {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image);
                alert("Image saved");
                setImage(null);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                console.log(data);
                setImage(data.uri);

                // Send the captured image to the backend for analysis
                await sendImageToBackend(data.uri);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const sendImageToBackend = async (imageUri) => {
        try {
            // const formData = new FormData();
            // formData.append('file', {
            //     uri: imageUri, 
            //     type: 'image/jpeg', // Adjust the type based on your image format
            //     name: 'photo.jpg', // Adjust the name based on your requirements
            // });
            // console.log(formData)

            // Make an HTTP POST request to your backend API endpoint
            const image = await fetch(imageUri);
            const blob = await image.blob();

            console.log(blob)

            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');


            const response = await fetch(backendAPIEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Add any additional headers if required
                },
            });
            console.log(response)

            // Handle the response from the backend here
            if (response.ok) {
                const responseData = await response.json();
                console.log('Backend Response:', responseData);
                navigation.navigate('Food Details', {foodItem: responseData})
                // You can process the response from the backend here
            } else {
                console.log('Backend Error:', response.status, response.statusText);
            }
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        {/* <Text style={styles.text}>Flip Camera</Text> */}
                    </TouchableOpacity>
                </View>
                {image && (
                    <Image source={{ uri: image }} style={styles.capturedImage} />
                )}
            </Camera>
            <View>
                {image ? (
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 50
                    }}>
                        <Button title={'Re-take'} icon="retweet" onPress={() => setImage(null)} />
                        <Button title={'Save'} icon="check" onPress={saveImage} />
                    </View>
                ) : (
                    <Button title={'Take a Picture'} icon="camera" onPress={takePicture} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: 'transparent',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
    },
});
