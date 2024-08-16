import BookingItem from "app/components/common/BookingItem"
import BookingItemSkeleton from "app/components/common/BookingItemSkeleton"
import { Header, Screen } from "app/components/core"
import { TAppStackScreenProps } from "app/navigators"
import { useGetBookingHistoryList } from "app/services/booking/services"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import React, { FC } from "react"
import { FlatList } from "react-native"

const StyledFlatList = styled(FlatList)

interface IBookingHistoryScreenProps extends TAppStackScreenProps<"BookingHistoryScreen"> {}

const BookingHistoryScreen: FC<IBookingHistoryScreenProps> = function BookingHistoryScreen({
  navigation,
}) {
  const { data, isFetching, fetchNextPage } = useGetBookingHistoryList()

  const pages = data?.pages || []
  const historyData = pages.flatMap((page) => page.data)
  const total = data?.pages[0]?.total || 0
  const currentPage = historyData.length / 10 || 1

  const handleEndReached = () => {
    if (historyData.length < total) {
      fetchNextPage({ pageParam: currentPage + 1 })
    }
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      style={{
        paddingBottom: spacing.s23,
        backgroundColor: colors.palette.neutral100,
      }}
    >
      <Header
        leftIcon="back"
        onLeftPress={() => {
          navigation.goBack()
        }}
        titleTx="bookingDetailsScreen.bookingHistory"
        titleMode="center"
        style={{
          height: spacing.s11,
          borderBottomWidth: 2,
          borderBottomColor: colors.palette.neutral200,
        }}
      />
      <StyledFlatList
        data={historyData}
        bounces={true}
        showsVerticalScrollIndicator={false}
        className="bg-white h-full"
        onEndReached={handleEndReached}
        ListFooterComponent={() => isFetching && <BookingItemSkeleton />}
        onEndReachedThreshold={1}
        renderItem={({ item }) => {
          const booking = item as TBookingListResponse
          return (
            <BookingItem
              key={booking.data.id}
              data={booking.data}
              imageSource={{ uri: booking.file.get_url || "" }}
              onPress={() => {
                navigation.navigate("BookingDetailScreen", {
                  data: booking,
                })
              }}
            />
          )
        }}
      />
    </Screen>
  )
}

export default BookingHistoryScreen
