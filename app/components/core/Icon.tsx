import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

export type TIconTypes = keyof typeof iconRegistry

interface IIconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: TIconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IIconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../../assets/icons/back.png"),
  bell: require("../../../assets/icons/bell.png"),
  bookmark: require("../../../assets/icons/bookmark.png"),
  caretLeft: require("../../../assets/icons/caretLeft.png"),
  caretRight: require("../../../assets/icons/caretRight.png"),
  calendar: require("../../../assets/icons/calendar.png"),
  check: require("../../../assets/icons/check.png"),
  chevronLeft: require("../../../assets/icons/chevronLeft.png"),
  chevronDown: require("../../../assets/icons/chevronDown.png"),
  clock: require("../../../assets/icons/clock.png"),
  community: require("../../../assets/icons/community.png"),
  copy: require("../../../assets/icons/copy.png"),
  crosshair: require("../../../assets/icons/crosshair.png"),
  doorOpen: require("../../../assets/icons/doorOpen.png"),
  file: require("../../../assets/icons/file.png"),
  globe: require("../../../assets/icons/globe.png"),
  heart: require("../../../assets/icons/heart.png"),
  hidden: require("../../../assets/icons/hidden.png"),
  hotel: require("../../../assets/icons/hotel.png"),
  idCard: require("../../../assets/icons/idCard.png"),
  ladybug: require("../../../assets/icons/ladybug.png"),
  loader: require("../../../assets/icons/loader.gif"),
  location: require("../../../assets/icons/location.png"),
  lock: require("../../../assets/icons/lock.png"),
  map: require("../../../assets/icons/map.png"),
  menu: require("../../../assets/icons/menu.png"),
  more: require("../../../assets/icons/more.png"),
  pencil: require("../../../assets/icons/pencil.png"),
  pin: require("../../../assets/icons/pin.png"),
  search: require("../../../assets/icons/search.png"),
  settings: require("../../../assets/icons/settings.png"),
  star: require("../../../assets/icons/star.png"),
  home: require("../../../assets/icons/home.png"),
  booking: require("../../../assets/icons/booking.png"),
  user: require("../../../assets/icons/user.png"),
  trash: require("../../../assets/icons/trash.png"),
  userGroup: require("../../../assets/icons/userGroup.png"),
  view: require("../../../assets/icons/view.png"),
  xmark: require("../../../assets/icons/xmark.png"),
  emptyFolder: require("../../../assets/icons/empty-folder.png"),
  cancel: require("../../../assets/icons/cancel.png"),
  support: require("../../../assets/icons/support.png"),
  history: require("../../../assets/icons/history.png"),
  en: require("../../../assets/images/flags/en.png"),
  vi: require("../../../assets/images/flags/vi.png"),
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
