import React, { FC } from "react"
import { Icon, Screen, Text } from "../../components/core"
import { TTabiTabScreenProps } from "app/navigators/TabiNavigator"
import { TouchableOpacity, View, ViewStyle, FlatList } from "react-native"
import { colors } from "app/theme/colors"
import { IconOutline } from "@ant-design/icons-react-native"
import { styled } from "nativewind"
// import AccommodationTypes from "./components/AccommodationTypes"
import FeaturedRow from "./components/FeaturedRow"
import { useGetFeaturedBranches, useGetRecommendedBranches } from "app/services/branch/services"
import { useGetSearchState } from "app/hooks/useSearch"
import HotelCard from "./components/HotelCard"
import { getLocale, translate } from "app/i18n"
import SkeletonHotelList from "./components/SkeletonHotelList"
import { formatDateStringForCalendarPickerPlaceholder } from "app/utils/formatDate"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuthentication } from "app/hooks/useAuthentication"
import { spacing } from "app/theme"

const StyledText = styled(Text)
const StyledIcon = styled(Icon)
const StyledIconOutline = styled(IconOutline)
const StyledView = styled(View)
const StyledFlatList = styled(FlatList)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScreen = styled(Screen)

const HomeScreen: FC<TTabiTabScreenProps<"Home">> = function HomeScreen({ navigation }) {
  const locale = getLocale()
  const isEn = locale === "en-US"
  const { top } = useSafeAreaInsets()
  const searchState = useGetSearchState()

  const { id: userID } = useAuthentication()
  const { data, isFetching, fetchNextPage, refetch } = useGetRecommendedBranches(userID)
  const { data: dataFeaturedBranches } = useGetFeaturedBranches()

  const pages = data?.pages || []
  const branchData = pages.flatMap((page) => page.data)
  const total = pages[0]?.total || 0
  const currentPage = branchData.length / 10 || 1

  const handleEndReached = async () => {
    if (branchData.length < total && !isFetching) {
      const nextPage = currentPage + 1
      fetchNextPage({ pageParam: nextPage })
    }
  }

  return (
    <StyledScreen className="bg-white" preset="fixed" safeAreaEdges={["bottom", "top"]}>
      <StyledFlatList
        data={branchData || []}
        bounces={true}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={$scrollViewContentContainerStyle}
        renderItem={({ item }) => {
          return <HotelCard hotel={item as TBranchResponse} navigation={navigation} />
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={() => isFetching && <SkeletonHotelList />}
        ListHeaderComponent={
          <StyledView
            style={{
              marginTop: top + spacing.s5,
            }}
          >
            <StyledView
              className="h-56 flex flex-col items-center justify-start gap-y-5 bg-white mx-4 rounded-lg z-10"
              style={$shadowStyle}
            >
              <StyledView className="w-full flex-col items-center justify-center gap-2">
                <StyledTouchableOpacity
                  className="w-[90%] flex-row items-center p-1 border-b-2 border-b-neutral-200"
                  onPress={() => navigation.navigate("CityPickerScreen")}
                >
                  <StyledIcon icon="search" size={16} className="ml-1" />
                  <StyledText
                    className="ml-2 min-w-[80%] max-w-[80%]"
                    size="xs"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {searchState.searchText
                      ? searchState.searchText
                      : translate("homeScreen.searchEngine.searchPlaceholder")}
                  </StyledText>
                  <StyledIcon icon="crosshair" size={20} className="ml-1" />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className="w-[90%] flex-row items-center p-1 border-b-2 border-b-neutral-200"
                  onPress={() => navigation.navigate("StartDateEndDatePickerScreen")}
                >
                  <StyledIconOutline name="calendar" size={16} className="ml-1" />
                  <StyledText className="ml-2" size="xs">
                    {`${formatDateStringForCalendarPickerPlaceholder(
                      searchState.startDate,
                      isEn,
                    )} - ${formatDateStringForCalendarPickerPlaceholder(
                      searchState.endDate,
                      isEn,
                    )}`}
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className="w-[90%] flex-row items-center p-1 border-b-2 border-b-neutral-200"
                  onPress={() => navigation.navigate("RoomScreen")}
                >
                  <StyledIcon icon="doorOpen" size={16} className="ml-1" />
                  <StyledText
                    className="ml-2"
                    size="xs"
                    text={`${searchState.roomTotals} ${translate(
                      searchState.roomTotals <= 1
                        ? "homeScreen.searchEngine.roomsPlaceholder.room"
                        : "homeScreen.searchEngine.roomsPlaceholder.rooms",
                    )}`}
                  />
                </StyledTouchableOpacity>
              </StyledView>
              <StyledTouchableOpacity
                className="w-[90%] h-8 flex items-center justify-center bg-primary-dominant rounded-md"
                onPress={() => {
                  refetch()
                  navigation.navigate("BranchList")
                }}
              >
                <StyledText size="sm" className="text-light">
                  {translate("homeScreen.searchEngine.searchButton")}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
            <StyledView>
              <FeaturedRow featureItems={dataFeaturedBranches?.data || []} />
            </StyledView>

            <StyledView className="flex flex-row justify-between items-center px-4 mt-4 mb-4">
              <StyledView>
                <StyledText className="font-bold text-lg">
                  {translate("homeScreen.featuredRow.allHotels.title")}
                </StyledText>
                <StyledText
                  className="max-w-sm text-gray-500 text-xs"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {translate("homeScreen.featuredRow.allHotels.description")}
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        }
        className="w-full mb-14"
      />
    </StyledScreen>
  )
}

const $shadowStyle: ViewStyle = {
  elevation: 2,
}

const $scrollViewContentContainerStyle: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: colors.palette.neutral100,
}
export default HomeScreen
