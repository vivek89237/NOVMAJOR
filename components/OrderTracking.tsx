import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Mapbox, { MapView, Camera, LocationPuck,ShapeSource, SymbolLayer, CircleLayer , Images,  } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { featureCollection, point } from "@turf/helpers";
import LineRoute from './LineRoute';
import { getCustomer, getVehicleInfo ,getVendor} from '../utils/Firebase';
import { getDirections, getCoordinates } from '~/services/directions';
import pin from "~/assets/pin.png";
import customerLogo from "~/assets/customerLogo.png"
import Marker from "~/assets/marker.png"
import OrderTrackingSheet from "../components/OrderTrackingSheet" 


Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const OrderTracking = ({route}) => {
 
    const {vendorContactNo} = route.params;  // get customer data from navigation params
    //console.log(vendorContactNo);
    const [direction, setDirection] = useState({});
   
    const [coordinates, setCoordinates] = useState([1,1]);
    const [vendor, setVendor] = useState(true);
    // const routeTime = direction?.routes?.[0]?.duration;
    // const routeDistance = direction?.routes?.[0]?.distance;

  useEffect(()=>{
    getVendor(vendorContactNo, setVendor);
  },[])
    
  
  
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
    };

    fetchDircections();
    
  })

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

      <OrderTrackingSheet 
        selectedCustomer={customer[0]} 
        isNearby={true} 
        routeTime={ direction?.routes?.[0]?.duration} 
        routeDistance={direction?.routes?.[0]?.distance} 
        />
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

export default OrderTracking;
