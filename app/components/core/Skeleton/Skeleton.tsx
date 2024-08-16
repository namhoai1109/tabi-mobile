import { colors } from "app/theme"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, ViewStyle } from "react-native"

interface ISkeletonProps {
  width:
    | number
    | "auto"
    | `${number}%`
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<Animated.AnimatedNode>
    | null
    | undefined
  height:
    | number
    | "auto"
    | `${number}%`
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<Animated.AnimatedNode>
    | null
    | undefined
  borderRadius:
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<Animated.AnimatedNode>
    | undefined
  style?: ViewStyle
}

const Skeleton = ({ width, height, borderRadius, style: $styleOverride }: ISkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3))

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 0.8,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ]),
    ).start()
  }, [opacity])

  return (
    <Animated.View
      style={[
        { opacity: opacity.current, height, width, borderRadius },
        styles.skeleton,
        $styleOverride,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.palette.neutral300,
  },
})

export default Skeleton
