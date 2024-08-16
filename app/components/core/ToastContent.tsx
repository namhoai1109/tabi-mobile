import React from "react"
import { Text, View } from "@ant-design/react-native"
import _get from "lodash/get"
import { styled } from "nativewind"

const StyledView = styled(View)
const StyleText = styled(Text)

interface IToastContent {
  code?: number
  message: string
}

export const ToastContent = ({ code, message }: IToastContent) => (
  <StyledView className="flex flex-col items-center justify-center">
    {code && <StyleText className="text-light mt-3 font-bold">{code}</StyleText>}
    <StyleText className="text-light mt-2">{message}</StyleText>
  </StyledView>
)
