import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { Ionions } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
console.log(SCREEN_WIDTH, SCREEN_HEIGHT);

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [hourly3, setHourly3] = useState([]);
  const [street, setStreet] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 4 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    setStreet(location[0].name);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setHourly3(json.list);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={{ color: "black", fontSize: 20, fontWeight: 400 }}>
          {street}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {hourly3.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color={"white"} size={"large"} />
          </View>
        ) : (
          hourly3.map((hour3, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.time}>{hour3.dt_txt.slice(0, 10)}</Text>
              <Text style={styles.time}>{hour3.dt_txt.slice(11, -3)}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH,
                  paddingLeft: 20,
                }}
              >
                <Text style={styles.temp}>{hour3.main.temp.toFixed(1)}</Text>
                <Text style={{ fontSize: 45 }}>°C</Text>

                <Fontisto
                  style={{
                    marginLeft: 55,
                  }}
                  name={icons[hour3.weather[0].main]}
                  size={50}
                  color="black"
                />
              </View>
              <Text style={styles.weatherMain}>{hour3.weather[0].main}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {},
  weatherMain: {
    fontSize: 60,
    width: SCREEN_WIDTH,
    paddingLeft: 20,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 125,
    alignItems: "top",
  },
  time: {
    fontSize: 50,
  },
});
