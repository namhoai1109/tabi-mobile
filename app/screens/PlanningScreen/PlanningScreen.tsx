import { Screen, Text } from "app/components/core"
import { TAppStackScreenProps } from "app/navigators"
import { styled } from "nativewind"
import React, { FC, useRef, useState, useEffect } from "react"
import { Dimensions, Pressable, ScrollView, View, ViewStyle } from "react-native"
import PlanningHeader from "./components/PlanningHeader"
import { colors, spacing } from "app/theme"
import { LinearGradient } from "expo-linear-gradient"
import { Carousel } from "@ant-design/react-native"
import TimelineItem from "./components/TimelineItem"
import Destination from "./components/Destination"
import { getDatesBetween2Dates } from "app/utils/formatDate"
import {
  keyPlan,
  useAddPlan,
  useDeleteAllPlans,
  useGetAIRecommendedDestinations,
  useGetPlanDetailsById,
} from "app/services/plan/services"
import Timetable from "react-native-calendar-timetable"
import AnimatedLottieView from "lottie-react-native"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import TimePickerScreen from "./components/TimePickerScreen"
import { setDestinationData, usePlanningState } from "app/hooks/usePlanningState"
import moment from "moment"
import SkeletonDestinationList from "./components/SkeletonDestinationList"
import MapScreen from "./components/MapScreen"
import { useQueryClient } from "react-query"
import _ from "lodash"

const StyledScreen = styled(Screen)
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)
const StyledLinearGradient = styled(LinearGradient)
const StyledScrollView = styled(ScrollView)
const StyledTimetable = styled(Timetable)
const lottiesGlobe = require("../../../assets/lotties/stars.json")

const mapDataToPlan = (data: { [key: string]: TTimelineItem[] }, booking_id: number): TPlan => {
  const schedules: TSchedule[] = []
  for (const [_, events] of Object.entries(data)) {
    for (const event of events) {
      if (event.destination) {
        schedules.push({
          booking_id: booking_id,
          start_time: moment(event.startDate)
            .startOf("day")
            .add(event.startDate.getHours(), "hours")
            .toDate()
            .toISOString(),
          end_time: moment(event.endDate)
            .startOf("day")
            .add(event.endDate.getHours() + 1, "hours")
            .toDate()
            .toISOString(),
          destination_id: event.destination.id,
          destination_name: event.destination.name,
          destination_category: event.destination.category,
          destination_location: event.destination.location,
          destination_website: event.destination.website,
          destination_image: event.destination.images[0],
          destination_opening_hours: event.destination.opening_hours,
          destination_latitude: event.destination.lat.toString(),
          destination_longitude: event.destination.lng.toString(),
        })
      }
    }
  }

  return { schedules }
}

const mapPlanDetailsDataToTimelineItems = (
  data: TPlanDetailsData[],
  checkInDate: string,
  checkOutDate: string,
): { [key: string]: TTimelineItem[] } => {
  const dates = getDatesBetween2Dates(checkInDate, checkOutDate)

  // Initialize the plans object with dates as keys
  const plans = dates.reduce((acc, date) => {
    const formattedDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
    )
    acc[formattedDate.toISOString()] = []
    return acc
  }, {} as { [key: string]: TTimelineItem[] })

  const getTimeDifferenceInHours = (start: string, end: string): number => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) // Convert milliseconds to hours
  }

  const extractCity = (location: string): string => {
    const parts = location.split(", ")
    return parts.length > 1 ? parts[1] : ""
  }

  data.forEach((item) => {
    const startDate = new Date(item.start_time)
    const vietnameseTimeOffset = 7 * 60 * 60 * 1000 // 7 hours in milliseconds
    const adjustedDate = new Date(startDate.getTime() + vietnameseTimeOffset)

    const dateKey = new Date(
      Date.UTC(
        adjustedDate.getUTCFullYear(),
        adjustedDate.getUTCMonth(),
        adjustedDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    ).toISOString()

    if (plans[dateKey]) {
      let startDate = new Date(item.start_time)
      let endDate = new Date(item.end_time)

      const timelineItem: TTimelineItem = {
        startDate: new Date(startDate.getTime() + 1000),
        endDate: new Date(endDate.getTime() - 1000),
        destination: {
          category: item.destination_category,
          city: extractCity(item.destination_location),
          duration: "",
          id: item.destination_id,
          images: [item.destination_image],
          location: item.destination_location,
          name: item.destination_name,
          opening_hours: item.destination_opening_hours || "",
          rankings: 0,
          reviews: 0,
          website: item.destination_website,
          lat: item.destination_latitude,
          lng: item.destination_longitude,
        },
        timeDifference: getTimeDifferenceInHours(item.start_time, item.end_time),
      }

      plans[dateKey].push(timelineItem)
    }
  })

  return plans
}

interface IPlanningScreenProps extends TAppStackScreenProps<"PlanningScreen"> {}

const { height } = Dimensions.get("window")

const PlanningScreen: FC<IPlanningScreenProps> = function PlanningScreen({ navigation, route }) {
  const { checkInDate, checkOutDate, user_id, city, booking_id, booking, ids } = route.params
  const [timelineItems, setTimelineItems] = useState<TTimelineItem[]>()
  const [timetableEvents, setTimetableEvents] = useState<any[]>([])

  const [inputTimeRange, setInputTimeRange] = useState<number[]>([0, 0])
  const [inputDestination, setInputDestination] = useState<TDestinationReadOnly>()
  const [isEditMode, setIsEditMode] = useState<TDestinationEditMode>({
    isEdit: false,
    oldDestination: {
      category: "",
      city: "",
      duration: "",
      id: 0,
      images: [],
      location: "",
      name: "",
      opening_hours: "",
      rankings: 0,
      reviews: 0,
      website: "",
      lat: "0",
      lng: "0",
    },
    startDate: new Date(0),
    endDate: new Date(),
  })

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(checkInDate.split("T")[0]).toISOString(),
  )
  const [datePlans, setDatePlans] = useState<{ [key: string]: TTimelineItem[] }>({})
  const carouselRef = useRef<Carousel>(null)
  const [indexCarousel, setIndexCarousel] = useState(0)
  const timeSelectRef = useRef<TBottomSheet>(null)
  const queryClient = useQueryClient()
  const { mutate } = useAddPlan(() => {
    queryClient.invalidateQueries([keyPlan.PLAN_DETAILS, booking.data.id]),
      navigation.navigate("BookingDetailScreen", {
        data: booking,
      })
  })
  const {
    data: destinationNewData,
    isFetching,
    refetch: fetchNewDestinationData,
  } = useGetAIRecommendedDestinations(user_id, city)

  const { destinationData } = usePlanningState()

  useEffect(() => {
    if (!isFetching && destinationNewData?.data?.message?.locations) {
      try {
        const arr = [...destinationData, ...destinationNewData.data.message.locations]
        console.log(
          "=== before ",
          arr.map((e) => e.id),
        )
        let temp = _.uniqBy(arr, (e) => {
          return e.id
        })
        console.log(
          "=== after ",
          temp.map((e) => e.id),
        )
        setDestinationData(temp)
      } catch (error) {}
    }
  }, [destinationNewData])
  const { data: dataPlanDetails, refetch: refetchPlanDetails } = useGetPlanDetailsById(booking_id)
  const { mutate: mutateDeleteAllPlans } = useDeleteAllPlans(() => refetchPlanDetails())
  useEffect(() => {
    if (dataPlanDetails?.data?.data) {
      const transformedData = mapPlanDetailsDataToTimelineItems(
        dataPlanDetails.data.data,
        checkInDate,
        checkOutDate,
      )
      setDatePlans(transformedData)
    }
  }, [dataPlanDetails])

  useEffect(() => {
    if (timelineItems) {
      setTimetableEvents(
        timelineItems
          .filter((item) => item.destination)
          .map((item) => ({
            title: item.destination?.name,
            startDate: item.startDate,
            endDate: item.endDate,
            timeDifference: item.timeDifference,
            destination: item.destination,
          })),
      )
    }
  }, [datePlans, timelineItems, selectedDate])

  useEffect(() => {
    const dates = getDatesBetween2Dates(checkInDate, checkOutDate)
    const plans = dates.reduce((acc, date) => {
      const formattedDate = date.toISOString()
      acc[formattedDate] = []
      return acc
    }, {} as { [key: string]: TTimelineItem[] })
    setDatePlans(plans)
  }, [checkInDate, checkOutDate])

  useEffect(() => {
    if (datePlans && selectedDate) {
      setTimelineItems(datePlans[selectedDate])
    }
  }, [datePlans, selectedDate])

  const goToIndex = (index: number) => {
    carouselRef.current?.goTo(index)
    setIndexCarousel(index)
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleDestinationSelect = (destination: TDestinationReadOnly) => {
    setInputDestination(destination)
    timeSelectRef.current?.open()
  }

  return (
    <StyledScreen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      className="bg-white relative"
      style={{
        maxHeight: height,
      }}
    >
      <BottomSheet height={810} ref={timeSelectRef}>
        <TimePickerScreen
          inputTimeRange={inputTimeRange}
          setInputTimeRange={setInputTimeRange}
          datePlans={datePlans}
          setDatePlans={setDatePlans}
          timelineItems={timelineItems}
          inputDestination={inputDestination}
          selectedDate={selectedDate}
          onSuccess={() => {
            timeSelectRef.current?.close()
            goToIndex(0)
          }}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </BottomSheet>
      <PlanningHeader
        onBack={() => {
          if (indexCarousel === 0) {
            navigation.goBack()
          } else {
            goToIndex(0)
          }
        }}
        onSave={async () => {
          mutateDeleteAllPlans(ids)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          mutate(mapDataToPlan(datePlans, booking_id))
        }}
        onMapView={() => {
          goToIndex(2)
        }}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onDateChange={handleDateChange}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Carousel
        style={$carousel}
        ref={carouselRef}
        dots={false}
        scrollEnabled={false}
        selectedIndex={1}
      >
        <StyledScrollView className="mb-[58px]" showsVerticalScrollIndicator={false}>
          <StyledTimetable
            hourHeight={90}
            items={timetableEvents}
            renderItem={(props) => {
              return (
                <TimelineItem
                  style={{
                    ...props.style,
                    borderRadius: 5,
                    elevation: 5,
                  }}
                  data={props.item.destination}
                  timelineItem={props.item}
                  key={props.key}
                  index={1}
                  onPress={() => {
                    setIsEditMode({
                      isEdit: true,
                      oldDestination: props.item.destination,
                      startDate: props.item.startDate,
                      endDate: props.item.endDate,
                    })
                    goToIndex(1)
                  }}
                  onRemoveDestination={() => {
                    setDatePlans((prevDatePlans) => {
                      const updatedDatePlans = { ...prevDatePlans }
                      let itemIndex = updatedDatePlans[selectedDate].findIndex(
                        (item) =>
                          item.destination === props.item.destination &&
                          item.startDate === props.item.startDate &&
                          item.endDate === props.item.endDate,
                      )
                      updatedDatePlans[selectedDate].splice(itemIndex, 1)
                      return updatedDatePlans
                    })
                  }}
                />
              )
            }}
            date={new Date(selectedDate)}
            hideNowLine={true}
          />
        </StyledScrollView>

        <StyledView className="w-full h-full bg-white p-3 flex flex-col justify-between items-center">
          <StyledView className="w-full mb-28">
            <StyledText
              preset="bold"
              className="text-center text-base"
              tx="planningScreen.recommendedByAI"
            />

            <StyledScrollView showsVerticalScrollIndicator={false} horizontal={false}>
              {destinationData?.map((destination, index) => {
                return (
                  <Destination
                    key={`Destination-${index}`}
                    destination={destination}
                    onPress={() => handleDestinationSelect(destination)}
                  />
                )
              })}
              {isFetching && <SkeletonDestinationList />}
            </StyledScrollView>
          </StyledView>
        </StyledView>

        <StyledView className="w-full h-full bg-white p-3 flex flex-col justify-between items-center">
          <StyledView className="w-full h-full">
            <StyledText
              preset="subheading"
              className="h-24 mb-2 text-center"
              tx="planningScreen.mapView"
            />
            <MapScreen timelineItems={timelineItems || []} selectedDate={selectedDate} />
          </StyledView>
        </StyledView>
      </Carousel>
      {indexCarousel === 0 && (
        <StyledView
          className="w-full z-10 absolute bottom-0 border-neutral-300 border-t-2 pt-2 flex items-center justify-center"
          style={{
            backgroundColor: colors.palette.neutral100,
          }}
        >
          <StyledLinearGradient
            className="w-[90%] rounded-lg p-[2px]"
            colors={[colors.palette.primaryDominant, colors.palette.primaryAccent]}
            start={{ x: 0.1, y: 0.2 }}
          >
            <StyledPressable
              className="bg-white flex flex-row justify-center items-center rounded-md py-[2px]"
              onPress={() => {
                goToIndex(1)
              }}
            >
              <StyledText
                size="md"
                preset="semibold"
                className="mr-2 text-primary-accent"
                tx="planningScreen.addPlanButton"
              />
              <AnimatedLottieView
                source={lottiesGlobe}
                style={{
                  width: spacing.s9,
                  height: spacing.s9,
                }}
                loop
                autoPlay
                speed={0.3}
              />
            </StyledPressable>
          </StyledLinearGradient>
        </StyledView>
      )}
      {indexCarousel === 1 && (
        <StyledView
          className="w-full z-10 absolute bottom-0 border-neutral-300 border-t-2 pt-2 flex items-center justify-center"
          style={{
            backgroundColor: colors.palette.neutral100,
          }}
        >
          <StyledLinearGradient
            className="w-[90%] rounded-lg p-[2px]"
            colors={[colors.palette.primaryDominant, colors.palette.primaryAccent]}
            start={{ x: 0.1, y: 0.2 }}
          >
            <StyledPressable
              className="bg-white flex flex-row justify-center items-center rounded-md py-[2px]"
              onPress={() => {
                if (!isFetching) {
                  fetchNewDestinationData()
                }
              }}
            >
              <StyledText
                size="md"
                preset="semibold"
                className="mr-2 text-primary-accent"
                tx="planningScreen.findAnother"
              />
              <AnimatedLottieView
                source={lottiesGlobe}
                style={{
                  width: spacing.s9,
                  height: spacing.s9,
                }}
                loop
                autoPlay
                speed={0.3}
              />
            </StyledPressable>
          </StyledLinearGradient>
        </StyledView>
      )}
    </StyledScreen>
  )
}

const PLANNING_HEADER_HEIGHT = 150
const $carousel: ViewStyle = {
  height: height - PLANNING_HEADER_HEIGHT,
}

export default PlanningScreen
