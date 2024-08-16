import * as React from "react"
import { Animated, StyleSheet, Dimensions, Image } from "react-native"
import Constants from "expo-constants"
import { colors } from "app/theme"
import { styled } from "nativewind"

const { height } = Dimensions.get("window")
const φ = (1 + Math.sqrt(5)) / 2

export const MIN_HEADER_HEIGHT = 64 + Constants.statusBarHeight
export const MAX_HEADER_HEIGHT = height * (1 - 1 / φ)
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT

interface AccountProfileImageProps {
  profile: TMeResponse | undefined
  y: Animated.Value
}

const StyledImage = styled(Image)

export default ({ y, profile }: AccountProfileImageProps) => {
  const scale = y.interpolate({
    inputRange: [-MAX_HEADER_HEIGHT, 0],
    outputRange: [4, 1],
    extrapolate: "clamp",
  })
  const opacity = y.interpolate({
    inputRange: [-64, 0, HEADER_DELTA],
    outputRange: [0, 0.2, 1],
    extrapolate: "clamp",
  })
  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <StyledImage
        style={styles.image}
        source={require("../../../../../assets/images/guest.png")}
      />
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.palette.baseBgLight,
          opacity,
        }}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: MAX_HEADER_HEIGHT,
    alignContent: "center",
  },
  image: {
    objectFit: "cover",
    position: "absolute",
    width: "100%",
    height: MAX_HEADER_HEIGHT + 25,
  },
})
