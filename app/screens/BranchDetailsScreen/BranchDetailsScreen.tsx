import React, { FC, useRef, useState } from "react"
import { useRoute } from "@react-navigation/native"
import { Icon, Screen, Text } from "app/components/core"
import { TAppStackScreenProps } from "app/navigators"
import { styled } from "nativewind"
import {
  View,
  Image,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native"
import Amenities from "./components/Amenities"
import Description from "./components/Description"
import Overview from "./components/Overview"
import Policies from "./components/Policies"
import Rooms from "./components/Rooms"
import { useGetBranchById, useGetBranchRoomList } from "app/services/branch/services"
import { colors } from "app/theme/colors"
import { translate } from "app/i18n"
import RatingList from "./components/RatingList"

const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledSafeAreaView = styled(SafeAreaView)
const StyledAnimatedView = styled(Animated.View)
const StyledView = styled(View)
const StyledAnimatedScrollView = styled(Animated.ScrollView)
const StyledScrollView = styled(ScrollView)
const StyledImage = styled(Image)
const StyledIcon = styled(Icon)
const StyledText = styled(Text)

const HEADER_MAX_HEIGHT = 135
const HEADER_MIN_HEIGHT = 0
const Scroll_Distance = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const HEADER_TITLE_MAX_HEIGHT = 110
const HEADER_TITLE_MIN_HEIGHT = 0

const SUB_HEADER_MAX_HEIGHT = 40
const SUB_HEADER_MIN_HEIGHT = 0

const ROOM_LIST_LIMIT = 10

const scrollToItems = [
  { key: "Overview", name: translate("branchDetailsScreen.scrollToItems.Overview") },
  { key: "Reviews", name: translate("branchDetailsScreen.scrollToItems.Reviews") },
  { key: "Amenities", name: translate("branchDetailsScreen.scrollToItems.Amenities") },
  { key: "Location", name: translate("branchDetailsScreen.scrollToItems.Location") },
  { key: "Description", name: translate("branchDetailsScreen.scrollToItems.Description") },
  { key: "Policies", name: translate("branchDetailsScreen.scrollToItems.Policies") },
  { key: "Rooms", name: translate("branchDetailsScreen.scrollToItems.Rooms") },
  { key: "Scroll to top", name: translate("branchDetailsScreen.scrollToItems.ScrollToTop") },
]

interface IBranchDetailsScreenProps extends TAppStackScreenProps<"BranchDetails"> {}
const BranchDetailsScreen: FC<IBranchDetailsScreenProps> = function BranchDetailsScreen({
  navigation,
}) {
  const { params } = useRoute()

  let branchDetailsParam: any = params
  const { data: dataBranchDetails, isFetching: isFetchingBranchDetails } = useGetBranchById(
    branchDetailsParam?.data?.id,
  )
  const {
    data: dataBranchRoomList,
    isFetching,
    fetchNextPage,
  } = useGetBranchRoomList({
    l: ROOM_LIST_LIMIT,
    branch_id: branchDetailsParam?.data?.id,
  } as TPublicBranchRoomListParams)

  const pages = dataBranchRoomList?.pages || []
  const roomData = pages.flatMap((page) => page.data)
  const total = dataBranchRoomList?.pages[0]?.total || 0
  const currentPage = roomData.length / 10 || 1

  const handleEndReached = () => {
    if (roomData.length < total && !isFetching) {
      const nextPage = currentPage + 1
      fetchNextPage({ pageParam: nextPage })
    }
  }

  const scrollOffsetY = useRef(new Animated.Value(0)).current
  const scrollRef = useRef<ScrollView>(null)
  const [dataSourceCords, setDataSourceCords] = useState<{ [key: string]: number }>({})
  const ratings = dataBranchDetails?.data?.ratings || []

  const $paddingTop = scrollOffsetY.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [0, 0],
    extrapolate: "clamp",
    easing: Easing.linear,
  })

  const DynamicHeader = ({ value, dataSourceCords }: any) => {
    const scrollRefSubHeader = useRef<ScrollView>(null)
    const scrollOffsetX = useRef(new Animated.Value(0)).current

    const [activeScrollToItem, setActiveScrollToItem] = useState("Overview")
    const [dataSubHeaderCords, setDataSubHeaderCords] = useState<{ [key: string]: number }>({})

    const animatedHeaderHeight = value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT],
      extrapolate: "clamp",
      easing: Easing.linear,
    })

    const animatedHeaderTitleHeight = value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [HEADER_TITLE_MIN_HEIGHT, HEADER_TITLE_MAX_HEIGHT],
      extrapolate: "clamp",
      easing: Easing.linear,
    })

    const animatedSubHeaderHeight = value.interpolate({
      inputRange: [0, Scroll_Distance],
      outputRange: [SUB_HEADER_MIN_HEIGHT, SUB_HEADER_MAX_HEIGHT],
      extrapolate: "clamp",
      easing: Easing.linear,
    })

    return (
      <Animated.View
        style={[
          {
            height: animatedHeaderHeight,
          },
        ]}
      >
        <StyledView className="bg-light">
          <StyledAnimatedView
            className="pl-4 bg-primary-dominant flex flex-row items-end justify-start gap-4 pb-3"
            style={[
              {
                height: animatedHeaderTitleHeight,
              },
            ]}
          >
            <StyledTouchableOpacity
              onPress={() => navigation.goBack()}
              className="rounded-full flex items-center justify-start pb-4"
            >
              <StyledIcon icon="back" size={20} color={colors.palette.textLight} />
            </StyledTouchableOpacity>
            <StyledView className="flex flex-col items-start justify-start">
              <StyledText size="md" className="font-bold text-light">
                {dataBranchDetails?.data?.branch_name}
              </StyledText>
              <StyledText size="xxs" className="text-light">
                District {dataBranchDetails?.data?.district},{" "}
                {dataBranchDetails?.data?.province_city}
              </StyledText>
            </StyledView>
          </StyledAnimatedView>
        </StyledView>
        <StyledAnimatedView
          className="bg-light"
          style={[
            {
              height: animatedSubHeaderHeight,
              ...$shadowStyle,
            },
          ]}
        >
          <StyledScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="overflow-visible pl-4 border-b-2 border-neutral-100"
            scrollEventThrottle={1}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollOffsetX } } }], {
              useNativeDriver: false,
            })}
            ref={scrollRefSubHeader}
          >
            {scrollToItems.map((scrollItem) => {
              let isActive = scrollItem.key === activeScrollToItem
              const btnClass = isActive
                ? "min-w-[90px] max-w-[90px] flex flex-col justify-center items-center mr-6 border-b-2 border-primary-dominant"
                : "min-w-[90px] max-w-[90px] flex flex-col justify-center items-center mr-6 border-b-0"
              const textClass = isActive
                ? "overflow-ellipsis font-semibold text-primary-dominant"
                : "overflow-ellipsis text-gray-600"
              return (
                <StyledTouchableOpacity
                  key={scrollItem.key}
                  className={btnClass}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout
                    dataSubHeaderCords[scrollItem.key as keyof typeof dataSubHeaderCords] =
                      layout.x - 150
                    setDataSubHeaderCords(dataSubHeaderCords)
                  }}
                  onPress={() => {
                    setActiveScrollToItem(scrollItem.key)
                    scrollRef?.current?.scrollTo({
                      x: 0,
                      y: dataSourceCords[scrollItem.key],
                      animated: true,
                    })
                    scrollRefSubHeader?.current?.scrollTo({
                      x: Number(
                        dataSubHeaderCords[scrollItem.key as keyof typeof dataSubHeaderCords],
                      ),
                      y: 0,
                      animated: true,
                    })
                  }}
                >
                  <StyledText
                    className={textClass}
                    size="xxs"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {scrollItem.name}
                  </StyledText>
                </StyledTouchableOpacity>
              )
            })}
          </StyledScrollView>
        </StyledAnimatedView>
      </Animated.View>
    )
  }

  return (
    <>
      <Screen preset="fixed" style={$shadowStyle}>
        {isFetchingBranchDetails && (
          <StyledView className="w-full h-full flex items-center justify-center bg-white">
            <StyledIcon icon="loader" size={64} />
          </StyledView>
        )}
        {!isFetchingBranchDetails && (
          <StyledAnimatedView
            style={[
              {
                paddingTop: $paddingTop,
              },
            ]}
          >
            <DynamicHeader value={scrollOffsetY} dataSourceCords={dataSourceCords} />
            <StyledAnimatedScrollView
              className="bg-light"
              scrollEventThrottle={1}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
                useNativeDriver: false,
              })}
              ref={scrollRef}
            >
              <StyledImage
                className="w-full h-72"
                source={{ uri: branchDetailsParam.file.get_url }}
              />
              <StyledSafeAreaView className="flex-row justify-between items-center w-full absolute">
                <StyledTouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="p-2 mt-12 ml-4 rounded-full flex items-center justify-center bg-white"
                >
                  <StyledIcon icon="back" size={20} color={colors.palette.dark} />
                </StyledTouchableOpacity>
              </StyledSafeAreaView>
              <StyledView className="relative -mt-12 pt-6 rounded-t-3xl bg-light">
                <Overview
                  dataSourceCords={dataSourceCords}
                  setDataSourceCords={setDataSourceCords}
                  branchDetails={dataBranchDetails?.data}
                />
                <StyledView className="mt-6 mb-2 border-b-2 border-neutral-300" />
                {ratings.length > 0 && (
                  <>
                    <RatingList
                      dataSourceCords={dataSourceCords}
                      setDataSourceCords={setDataSourceCords}
                      branchDetails={dataBranchDetails?.data}
                    />
                    <StyledView className="mt-6 mb-2 border-b-2 border-neutral-300" />
                  </>
                )}
                <Amenities
                  dataSourceCords={dataSourceCords}
                  setDataSourceCords={setDataSourceCords}
                  branchDetails={dataBranchDetails?.data}
                />
                <StyledView className="mt-6 mb-2 border-b-2 border-neutral-300" />
                <Description
                  dataSourceCords={dataSourceCords}
                  setDataSourceCords={setDataSourceCords}
                  branchDetails={dataBranchDetails?.data}
                />
                <StyledView className="mt-6 mb-2 border-b-2 border-neutral-300" />
                <Policies
                  dataSourceCords={dataSourceCords}
                  setDataSourceCords={setDataSourceCords}
                  branchDetails={dataBranchDetails?.data}
                />
                <StyledView className="mt-6 mb-2 border-b-2 border-neutral-300" />
                <Rooms
                  dataSourceCords={dataSourceCords}
                  setDataSourceCords={setDataSourceCords}
                  branchDetails={dataBranchDetails?.data}
                  rooms={roomData}
                  handleEndReached={handleEndReached}
                  isFetching={isFetching}
                />
                <StyledView className="h-72" />
              </StyledView>
            </StyledAnimatedScrollView>
          </StyledAnimatedView>
        )}
      </Screen>
    </>
  )
}

const $shadowStyle: ViewStyle = {
  elevation: 7,
}

export default BranchDetailsScreen
