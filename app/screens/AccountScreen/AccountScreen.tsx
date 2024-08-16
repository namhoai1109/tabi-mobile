import { TTabiTabScreenProps } from "app/navigators/TabiNavigator"
import { logout, useAuthentication } from "app/hooks/useAuthentication"
import React, { FC, useState } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Pressable,
  ScrollView,
} from "react-native"
import { styled } from "nativewind"
import { colors } from "app/theme"
import { TIconTypes, Text } from "app/components/core"
import ExpandableItem from "./components/ExpandableItem"
import AccountProfileContent from "./components/AccountProfileContent"
import AccountLanguage from "./components/AccountLanguage"
import AccountSupport from "./components/AccountSupport"
import AccountNotification from "./components/AccountNotification"
import { useDevice } from "app/hooks/useNotification"

const StyledScrollView = styled(ScrollView)
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledImage = styled(Image)
const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

function getHoroscope(month: number, day: number): NodeRequire {
  const zodiacSigns = [
    {
      sign: "Capricorn",
      start: { month: 1, day: 1 },
      end: { month: 1, day: 19 },
      image: require("../../../assets/horoscopes/Capricorn.png"),
    },
    {
      sign: "Aquarius",
      start: { month: 1, day: 20 },
      end: { month: 2, day: 18 },
      image: require("../../../assets/horoscopes/Aquarius.png"),
    },
    {
      sign: "Pisces",
      start: { month: 2, day: 19 },
      end: { month: 3, day: 20 },
      image: require("../../../assets/horoscopes/Pisces.png"),
    },
    {
      sign: "Aries",
      start: { month: 3, day: 21 },
      end: { month: 4, day: 19 },
      image: require("../../../assets/horoscopes/Aries.png"),
    },
    {
      sign: "Taurus",
      start: { month: 4, day: 20 },
      end: { month: 5, day: 20 },
      image: require("../../../assets/horoscopes/Taurus.png"),
    },
    {
      sign: "Gemini",
      start: { month: 5, day: 21 },
      end: { month: 6, day: 20 },
      image: require("../../../assets/horoscopes/Gemini.png"),
    },
    {
      sign: "Cancer",
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 },
      image: require("../../../assets/horoscopes/Cancer.png"),
    },
    {
      sign: "Leo",
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 },
      image: require("../../../assets/horoscopes/Leo.png"),
    },
    {
      sign: "Virgo",
      start: { month: 8, day: 23 },
      end: { month: 9, day: 22 },
      image: require("../../../assets/horoscopes/Virgo.png"),
    },
    {
      sign: "Libra",
      start: { month: 9, day: 23 },
      end: { month: 10, day: 22 },
      image: require("../../../assets/horoscopes/Libra.png"),
    },
    {
      sign: "Scorpio",
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 },
      image: require("../../../assets/horoscopes/Scorpio.png"),
    },
    {
      sign: "Sagittarius",
      start: { month: 11, day: 22 },
      end: { month: 12, day: 21 },
      image: require("../../../assets/horoscopes/Sagittarius.png"),
    },
    {
      sign: "Capricorn",
      start: { month: 12, day: 22 },
      end: { month: 12, day: 31 },
      image: require("../../../assets/horoscopes/Capricorn.png"),
    },
  ]

  for (let zodiac of zodiacSigns) {
    if (
      (month === zodiac.start.month && day >= zodiac.start.day) ||
      (month === zodiac.end.month && day <= zodiac.end.day) ||
      (month > zodiac.start.month && month < zodiac.end.month)
    ) {
      return zodiac.image
    }
  }

  return require("../../../assets/images/guest.png")
}

const accountItems = [
  {
    isExpanded: false,
    label: "Profile",
    labelVi: "Hồ sơ",
    icon: "user",
    subItem: <AccountProfileContent />,
  },
  {
    isExpanded: false,
    label: "Notification",
    labelVi: "Thông báo",
    icon: "bell",
    subItem: <AccountNotification />,
  },
  {
    isExpanded: false,
    label: "Language",
    labelVi: "Ngôn ngữ",
    icon: "globe",
    subItem: <AccountLanguage />,
  },
  {
    isExpanded: false,
    label: "Help",
    labelVi: "Trợ giúp",
    icon: "support",
    subItem: <AccountSupport />,
  },
]

const AccountScreen: FC<TTabiTabScreenProps<"Account">> = function AccountScreen({ navigation }) {
  console.log("=== 1 accountItems ", accountItems.length)

  const { accessToken, dob } = useAuthentication()
  const isAuthenticated = accessToken !== ""
  const { push_token } = useDevice()

  console.log("=== 2 accountItems", accountItems.length)

  if (push_token === "") {
    accountItems.splice(1, 1)
  }

  console.log("=== 3 accountItems", accountItems.length)
  const [listDataSource, setListDataSource] = useState(accountItems)

  const updateLayout = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const array = [...listDataSource]
    array.map((value, placeIndex) =>
      placeIndex === index
        ? (array[placeIndex].isExpanded = !array[placeIndex].isExpanded)
        : (array[placeIndex].isExpanded = false),
    )
    setListDataSource(array)
  }

  return (
    <StyledScrollView className="w-full flex flex-col bg-light mb-16">
      <StyledView className="items-center mt-20">
        <StyledImage
          style={{
            ...styles.image,
            borderColor: isAuthenticated ? colors.palette.primaryDominantLight : "transparent",
            borderRadius: isAuthenticated ? 100 : 0,
          }}
          source={
            isAuthenticated
              ? getHoroscope(new Date(dob).getMonth(), new Date(dob).getDay())
              : require("../../../assets/images/luggage.png")
          }
        />

        {!isAuthenticated && (
          <StyledText className="w-2/3 text-center" tx="accountScreen.noAuthPlaceholder" />
        )}
      </StyledView>
      <StyledView className="mt-8">
        {isAuthenticated ? (
          listDataSource.map((item, key) => (
            <ExpandableItem
              key={item.label}
              navigation={navigation}
              label={item.label}
              labelVi={item.labelVi}
              isExpanded={item.isExpanded}
              icon={item.icon as TIconTypes}
              onClickFunction={() => updateLayout(key)}
              subItem={item.subItem}
            />
          ))
        ) : (
          <StyledView className="w-full flex justify-center items-center">
            <StyledView className="flex flex-row justify-center items-center">
              <StyledPressable
                className="border border-neutral-300 rounded-lg w-[120px] h-[32px] flex items-center justify-center mr-4"
                onPress={() => {
                  navigation.navigate("Login", {
                    isLogin: true,
                  })
                }}
              >
                <StyledText tx="bookingScreen.login" />
              </StyledPressable>
              <StyledPressable
                className="border border-primary-dominant bg-primary-dominant rounded-lg w-[120px] h-[32px] flex items-center justify-center"
                onPress={() => {
                  navigation.navigate("Login", {
                    isLogin: false,
                  })
                }}
              >
                <StyledText className="text-white" tx="bookingScreen.register" />
              </StyledPressable>
            </StyledView>
          </StyledView>
        )}
      </StyledView>
      {isAuthenticated && (
        <StyledView className="w-full h-12 flex flex-row justify-center items-center mt-8 mb-4">
          <StyledTouchableOpacity
            className="border-2 border-neutral-200 pt-2 pb-2 px-36 rounded-md"
            onPress={() => {
              logout()
              navigation.navigate("Login")
            }}
          >
            <StyledText tx="accountScreen.logoutButton" />
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.palette.baseBgLight,
  },
  image: {
    height: 80,
    width: 80,
    borderWidth: 2,
  },
  imageIcon: {
    position: "absolute",
    bottom: 0,
    right: 7,
    zIndex: 999,
  },
})

export default AccountScreen
