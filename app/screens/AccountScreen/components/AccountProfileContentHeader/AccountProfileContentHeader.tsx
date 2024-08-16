import * as React from "react"
import { Animated, StyleSheet, Dimensions } from "react-native"
import Constants from "expo-constants"
import { colors } from "app/theme"

const { height } = Dimensions.get("window")
const φ = (1 + Math.sqrt(5)) / 2

export const MIN_HEADER_HEIGHT = 64 + Constants.statusBarHeight
export const MAX_HEADER_HEIGHT = height * (1 - 1 / φ)
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT

const BUTTON_HEIGHT = 48

interface AccountProfileContentHeaderProps {
  y: Animated.Value
}

export default ({ y }: AccountProfileContentHeaderProps) => {
  const opacity = y.interpolate({
    inputRange: [HEADER_DELTA - 16, HEADER_DELTA],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })
  const textOpacity = y.interpolate({
    inputRange: [HEADER_DELTA - 8, HEADER_DELTA - 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.Text style={[styles.title, { opacity: textOpacity }]}>Trương Kim Tân</Animated.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: BUTTON_HEIGHT / 2 - MIN_HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: MIN_HEADER_HEIGHT,
    backgroundColor: colors.palette.baseBgGrey,
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "400",
  },
})
