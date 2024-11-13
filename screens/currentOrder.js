import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Import your Firebase config

const db = getFirestore(app);

const CurrentOrder = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const fetchedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          VendorName: data.VendorName,
          vendorContactNo: data.vendorContactNo,
          date: data.date,
          items: data.cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            
          })),
          total: data?.total,
          status: data?.status,
          deliveryAddress: data.location,
          
        };
      });

      const filteredOrders = fetchedOrders.filter(order => order.status === 'Pending' || order.status === 'Accepted');
      setOrders(filteredOrders);
    // setOrders(fetchedOrders);

    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.VendorName}
        subtitle={`Date: ${item.date}`}
        left={(props) => <Avatar.Icon {...props} icon="store" />}
      />
      <Card.Content>
        <ScrollView style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Order Items:</Text>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemText}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Total: ₹ {item.total}</Text>
          <Text style={[styles.detailText, { color: item.status === "Pending" ? "orange" : "teal" },]}>Status: {item.status} </Text>
          <Text style={styles.detailText}>Delivery Address: {item.deliveryAddress}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {item.status!=="Accepted" && <Button
          mode="contained"
          onPress={() => navigation.navigate('order-tracking', {vendorContactNo:item.vendorContactNo})}
          style={styles.button}
        >
          Track
        </Button>}
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  itemsContainer: {
    maxHeight: 150,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    marginHorizontal: 8,
  },
});

export default CurrentOrder;
