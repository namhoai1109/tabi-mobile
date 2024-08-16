import React, { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { Icon, Text } from "app/components/core"
import { styled } from "nativewind"
import { accommodationTypeEn, accommodationTypeVi } from "app/constants/accommodationTypes"
import { colors } from "app/theme"

const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledView = styled(View)
const StyledScrollView = styled(ScrollView)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface TAccommodationTypes {
  isEn: boolean
}

function AccommodationTypes({ isEn }: TAccommodationTypes) {
  const [accommodationType, setAccommodationType] = useState(accommodationTypeEn)
  const [activeAccommodationType, setActiveAccommodationType] = useState(-1)

  useEffect(() => {
    if (isEn) {
      setAccommodationType(accommodationTypeEn)
    } else {
      setAccommodationType(accommodationTypeVi)
    }
  }, [isEn])

  return (
    <StyledView className="mt-3">
      <StyledScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible pl-4"
      >
        {accommodationType?.map((act) => {
          if (act.children && Array.isArray(act.children)) {
            return act.children.map((actChild) => {
              const isActive = actChild.id === activeAccommodationType
              const btnClass = isActive
                ? "w-14 h-14 flex items-center justify-center p-1 rounded-full shadow bg-primary-dominant"
                : "w-14 h-14 flex items-center justify-center p-1 rounded-full shadow bg-white"
              const textClass = isActive
                ? "overflow-ellipsis font-semibold text-gray-900"
                : "overflow-ellipsis text-gray-600"
              return (
                <StyledView
                  key={actChild.id}
                  className="min-w-[90px] max-w-[90px] flex flex-col justify-center items-center mr-4"
                >
                  <StyledTouchableOpacity
                    onPress={() => setActiveAccommodationType(actChild.id)}
                    style={$shadowStyle}
                    className={btnClass}
                  >
                    <StyledIcon
                      icon="hotel"
                      size={16}
                      color={isActive ? "white" : colors.palette.neutral600}
                    />
                  </StyledTouchableOpacity>
                  <StyledText
                    className={textClass}
                    size="xxs"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {actChild.label}
                  </StyledText>
                </StyledView>
              )
            })
          }
          return null
        })}
      </StyledScrollView>
    </StyledView>
  )
}

const $shadowStyle: ViewStyle = {
  elevation: 4,
  shadowColor: colors.palette.neutral600,
  shadowRadius: 7,
  shadowOffset: {
    width: 0,
    height: 2,
  },
}
export default AccommodationTypes
