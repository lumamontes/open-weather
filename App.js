import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import api from './services/api';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/inter';
import moment from 'moment';

export default function App() {
  const [location, setLocation] = useState(null);
  const [timedate, setCurrentTimedate] = useState('');
  var date = null;
  const [errorMsg, setErrorMsg] = useState({});
  const [weatherData, setWeatherData] = useState({});
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg({
          error: true,
          message: 'Permission to access location was denied'
        });
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if (location) {
        try {
          const response = await api.get(`onecall?lat=${location.coords.latitude}&lon=${location.coords.latitude}&exclude=alerts,daily,hourly&lang=pt_br&units=metric&appid=5870373f40d712542ca612cae678dcf6`)
          setWeatherData(response.data.current);
        } catch (error) {
          console.log(error);
        }
      }
      var date = moment().format('LLLL');
      setCurrentTimedate(date);
    })();
  }, []);
  let background_img = '';
  var current_date = new Date()
  var current_hour = current_date.getHours()
  if (current_hour >= 0 && current_hour < 12) {
    //dia
    background_img = { uri: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }
  } else if (current_hour >= 12 && current_hour <= 18) {
    //tarde
    background_img = 'https://images.pexels.com/photos/2386144/pexels-photo-2386144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'

  } else {
    //noite
    background_img = { uri: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }
  }
  moment.locale('pt-br');

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode="cover" style={styles.image} source={background_img}>

        {weatherData.weather && (
          <>
            <View style={styles.container}>
              <Text style={styles.timedate_text} >{timedate}</Text>
              <Image
                style={styles.icon}
                source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
              />
            </View>
            <Text style={styles.temperature}>{weatherData.temp}°c</Text>
            <View style={styles.container}>
              <Text style={styles.temperature_infos}>Sensação térmica: {weatherData.feels_like}°c</Text>
              <Text style={styles.temperature_infos}>{weatherData.weather[0].description}</Text>
            </View>
          </>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 150,
    height: 150,
  },
  temperature: {
    color: '#FFF',
    fontSize: 85,
    fontFamily: 'Lato_400Regular',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    color: '#FFF',
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  temperature_infos: {
    color: '#FFF',
    fontSize: 24,
  },
  timedate_text: {
    fontSize: 20,
    color: "#FFF",
  }
});
