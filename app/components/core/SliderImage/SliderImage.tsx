import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewToken,
} from "react-native"
import React, { useMemo, useRef, useState } from "react"
import Pagination from "./Pagination"
import SlideItem from "./SliderItem"
import { styled } from "nativewind"
import { DEFAULT_HEIGHT } from "./constant"

interface ISliderImageProps {
  data: TFileResponse[]
  height?: number
}

const StyledView = styled(View)

const SliderImage = ({ data, height }: ISliderImageProps) => {
  const [index, setIndex] = useState(0)
  const scrollX = useMemo(() => new Animated.Value(0), [])
  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event)
  }

  const handleOnViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      setIndex(viewableItems[0]?.index as number)
    },
  ).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  return (
    <StyledView className="w-full">
      <FlatList
        data={data || []}
        renderItem={({ item }) => <SlideItem source={item} height={height} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={{ height: height || DEFAULT_HEIGHT }}
      />
      <Pagination data={data || []} scrollX={scrollX} index={index} />
    </StyledView>
  )
}

export default SliderImage
