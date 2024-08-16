import { ReactNode, useEffect } from "react"
import React, { Animated } from "react-native"

interface IFadeViewProps {
  children: ReactNode
}

function FadeView({ children }: IFadeViewProps) {
  const fade = new Animated.Value(0)
  const opacity = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })
  const translateY = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  })

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [])

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  )
}

export default FadeView
