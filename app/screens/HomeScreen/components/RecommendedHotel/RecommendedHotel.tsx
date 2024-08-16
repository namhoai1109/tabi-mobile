import { IconFill } from "@ant-design/icons-react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Icon } from "app/components/core"
import { translate } from "app/i18n"
import { TAppStackParamList } from "app/navigators"
import { colors } from "app/theme"
import { styled } from "nativewind"
import React from "react"
import { Text, TouchableWithoutFeedback, View, Image, ViewStyle } from "react-native"

const StyledTouchableWithoutFeedback = styled(TouchableWithoutFeedback)
const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledIconFill = styled(IconFill)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)

function RecommendedHotel({ branch, image }: { branch: TPublicBranch; image: TFileResponse }) {
  const navigation = useNavigation<NativeStackNavigationProp<TAppStackParamList>>()
  return (
    <StyledTouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("BranchDetails", {
          data: branch,
          file: image,
        })
      }
    >
      <StyledView className="w-56 m-2 mr-6 mb-4 bg-white rounded-xl" style={$rhcShadowStyle}>
        <StyledImage
          className="w-full h-36 rounded-t-xl cover-full"
          source={{ uri: image.get_url }}
        />
        <StyledView className="w-full px-3 pb-4 space-y-1 rounded-b-3xl">
          <StyledText className="text-lg font-bold pt-2" ellipsizeMode="tail" numberOfLines={1}>
            {branch.name}
          </StyledText>
          <StyledView className="flex-row items-center space-x-1">
            <StyledIconFill className="w-4 h-4 text-yellow-400" name="star"></StyledIconFill>
            <StyledText className="text-xs">
              <StyledText className="text-green-700">
                {branch.star_level ? branch.star_level.toFixed(1) : 0}
              </StyledText>
              {" · "}
              <StyledText className="text-gray-700">
                {branch.review_quantity ? branch.review_quantity : 0} review
                {branch.review_quantity && branch.review_quantity > 1 && "s"}
              </StyledText>
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-center space-x-1">
            <StyledIcon icon="location" size={16} color={colors.palette.grey} />
            <StyledText className="text-gray-700 text-xs line-clamp-1">
              {branch.province_city}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-center space-x-1">
            <StyledText className="text-gray-400 text-xs line-through">
              {branch.max_price}{" "}
              {translate("homeScreen.featuredRow.recommendedHotels.hotelCard.currency")}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row items-center space-x-1">
            <StyledText className="text-primary-dominant font-semibold">
              {branch.min_price}{" "}
              {translate("homeScreen.featuredRow.recommendedHotels.hotelCard.currency")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableWithoutFeedback>
  )
}

const $rhcShadowStyle: ViewStyle = {
  elevation: 4,
  shadowColor: colors.palette.neutral800,
  shadowRadius: 7,
  shadowOffset: {
    width: 0,
    height: 2,
  },
}

export default RecommendedHotel
