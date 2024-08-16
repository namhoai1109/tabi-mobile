// import Clipboard from '@react-native-community/clipboard';
import { Icon, Text } from "app/components/core"
import { styled } from "nativewind"
import React from "react"
import { Clipboard, TouchableOpacity } from "react-native"

const StyledIcon = styled(Icon)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

const AccountSupport = () => {
  return (
    <StyledTouchableOpacity
      className="mt-1 w-full px-4 flex flex-row justify-between items-center"
      onPress={() => Clipboard.setString("support@gmail.com")}
    >
      <StyledText weight="semiBold">support@gmail.com</StyledText>
      <StyledIcon icon="copy" size={20} />
    </StyledTouchableOpacity>
  )
}

export default AccountSupport
