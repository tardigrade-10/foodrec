import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, FlatList, Text, View, ScrollView, Image } from 'react-native';
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Fetching the details for you...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    if (menuetails && menuDetails.status === 400 || menuDetails.status === 401) {
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
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Healthy Menu</Text>
            <FlatList
              data={menuDetails.analysis.healthy}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Unhealthy Menu</Text>
            <FlatList
              data={menuDetails.analysis.unhealthy}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
            />
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    item: {
      fontSize: 16,
      marginBottom: 5,
    },
  });
