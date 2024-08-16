import { Text } from "app/components/core"
import { styled } from "nativewind"
import { useEffect, useRef, useState } from "react"
import { Animated, Pressable, View } from "react-native"
import Destination from "./Destination"
import { colors } from "app/theme"

interface ITimelineItemProps {
  data: TDestination
  timelineItem: TTimelineItem
  style: any
  index: number
  onPress: () => void
  onRemoveDestination: () => void
}

const StyledView = styled(View)
const StyledAnimatedView = styled(Animated.View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)

function TimelineItem({
  style,
  data,
  timelineItem,
  index,
  onPress,
  onRemoveDestination,
}: ITimelineItemProps) {
  const haveDestination = !!data
  const animateHeight = useRef(new Animated.Value(0)).current
  const height = animateHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  })

  const animatedWidth = useRef(new Animated.Value(1)).current
  const width = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  })

  const animatedWidthButton = useRef(new Animated.Value(0)).current
  const widthButton = animatedWidthButton.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 90],
  })

  const [isShow, setIsShow] = useState(false)
  const [isRemove, setIsRemove] = useState(false)
  const onClose = (isRemove: boolean) => {
    Animated.timing(animateHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(animatedWidth, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(animatedWidthButton, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (isRemove) {
        onRemoveDestination()
        setIsRemove(false)
      }
    })
  }

  const onOpen = () => {
    Animated.timing(animateHeight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(animatedWidth, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(animatedWidthButton, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    if (haveDestination) {
      if (isShow) {
        onOpen()
      } else {
        onClose(isRemove)
      }
    }
  }, [isShow])

  return (
    <StyledPressable
      className="p-2"
      style={{
        ...style,
        backgroundColor: colors.palette.primaryDominantLighter,
      }}
      onPress={() => {
        if (haveDestination) {
          setIsShow(!isShow)
        }
      }}
    >
      <StyledView className="w-full flex flex-col items-start justify-between">
        {haveDestination && (
          <StyledView className="w-full flex flex-row items-start justify-between">
            <StyledAnimatedView
              className="flex items-start justify-start"
              style={{
                width,
                height: 24,
              }}
            >
              <StyledText>
                {timelineItem?.startDate?.getHours()}:00 - {timelineItem?.endDate.getHours() + 1}:00
              </StyledText>
            </StyledAnimatedView>
            <StyledAnimatedView
              className="px-1 h-[22px] rounded-md bg-primary-dominant flex items-center justify-center"
              style={{
                width: widthButton,
              }}
              onTouchEnd={() => {
                setIsShow(false)
                setIsRemove(true)
              }}
            >
              <StyledText className="text-white leading-5" tx="planningScreen.remove" />
            </StyledAnimatedView>
          </StyledView>
        )}
        {haveDestination && timelineItem.timeDifference === 1 && (
          <StyledView className="w-full flex flex-col items-start justify-center">
            <StyledText className="font-bold">{data.name}</StyledText>
            <StyledText size="xs" numberOfLines={1}>
              {data.location}
            </StyledText>
          </StyledView>
        )}
      </StyledView>
      {haveDestination && timelineItem.timeDifference >= 2 && (
        <StyledView className="-mx-2">
          <Destination
            destination={data as TDestination}
            onPress={() => {
              if (haveDestination) {
                setIsShow(!isShow)
              }
            }}
          />
        </StyledView>
      )}
    </StyledPressable>
  )
}

export default TimelineItem
