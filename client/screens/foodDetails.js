import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image, ImageBackground } from 'react-native';
import client from '../api'

export default function FoodDetailsScreen({ route }) {
    const [loading, setLoading] = useState(true);
    const [foodDetails, setFoodDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await client.post('/analyse', route.params.photo, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setFoodDetails(response.data);
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

    if (foodDetails && foodDetails.status === 400 || foodDetails.status === 500) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{foodDetails.message}</Text>
            </View>
        );
    }

    if (!foodDetails.analysis) {
        return null;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.dishName}>{foodDetails.analysis.dish_name}</Text>

                {foodDetails.analysis.nutrients.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Nutrient Information</Text>
                        <View style={styles.table}>
                            {Object.keys(foodDetails.analysis.nutrients[0]).map((key, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCellLabel}>
                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: 
                                    </Text>
                                    <Text style={styles.tableCellValue}> 
                                        {foodDetails.analysis.nutrients[0][key]}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <Text style={styles.noInfo}>No nutrient information available.</Text>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Ingredients to Use</Text>
                    <View style={styles.table}>
                        {Object.keys(foodDetails.analysis.recipe.ingredients).map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCellLabel}>
                                    {item.charAt(0).toUpperCase() + item.slice(1)}:
                                </Text>
                                <Text style={styles.tableCellValue}>
                                    {foodDetails.analysis.recipe.ingredients[item]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Steps to Follow</Text>
                    {foodDetails.analysis.recipe.steps.map((step, index) => (
                        <View key={index} style={styles.stepBox}>
                            <Text style={styles.stepTitle}>Step {index + 1}:</Text>
                            <Text>{step}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Origin</Text>
                    <Text>{foodDetails.analysis.history.origin}</Text>
                    <Text style={styles.historyHeader}>History</Text>
                    <Text>{foodDetails.analysis.history.history}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    contentContainer: {
        padding: 20,
    },
    dishName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableCellLabel: {
        fontWeight: 'bold',
    },
    tableCellValue: {
        flex: 1,
    },
    noInfo: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    stepBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historyHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
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

