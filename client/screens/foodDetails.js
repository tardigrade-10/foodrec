import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
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
                    <View>
                        <Text style={styles.sectionHeader}>Nutrient Information</Text>
                        {Object.keys(foodDetails.analysis.nutrients[0]).map((key, index) => (
                            <Text key={index} style={styles.nutrientItem}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: {foodDetails.analysis.nutrients[0][key]}
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noInfo}>No nutrient information available.</Text>
                )}

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Ingredients to Use</Text>
                    {Object.keys(foodDetails.analysis.recipe.ingredients).map((item, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <Text style={styles.ingredientTitle}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}:
                            </Text>
                            <Text>{foodDetails.analysis.recipe.ingredients[item]}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Steps to Follow</Text>
                    {foodDetails.analysis.recipe.steps.map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                            <Text style={styles.stepTitle}>Step {index + 1}:</Text>
                            <Text>{step}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Origin</Text>
                    <Text>{foodDetails.analysis.history.origin}</Text>
                    <Text style={styles.historyHeader}>History</Text>
                    <Text>{foodDetails.analysis.history.history}</Text>
                </View>
            </View>
        </ScrollView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
    },
    dishName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nutrientItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    noInfo: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    ingredientItem: {
        marginBottom: 15,
    },
    ingredientTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    stepItem: {
        marginBottom: 15,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
    },
});

