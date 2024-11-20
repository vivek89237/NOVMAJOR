import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Fetch() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser; // Get the currently logged-in user
        if (currentUser) {
          const userDocument = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDocument.exists) {
            setUserData(userDocument.data()); // Set the user's data
          } else {
            console.log("User document does not exist.");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Display a loading state until data is fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Display message if no data is found for the user
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No user data found.</Text>
      </View>
    );
  }

  // Display the fetched user data
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Details:</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Name: {userData.name}</Text>
        <Text style={styles.subText}>Date of Birth: {userData.dob}</Text>
        <Text style={styles.subText}>Address: {userData.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
});
