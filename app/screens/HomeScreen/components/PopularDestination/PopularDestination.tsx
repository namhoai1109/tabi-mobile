import { translate } from "app/i18n"
import { LinearGradient } from "expo-linear-gradient"
import { styled } from "nativewind"
import React from "react"
import {
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  ImageSourcePropType,
  Animated,
} from "react-native"

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const StyledAnimatedLinearGradient = styled(AnimatedLinearGradient)
const StyledTouchableWithoutFeedback = styled(TouchableWithoutFeedback)
const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledText = styled(Text)

function PopularDestination({
  name,
  image,
  quantity,
}: {
  name: string
  image: ImageSourcePropType
  quantity: number
}) {
  return (
    <StyledTouchableWithoutFeedback>
      <StyledView>
        <StyledImage className="w-40 h-56 rounded-lg mr-2" source={image} />
        <StyledAnimatedLinearGradient
          colors={["rgba(255,255,255,0)", "rgba(245,86,108,1)"]}
          className="w-40 h-24 absolute top-32 rounded-b-lg pl-2 pt-8"
        >
          <StyledView>
            <StyledText className="text-lg font-semibold text-light mb-0.5">{name}</StyledText>
            <StyledText className="text-light">
              {quantity}+ {translate("homeScreen.featuredRow.popularDestinations.hotels")}
            </StyledText>
          </StyledView>
        </StyledAnimatedLinearGradient>
      </StyledView>
    </StyledTouchableWithoutFeedback>
  )
}

export default PopularDestination
