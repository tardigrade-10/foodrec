import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, ScrollView, Image } from 'react-native';
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
                setFoodDetails(response.data.analysis);
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
                <Image style={{width: '100%', height: 200}} source={{ uri: route.params.photo}}/>
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

    if (!foodDetails) {
        return null;
      };

      return (
        <ScrollView>
            <View>
                <Image style={{width: '100%', height: 200}} source={{ uri: route.params.photo}}/>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {foodDetails.nutrients[0].name}
                </Text>
    
                {Object.keys(foodDetails.nutrients[0]).map((key, index) => 
                    <Text key={index} style={{ marginBottom: 10 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: {foodDetails.nutrients[0][key]}
                    </Text>
                )}
    
                <View>
                    {Object.keys(foodDetails.recipe).map((step, index) => 
                        <View key={index} style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                {step.charAt(0).toUpperCase() + step.slice(1)}:
                            </Text>
                            <Text>
                                {foodDetails.recipe[step]}
                            </Text>
                        </View>
                    )}
                </View>
    
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                        Origin
                    </Text>
                    <Text>{foodDetails.history.origin}</Text>
    
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
                        History
                    </Text>
                    <Text>{foodDetails.history.history}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
