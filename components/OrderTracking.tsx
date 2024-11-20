import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Mapbox, { MapView, Camera, LocationPuck,ShapeSource, SymbolLayer, CircleLayer , Images,  } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { featureCollection, point } from "@turf/helpers";
import LineRoute from './LineRoute';
import {getVendorCoordinates} from '../utils/Firebase';
import { getDirections, getCoordinates } from '~/services/directions';
import pin from "~/assets/pin.png";
import customerLogo from "~/assets/customerLogo.png"
import Marker from "~/assets/marker.png"
import OrderTrackingSheet from "../components/OrderTrackingSheet" 

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const OrderTracking = ({route}) => {
 
    const {vendorContactNo, vendorName, customerCoordinates} = route.params;  // get customer data from navigation params
    const [direction, setDirection] = useState({});
    const [vendorCoordinates, setVendorCoordinates] = useState([]);
  

  useEffect(()=>{
   
    const fetchDircections = async ()=>{
      getVendorCoordinates(vendorContactNo, setVendorCoordinates);
      const newDirection = await getDirections(customerCoordinates, vendorCoordinates);
      setDirection(newDirection);
    };

    fetchDircections();
  },[])

  return (
    <View style={styles.container}>
      {/* Map View */}
      
      <MapView style={styles.map} styleURL="mapbox://styles/mapbox/dark-v11">
        <Camera followZoomLevel={15} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        <ShapeSource 
          id="scooters" 
          cluster
          shape={featureCollection([point(vendorCoordinates)])} 
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
        vendorName={vendorName} 
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
