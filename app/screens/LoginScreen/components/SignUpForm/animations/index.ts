import { TSignUpState } from "app/hooks/useSignUp"
import { spacing } from "app/theme"
import { useEffect, useMemo } from "react"
import { Animated } from "react-native"

export const animWidth = (currentStep: number) => {
  const animation = useMemo(() => new Animated.Value(100), [])

  const animatedWidth = animation.interpolate({
    inputRange: [72, 100],
    outputRange: ["72%", "100%"],
  })

  useEffect(() => {
    if (currentStep !== 0) {
      Animated.timing(animation, {
        toValue: 72,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(animation, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
  }, [currentStep])

  return animatedWidth
}

export const animCarouselHeight = (currentStep: number, signUpSnapshot: TSignUpState) => {
  const heightCarousel = useMemo(() => new Animated.Value(spacing.SIGN_UP_FORM_MIN_HEIGHT), [])
  useEffect(() => {
    if (currentStep === 2) {
      let tmpHeight = spacing.SIGN_UP_FORM_MIN_HEIGHT
      if (signUpSnapshot?.validateUsername) {
        tmpHeight += spacing.s9
      }
      if (signUpSnapshot?.validateFirstName || signUpSnapshot?.validateLastName) {
        tmpHeight += spacing.s9
      }
      if (signUpSnapshot?.validateDob) {
        tmpHeight += spacing.s9
      }

      Animated.timing(heightCarousel, {
        toValue: tmpHeight,
        duration: 200,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(heightCarousel, {
        toValue: spacing.SIGN_UP_FORM_MIN_HEIGHT,
        duration: 200,
        delay: 300,
        useNativeDriver: false,
      }).start()
    }
  }, [currentStep, signUpSnapshot])

  return heightCarousel
}
