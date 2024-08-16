import React, { FC, useEffect, useRef, useState } from "react"
import { Icon, Text } from "../../components/core"
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Animated,
} from "react-native"
import Svg, { G, Circle } from "react-native-svg"
import { colors } from "app/theme/colors"
import { styled } from "nativewind"
import { SafeAreaView } from "react-native-safe-area-context"
import { getLocale } from "app/i18n"
import { TAppStackScreenProps } from "app/navigators"
import { useSurveyState } from "app/hooks/useSurveyState"
import { useCreateUserSurvey } from "app/services/survey/services"

import { slides } from "./slides"

const StyledImage = styled(Image)
const StyledText = styled(Text)
const StyledIcon = styled(Icon)
const StyledView = styled(View)
const StyledFlatList = styled(FlatList)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledSafeAreaView = styled(SafeAreaView)
const StyledAnimatedView = styled(Animated.View)

interface ISurveyScreenProps extends TAppStackScreenProps<"SurveyScreen"> {}
const SurveyScreen: FC<ISurveyScreenProps> = function SurveyScreen({ navigation }) {
  const locale = getLocale()
  const isEn = locale === "en-US"

  const { locationTypes, activities, preferredSeasons } = useSurveyState()
  const { mutate } = useCreateUserSurvey(() => navigation.goBack())

  const { width } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [percentage, setPercentage] = useState(25)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<FlatList<any>>(null)

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index)
  }).current
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const srollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current!.scrollToIndex({ index: currentIndex + 1 })
    } else {
      let locationTypesString = ""
      let activitiesString = ""
      let seasonsString = ""
      if (locationTypes.length === 0) {
        locationTypesString = "Indoors, Food & beverages"
      } else {
        for (let i = 0; i < locationTypes.length; i++) {
          locationTypesString += locationTypes[i].en
          if (i < locationTypes.length - 1) {
            locationTypesString += ", "
          }
        }
      }
      if (activities.length === 0) {
        activitiesString = ""
      } else {
        for (let i = 0; i < activities.length; i++) {
          activitiesString += activities[i].en
          if (i < activities.length - 1) {
            activitiesString += ", "
          }
        }
      }
      if (preferredSeasons.length === 0) {
        seasonsString = ""
      } else {
        for (let i = 0; i < preferredSeasons.length; i++) {
          seasonsString += preferredSeasons[i].en
          if (i < preferredSeasons.length - 1) {
            seasonsString += ", "
          }
        }
      }
      mutate({
        place_type: locationTypesString,
        activities: activitiesString,
        seasons: seasonsString,
      })
    }
  }

  const size = 128
  const strokeWidth = 2
  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  const progressAnimation = useRef(new Animated.Value(0)).current
  const progressRef = useRef(null)

  const animation = (toValue: any) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    setPercentage((currentIndex + 1) * (100 / slides.length))
    animation((currentIndex + 1) * (100 / slides.length))
  }, [currentIndex])

  useEffect(() => {
    progressAnimation.addListener((value) => {
      const strokeDashoffset = circumference - (circumference * value.value) / 100
      if (progressRef.current) {
        ;(progressRef.current as Circle).setNativeProps({
          strokeDashoffset,
        })
      }
    })
    return () => {
      progressAnimation.removeAllListeners()
    }
  }, [percentage])

  return (
    <StyledSafeAreaView className="w-full h-full bg-white">
      <StyledView style={[styles.slidesContainer]}>
        <StyledFlatList
          data={slides}
          renderItem={({ item }) => {
            const slideItem = item as TSlide
            return (
              <StyledView style={[styles.container, { width }]}>
                <StyledImage
                  className="w-80 h-40 mb-10 object-cover rounded-lg"
                  source={slideItem.image}
                />
                <StyledView style={[styles.textWrapper]}>
                  <StyledText style={[styles.title]}>
                    {isEn ? slideItem.title : slideItem.titleVi}
                  </StyledText>
                  <StyledText style={[styles.description]}>
                    {isEn ? slideItem.description : slideItem.descriptionVi}
                  </StyledText>
                </StyledView>
                {slideItem.component && <slideItem.component />}
              </StyledView>
            )
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => {
            const slideItem = item as TSlide
            return `survey_${slideItem.id}`
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { x: scrollX } },
              },
            ],
            {
              useNativeDriver: false,
            },
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </StyledView>
      <StyledView className="w-full h-16 flex flex-row items-center justify-center">
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 25, 10],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })
          return (
            <StyledAnimatedView
              style={[{ width: dotWidth, opacity }]}
              className="h-3 rounded-md mx-2 bg-primary-dominant"
              key={i}
            />
          )
        })}
      </StyledView>
      <StyledView className="w-full flex items-center justify-center">
        <Svg width={size} height={size}>
          <G rotation="-90" origin={center}>
            <Circle
              stroke={colors.palette.greyLighter}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              ref={progressRef}
              stroke={colors.palette.primaryDominant}
              fill="white"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
            />
          </G>
        </Svg>
        <StyledTouchableOpacity onPress={srollTo} style={styles.button} activeOpacity={0.6}>
          <StyledIcon icon="caretRight" size={32} color={colors.palette.primaryDominant} />
        </StyledTouchableOpacity>
      </StyledView>
    </StyledSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  slidesContainer: {
    height: 650,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textWrapper: {
    display: "flex",
  },
  title: {
    height: 28,
    fontWeight: "800",
    fontSize: 26,
    marginBottom: 10,
    color: colors.palette.primaryDominantDark,
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: colors.palette.primaryDominant,
    textAlign: "center",
    paddingHorizontal: 64,
  },
  button: {
    position: "absolute",
    borderRadius: 100,
    padding: 20,
  },
})

export default SurveyScreen
