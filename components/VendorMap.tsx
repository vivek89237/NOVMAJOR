import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Mapbox, { MapView, Camera, LocationPuck,ShapeSource, SymbolLayer, CircleLayer , Images } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { featureCollection, point } from "@turf/helpers";
import LineRoute from './LineRoute';
import { getCustomer, getVehicleInfo, updateVehicleInfo } from '../utils/Firebase';
import { getDirections, getCoordinates } from '~/services/directions';
import pin from "~/assets/pin.png";
import customerLogo from "~/assets/customerLogo.png"
import SeletedCustomerSheet from "../components/SelectedCustomerSheet" 

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const VendorMap = ({route}) => {
    //const {customer} = route.params;
    const [direction, setDirection] = useState({});
    const [customer, setCustomer] = useState([]);
    const [coordinates, setCoordinates] = useState([1,1]);
    const [vendor, setVendor] = useState(true);
    // const routeTime = direction?.routes?.[0]?.duration;
    // const routeDistance = direction?.routes?.[0]?.distance;

  useEffect(()=>{
    getCustomer(setCustomer);
  },[])
    //const add : string = `${customer?.address} ${customer?.city} ${customer?.country}`; 
  const address: string = "213B Dhiraj Nagar, Indore, Indore, Madhya Pradesh, India";
  //console.log(customer);
  
  
  useEffect(()=>{
    getCoordinates(address, setCoordinates);
  },[])


  useEffect(()=>{
    const fetchDircections = async ()=>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let myLocation = await Location.getCurrentPositionAsync({});

      const newDirection = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        coordinates
      );
      setDirection(newDirection);
      updateVehicleInfo(1234567890, myLocation.coords.longitude, myLocation.coords.longitude)
    };
    setInterval(fetchDircections, 5000);
  }, [])

  //console.log(route)
  return (
    <View style={styles.container}>
      {/* Map View */}
      
      <MapView style={styles.map} styleURL="mapbox://styles/mapbox/dark-v11">
        <Camera followZoomLevel={15} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        <ShapeSource 
          id="scooters" 
          cluster
          shape={featureCollection([point(coordinates)])} 
        >
          <SymbolLayer 
            id="scooter-icons"
            filter={['!' ,['has', 'point_count']]} 
            style={{
              iconImage: 'pin',
              iconSize : 0.3,
              iconAllowOverlap: true,
              iconAnchor : 'bottom'
            }} 
          />
          <Images images={{pin}}  />
        </ShapeSource>
        <LineRoute coordinates={direction?.routes?.[0]?.geometry?.coordinates} />
      </MapView>

      <SeletedCustomerSheet 
        selectedCustomer={customer[0]} 
        isNearby={true} 
        routeTime={ direction?.routes?.[0]?.duration} 
        routeDistance={direction?.routes?.[0]?.distance} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default VendorMap;
