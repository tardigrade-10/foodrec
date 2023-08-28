import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, ScrollView } from 'react-native';
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
                setMenuDetails(response.data.result);
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

    if (!menuDetails) {
        return null;
      };
      
      return (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {JSON.stringify(menuDetails)}
        </Text>
        </View>
      );

    //   return (
    //     <ScrollView>
    //         <View>
    //             <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
    //                 {foodDetails.nutrients[0].name}
    //             </Text>
    
    //             {Object.keys(foodDetails.nutrients[0]).map((key) => 
    //                 <Text style={{ marginBottom: 10 }}>
    //                     {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: {foodDetails.nutrients[0][key]}
    //                 </Text>
    //             )}
    
    //             <View>
    //                 {Object.keys(foodDetails.recipe).map((step) => 
    //                     <View style={{ marginBottom: 15 }}>
    //                         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
    //                             {step.charAt(0).toUpperCase() + step.slice(1)}:
    //                         </Text>
    //                         <Text>
    //                             {foodDetails.recipe[step]}
    //                         </Text>
    //                     </View>
    //                 )}
    //             </View>
    
    //             <View>
    //                 <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
    //                     Origin
    //                 </Text>
    //                 <Text>{foodDetails.history.origin}</Text>
    
    //                 <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
    //                     History
    //                 </Text>
    //                 <Text>{foodDetails.history.history}</Text>
    //             </View>
    //         </View>
    //     </ScrollView>
    // );
}
