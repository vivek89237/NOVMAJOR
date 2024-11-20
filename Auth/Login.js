import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userType } = route.params;  // Get userType passed from Home.js

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.log('Error sending code:', error);
    }
  };

  const confirmCode = async () => {
    try {
      const userCredential = await confirm.confirm(code);
      const user = userCredential.user;

      // Store user token locally
      await AsyncStorage.setItem('userToken', user.uid);

      // Check if user exists in Firestore
      const collection = userType === "Customer" ? "customers" : "vendors";
      const userDocument = await firestore().collection(collection).doc(user.uid).get();

      if (userDocument.exists) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("Detail", { uid: user.uid, userType });  // Pass userType to Detail.js
      }
    } catch (error) {
      console.log("Invalid code.", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: 'BEBDB8' }}>
      <Text style={{
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40,
        marginTop: 150,
        color: 'green'
      }}>
        Go-Cart: {userType === "Customer" ? "Customer" : "Vendor"} Login
      </Text>

      {!confirm ? (
        <>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>
            Enter your Phone Number:
          </Text>
          <TextInput style={{
            height: 50,
            width: "100%",
            borderColor: "black",
            borderWidth: 1,
            marginBottom: 30,
            paddingHorizontal: 10,
          }}
            placeholder="e.g.+91 987654321"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TouchableOpacity
            onPress={signInWithPhoneNumber}
            style={{
              backgroundColor: "#841584",
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
              alignItems: 'center'
            }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Send Code
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>
            Enter the code sent to your Phone Number:
          </Text>

          <TextInput style={{
            height: 50,
            width: "100%",
            borderColor: "black",
            borderWidth: 1,
            marginBottom: 30,
            paddingHorizontal: 10,
          }}
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity
            onPress={confirmCode}
            style={{
              backgroundColor: "#841584",
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
              alignItems: 'center'
            }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Submit Code
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
