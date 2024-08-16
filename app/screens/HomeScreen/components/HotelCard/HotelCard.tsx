import React from "react"
import { styled } from "nativewind"
import { colors } from "app/theme"
import { Dimensions, Pressable, StyleSheet, Image, View } from "react-native"
import { Icon, Text } from "app/components/core"
import { translate } from "app/i18n"

const { width } = Dimensions.get("screen")

const StyledPressable = styled(Pressable)
const StyledView = styled(View)
const StyledImage = styled(Image)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)

const HotelCard = ({ hotel, navigation }: { hotel: TBranchResponse; navigation: any }) => {
  const { max_price, min_price, name, province_city } = hotel.data
  return (
    <StyledPressable
      className="flex items-center justify-center mb-4"
      onPress={() => navigation.navigate("BranchDetails", hotel)}
    >
      <StyledView className="rounded-xl p-3" style={styles.card}>
        <StyledImage
          className="rounded-lg"
          source={{ uri: hotel.file.get_url }}
          style={styles.cardStyledImage}
        />
        <StyledView style={{ marginTop: 10 }}>
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <StyledView className="max-w-[200px] flex flex-col items-start justify-center -mt-2">
              <StyledText className="text-lg font-bold" ellipsizeMode="tail" numberOfLines={1}>
                {name}
              </StyledText>
              <StyledView className="flex-row items-start space-x-1">
                <StyledIcon icon="location" size={16} color={colors.palette.grey} />
                <StyledText
                  className="text-gray-700 text-xs"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {province_city}
                </StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="flex flex-col items-end justify-center">
              <StyledView className="flex-row items-end">
                <StyledText className="text-gray-400 text-xs line-through">
                  {max_price} {translate("homeScreen.featuredRow.allHotels.currency")}
                </StyledText>
              </StyledView>
              <StyledView className="flex-row items-end">
                <StyledText className="text-primary-dominant font-semibold">
                  {min_price} {translate("homeScreen.featuredRow.allHotels.currency")}
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledPressable>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  profileStyledImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: colors.palette.light,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: colors.palette.dark,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: "center",
    backgroundColor: colors.palette.light,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardStyledImage: {
    height: 140,
    borderRadius: 10,
    width: "100%",
  },
  optionListsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    height: 240,
    backgroundColor: colors.palette.light,
    elevation: 10,
    width: width - 40,
    shadowColor: colors.palette.neutral800,
  },
  cardStyledImage: {
    width: "100%",
    height: 150,
  },
  facility: { flexDirection: "row", marginRight: 15 },
  facilityStyledText: { marginLeft: 5, color: colors.palette.grey },
})

export default HotelCard
