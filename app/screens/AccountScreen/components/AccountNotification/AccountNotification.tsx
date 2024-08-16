import { Text } from "app/components/core"
import { useDevice } from "app/hooks/useNotification"
// import { useLocaleState } from "app/hooks/useLocale"
import { getLocale } from "app/i18n"
import { useChangeNotificationSetting, useGetDevices } from "app/services/notification/services"
import { colors } from "app/theme"
import { styled } from "nativewind"
import React, { useEffect, useState } from "react"
import { View, Switch } from "react-native"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledSwitch = styled(Switch)

const AccountNotification = () => {
  const { push_token } = useDevice()
  const { data } = useGetDevices(push_token)
  const { mutate } = useChangeNotificationSetting()

  const locale = getLocale()
  const isEn = locale === "en-US"
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    if (data) {
      setIsEnabled(data.data.is_active)
    }
  }, [data])

  return (
    <StyledView className="w-full px-4 flex flex-row justify-between items-center">
      <StyledView className="flex flex-row justify-start items-center gap-2">
        {/* <StyledIcon icon={isEn ? "en" : "vi"} size={24} /> */}
        <StyledText>
          {isEn ? "You will receive plan notifications" : "Bạn sẽ nhận được thông báo"}
        </StyledText>
      </StyledView>

      <StyledSwitch
        style={{
          paddingHorizontal: 10,
        }}
        value={isEnabled}
        trackColor={{ false: colors.palette.neutral300, true: colors.palette.primaryDominant }}
        thumbColor={"#f4f3f4"}
        onValueChange={() => {
          mutate(
            {
              push_token,
              is_active: !isEnabled,
            },
            {
              onSuccess: () => {
                setIsEnabled(!isEnabled)
              },
            },
          )
        }}
      />
    </StyledView>
  )
}

export default AccountNotification
