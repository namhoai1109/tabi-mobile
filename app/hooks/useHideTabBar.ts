import { spacing } from "app/theme"
import { useEffect, useMemo } from "react"
import { Animated } from "react-native"
import { proxy, useSnapshot } from "valtio"

export const UP_DIRECTION = "up"
export const DOWN_DIRECTION = "down"

export const hideTabBarState = proxy({
  isHidden: false,
})

export const useHideTabBar = () => {
  return useSnapshot(hideTabBarState)
}

export const useHandleScroll = (direction: string) => {
  useEffect(() => {
    if (direction === DOWN_DIRECTION) {
      hideTabBarState.isHidden = true
    } else if (direction === UP_DIRECTION) {
      hideTabBarState.isHidden = false
    }
  }, [direction])
}

export const animTabBar = (hidden: boolean) => {
  const heightTabBar = useMemo(() => new Animated.Value(0), [])
  const animTabBar = heightTabBar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spacing.s17],
  })

  useEffect(() => {
    if (hidden) {
      Animated.timing(heightTabBar, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(heightTabBar, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [hideTabBarState.isHidden])

  return animTabBar
}
