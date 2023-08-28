import { Camera, CameraType } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import client from "../api"

export default function ScanMenuScreen() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [image, setImage] = useState(null);
    MediaLibrary.requestPermissionsAsync();
    const cameraRef = useRef(null);
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
                uri: imageUri,
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
                        <Button title={'Confirm'} icon="check" onPress={() => sendImageToBackend(image, "photo")} />
                    </View>
                ) : (
                    <Button title={'Take Menu Picture'} icon="camera" onPress={takePicture} />
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
