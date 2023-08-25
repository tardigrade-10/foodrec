// Details.js

import React from 'react';
import { View, Text } from 'react-native';

export default function DetailsScreen({ route }) {
    // Extract the food item details from the navigation parameters
    const { foodItem } = route.params;

    return (
        <View>
            <Text>Food Item Details</Text>
            <Text>Name: {foodItem.name}</Text>
            <Text>Description: {foodItem.description}</Text>
            {/* Add more details here */}
        </View>
    );
}
