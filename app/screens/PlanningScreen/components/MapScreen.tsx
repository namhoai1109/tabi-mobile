import React, { useState, useEffect } from "react"
import MapView, { Marker } from "react-native-maps"
import { StyleSheet, View } from "react-native"
import MapViewDirections from "react-native-maps-directions"
import { colors } from "app/theme"

interface IMapScreenProps {
  timelineItems: TTimelineItem[]
  selectedDate: string
}

const MapScreen = ({ timelineItems, selectedDate }: IMapScreenProps) => {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }[]>([])

  useEffect(() => {
    if (timelineItems.length >= 2) {
      setCoords(
        timelineItems
          .filter((item) => item.destination) // Ensure item.destination is defined
          .map((item) =>
            item.destination
              ? {
                  latitude: parseFloat(item.destination.lat),
                  longitude: parseFloat(item.destination.lng),
                }
              : {
                  latitude: 0,
                  longitude: 0,
                },
          ),
      )
    } else {
      setCoords([])
    }
  }, [timelineItems, selectedDate])

  return (
    <View style={styles.container}>
      {timelineItems?.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(timelineItems[0]?.destination?.lat || "0.0"),
            longitude: parseFloat(timelineItems[0]?.destination?.lng || "0.0"),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {timelineItems.map(
            (item, key) =>
              item.destination && (
                <Marker
                  key={`${item.destination.id}-${key}`}
                  coordinate={{
                    latitude: parseFloat(item.destination.lat),
                    longitude: parseFloat(item.destination.lng),
                  }}
                  title={item.destination.name}
                  description={`${item.startDate.getHours()}:00 - ${
                    item.endDate.getHours() + 1
                  }:00`}
                />
              ),
          )}
          {coords.length > 1 &&
            coords.map((coord, index) => {
              if (index < coords.length - 1) {
                return (
                  <MapViewDirections
                    key={index}
                    origin={coord}
                    destination={coords[index + 1]}
                    apikey={""}
                    strokeWidth={3}
                    strokeColor={colors.palette.primaryDominant}
                  />
                )
              }
              return null
            })}
        </MapView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 48,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default MapScreen
