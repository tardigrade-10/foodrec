import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, FlatList, Text, View, ScrollView, Image, ImageBackground } from 'react-native';
import client from '../api'

export default function MenuDetailsScreen({ route }) {
    const [loading, setLoading] = useState(true);
    const [menuDetails, setMenuDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await client.post('/scan-menu', route.params.photo, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMenuDetails(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('There was an error with the request', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [route.params.photo]);

    if (loading) {
      return (
        <ImageBackground
          source={require('../assets/home_bg.jpg')} // Replace with your image path
          style={styles2.backgroundImage}
        >
          <View style={styles2.container}>
            <View style={styles2.innerContainer}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={styles2.text}>Fetching the details for you...</Text>
            </View>
          </View>
        </ImageBackground>
      );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    if (menuDetails && menuDetails.status === 400 || menuDetails.status === 401) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{menuDetails.message}</Text>
            </View>
        );
    }

    if (!menuDetails.analysis) {
        return null;
      };
      
      return (
        <ImageBackground
          source={require('../assets/home_bg.jpg')} // Replace with your image path
          style={styles2.backgroundImage}
        >
        <View style={styles.container}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Healthy Menu</Text>
            </View>
            <FlatList
              data={menuDetails.analysis.healthy}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item}</Text>
                </View>
              )}
            />
          </View>
    
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Unhealthy Menu</Text>
            </View>
            <FlatList
              data={menuDetails.analysis.unhealthy}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item}</Text>
                </View>
              )}
            />
          </View>
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
        padding: 20,
      },
      table: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        minHeight: 40,
      },
      tableHeader: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      tableCell: {
        flex: 1,
        fontSize: 16,
        marginBottom: 5,
      },
    });

  const styles2 = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    innerContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 5,
    },
    text: {
      marginTop: 10,
      fontSize: 16,
      color: '#333',
    },
  });
  
  
  
  
  
  