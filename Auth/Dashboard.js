import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save user details to AsyncStorage
  const saveUserDataLocally = async (data) => {
    try {
      await AsyncStorage.setItem('userDetails', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data locally:', error);
    }
  };

  const getUserToken = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
            console.log('Token retrieved:', userToken);
        } else {
            console.log('No token found');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

  // Fetch user details from AsyncStorage
  const getUserDataFromLocalStorage = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userDetails');
      if (savedData) {
        setUserData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error fetching data from local storage:', error);
    }
  };

  // Fetch logged-in user's data from Firestore
  const fetchUserData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userDocument = await firestore().collection('users').doc(currentUser.uid).get();
        if (userDocument.exists) {
          const userDataFromFirestore = userDocument.data();
          setUserData(userDataFromFirestore);
          await saveUserDataLocally(userDataFromFirestore);  // Save data locally
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserToken();  // Fetch the token when the Dashboard is loaded
    getUserDataFromLocalStorage();  // Fetch user data from AsyncStorage
    fetchUserData();  // Fetch user data from Firestore
   }, []);

   const handleLogout = async () => {
    try {
        await auth().signOut();
        await AsyncStorage.removeItem('userToken');  // Clear the token on logout
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    } catch (error) {
        console.log("Error doing logout:", error);
    }
};


  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#BEBDB8" }}>
      <Text style={styles.header}>Welcome to Dashboard!</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading your details...</Text>
      ) : (
        userData && (
          <>
            <Text style={styles.userText}>Name: {userData.name}</Text>
            <Text style={styles.userText}>Date of Birth: {userData.dob}</Text>
            <Text style={styles.userText}>Address: {userData.address}</Text>
          </>
        )
      )}

      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 150,
  },
  userText: {
    fontSize: 20,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
