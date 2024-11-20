import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Detail({ route, navigation }) {
  const { uid, userType } = route.params;  // Get uid and userType from Login.js
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const saveDetails = async () => {
    try {
      const collection = userType === "Customer" ? "customers" : "vendors";

      await firestore().collection(collection).doc(uid).set({
        name,
        dob,
        address,
      });

      // Save locally
      const userData = { name, dob, address, userType };
      await AsyncStorage.setItem('userDetails', JSON.stringify(userData));

      // After saving details, navigate to Dashboard
      navigation.navigate("Dashboard");
    } catch (error) {
      console.log('Error saving details:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "BEBDB8" }}>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 150
      }}>
        Enter your details:
      </Text>

      <TextInput style={{
        height: 50,
        width: "100%",
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 10,
      }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput style={{
        height: 50,
        width: "100%",
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 10,
      }}
        placeholder="Date of Birth"
        value={dob}
        onChangeText={setDob}
      />

      <TextInput style={{
        height: 50,
        width: "100%",
        borderColor: "black",
        borderWidth: 1,
        marginBottom: 30,
        paddingHorizontal: 10,
      }}
        placeholder="Permanent Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        onPress={saveDetails}
        style={{
          backgroundColor: "#841584",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
          alignItems: 'center'
        }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          Save Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}
