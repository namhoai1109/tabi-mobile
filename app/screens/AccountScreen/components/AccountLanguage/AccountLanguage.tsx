import { Icon, Text } from "app/components/core"
// import { setLocaleState, useLocaleState } from "app/hooks/useLocale"
import { getLocale } from "app/i18n"
import { colors } from "app/theme"
import { styled } from "nativewind"
import React, { useState } from "react"
import { View, Switch } from "react-native"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledIcon = styled(Icon)
const StyledSwitch = styled(Switch)

const AccountLanguage = () => {
  const locale = getLocale()
  const [isEn, setIsEn] = useState(locale === "en-US")

  return (
    <StyledView className="w-full mt-1 px-4 flex flex-row justify-between items-center">
      <StyledView className="flex flex-row justify-start items-center gap-2">
        <StyledIcon icon={isEn ? "en" : "vi"} size={24} />
        <StyledText>{isEn ? "English" : "Tiếng Việt"}</StyledText>
      </StyledView>

      <StyledSwitch
        style={{
          paddingHorizontal: 10,
        }}
        value={isEn}
        trackColor={{ false: colors.error, true: "#0A3161" }}
        thumbColor={"#f4f3f4"}
        onValueChange={() => {
          setIsEn(!isEn)
        }}
      />
    </StyledView>
  )
}

export default AccountLanguage
