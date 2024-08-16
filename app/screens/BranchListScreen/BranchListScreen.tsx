import React, { FC } from "react"
import { Icon, Text } from "app/components/core"
import { TAppStackScreenProps } from "app/navigators"
import { styled } from "nativewind"
import { View, ViewStyle, TouchableOpacity, Animated, FlatList } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import HotelCard from "../HomeScreen/components/HotelCard"
import SkeletonHotelList from "../HomeScreen/components/SkeletonHotelList"
import { useGetBranchList } from "app/services/branch/services"
import { colors, spacing } from "app/theme"
import {
  calculateDurationInDays,
  formatDateStringForCalendarPickerPlaceholder,
} from "app/utils/formatDate"
import { useGetSearchState } from "app/hooks/useSearch"
import { getLocale, translate } from "app/i18n"

const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledAnimatedView = styled(Animated.View)
const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledFlatList = styled(FlatList)
const StyledText = styled(Text)
const StyledSafeAreaView = styled(SafeAreaView)

const BRANCH_PAGE_LIMIT = 10

interface IBranchListScreenProps extends TAppStackScreenProps<"BranchList"> {}

const BranchListScreen: FC<IBranchListScreenProps> = function BranchListScreen({ navigation }) {
  const locale = getLocale()
  const isEn = locale === "en-US"
  const { top } = useSafeAreaInsets()

  const searchState = useGetSearchState()
  const duration = calculateDurationInDays(searchState.startDate, searchState.endDate)
  const { data, isFetching, fetchNextPage, refetch } = useGetBranchList({
    l: BRANCH_PAGE_LIMIT,
    searchText: searchState.searchText,
    startDate: searchState.startDate,
    endDate: searchState.endDate,
    occupants: searchState.roomTotals,
  } as TPublicBranchListParams)

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

  const StickyHeader = () => {
    return (
      <StyledAnimatedView
        className="pl-4 bg-primary-dominant flex flex-row items-center justify-start gap-4 mb-4"
        style={[
          {
            paddingTop: top + spacing.s4,
            paddingBottom: spacing.s3,
          },
        ]}
      >
        <StyledTouchableOpacity
          onPress={() => {
            refetch()
            navigation.goBack()
          }}
          className="rounded-full flex items-center justify-start"
        >
          <StyledIcon icon="back" size={20} color={colors.palette.light} />
        </StyledTouchableOpacity>
        <StyledView className="flex flex-col items-start justify-start">
          <StyledText size="md" className="font-bold text-light">
            {translate("branchListScreen.header.hotels")} - {duration}{" "}
            {`${translate(
              duration <= 1 ? "branchListScreen.header.day" : "branchListScreen.header.days",
            )}`}
          </StyledText>
          <StyledText size="xxs" className="text-light">
            {`${formatDateStringForCalendarPickerPlaceholder(searchState.startDate, isEn)}, ${
              searchState.roomTotals
            } ${translate(
              searchState.roomTotals <= 1
                ? "branchListScreen.header.room"
                : "branchListScreen.header.rooms",
            )}`}
          </StyledText>
        </StyledView>
      </StyledAnimatedView>
    )
  }
  return (
    <StyledSafeAreaView edges={["bottom"]} className="bg-white w-full h-full">
      <StyledFlatList
        bounces={true}
        data={branchData || []}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={$scrollViewContentContainerStyle}
        // keyExtractor={(item: any) => String("branchlistscreen_" + item.data.id)}
        renderItem={({ item }) => {
          console.log(item)
          return <HotelCard hotel={item as TBranchResponse} navigation={navigation} />
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={() => {
          if (isFetching) {
            return <SkeletonHotelList />
          }

          if (branchData.length === 0 && !isFetching) {
            return (
              <StyledView className="w-full flex flex-col items-center justify-start">
                <Icon icon="emptyFolder" size={spacing.s18} />
                <StyledText tx="branchListScreen.emptyData" className="text-center w-2/3" />
              </StyledView>
            )
          }
          return undefined
        }}
        ListHeaderComponent={<StickyHeader />}
        stickyHeaderIndices={[0]}
      />
    </StyledSafeAreaView>
  )
}

const $scrollViewContentContainerStyle: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: colors.palette.neutral100,
}

export default BranchListScreen
