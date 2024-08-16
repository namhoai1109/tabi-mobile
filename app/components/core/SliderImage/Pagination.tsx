import { StyleSheet, Animated, View, Dimensions } from "react-native"
import React from "react"
import { colors } from "app/theme"
import { DOT_SIZE } from "./constant"

const { width } = Dimensions.get("screen")

interface IPaginationProps {
  data: any[]
  scrollX: Animated.Value
  index: number
}

const Pagination = ({ data, scrollX, index }: IPaginationProps) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width]

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [DOT_SIZE, DOT_SIZE * 2, DOT_SIZE],
          extrapolate: "clamp",
        })

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            colors.palette.light,
            colors.palette.primaryDominantLight,
            colors.palette.light,
          ],
          extrapolate: "clamp",
        })

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              { width: dotWidth, backgroundColor },
              idx === index && styles.dotActive,
            ]}
          />
        )
      })}
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  dot: {
    backgroundColor: colors.palette.light,
    borderRadius: 100,
    height: DOT_SIZE,
    marginHorizontal: 3,
    width: DOT_SIZE,
  },
  dotActive: {
    backgroundColor: colors.palette.primaryDominantLight,
  },
})
