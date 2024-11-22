import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where  } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import {useCustomer} from "~/provider/CustomerProvider";

const db = getFirestore(app);

const CurrentOrder = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const {customerContact} = useCustomer();
  
  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where("customerContact", '==', customerContact)
      );
      const querySnapshot = await getDocs(ordersQuery);
      const fetchedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // console.log('customerContact',data);
        return {
          id: doc.id,
          VendorName: data.VendorName,
          vendorContactNo: data.vendorContactNo,
          date: data.date,
          items: data.cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
          customerCoordinates: data.customerCoordinates,
          total: data?.total,
          status: data?.status,
          deliveryAddress: data.location,
        };
      });

      const filteredOrders = fetchedOrders.filter(
        (order) => order.status === 'Pending' || order.status === 'Accepted'
      );

      const sortedOrders = filteredOrders.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'Pending' ? -1 : 1;
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders: ', error);
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
          <Text
            style={[
              styles.detailText,
              { color: item.status === 'Pending' ? 'orange' : 'teal' },
            ]}
          >
            Status: {item.status}
          </Text>
          <Text style={styles.detailText}>
            Delivery Address: {item.deliveryAddress}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        {item.status === 'Accepted' && (
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('Ordertracking', {
                vendorContactNo: item.vendorContactNo,
                vendorName: item.VendorName,
                customerCoordinates: item.customerCoordinates,
              })
            }
            style={styles.button}
          >
            Track Order
          </Button>
        )}
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
    backgroundColor: '#f4f6f8',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  itemsContainer: {
    maxHeight: 150,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    margin: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default CurrentOrder;
