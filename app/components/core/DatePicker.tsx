import { DatePicker as DatePickerAntd, Flex } from "@ant-design/react-native"
import { DatePickerPropsType } from "@ant-design/react-native/lib/date-picker/PropsType"
import React from "react"
import { ITextProps, Text } from "./Text"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors, rounded, spacing } from "app/theme"
import { TxKeyPath } from "app/i18n"
import { Icon } from "./Icon"
import { styled } from "nativewind"

const StyledView = styled(View)
const StyledText = styled(Text)

interface IDatePickerProps extends DatePickerPropsType {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: ITextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: ITextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: ITextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: ITextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: ITextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: ITextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: ITextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: ITextProps
  /**
   * Style overrides for the container
   */
  containerStyle?: string
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: ITextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: ITextProps["tx"]
}

function DatePicker(props: IDatePickerProps) {
  const {
    label,
    labelTx,
    labelTxOptions,
    LabelTextProps,
    containerStyle,
    placeholder,
    placeholderTx,
    status,
    helper,
    helperTx,
    helperTxOptions,
    HelperTextProps,
    value,
    ...rest
  } = props

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  const $wrapCtnStyles = [
    $wrapCtn,
    status === "error"
      ? {
          borderColor: colors.error,
        }
      : undefined,
  ]

  return (
    <StyledView className={containerStyle}>
      {!!(label || labelTx) && (
        <StyledText
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          style={LabelTextProps?.style}
          className="mb-2"
        />
      )}

      <DatePickerAntd
        style={$wrapper}
        mode="date"
        defaultDate={new Date()}
        maxDate={new Date()}
        minDate={new Date(1900, 1, 1)}
        format="YYYY-MM-DD"
        {...rest}
        dismissText={<Text tx="common.dismiss" primary size="md" />}
        okText={<Text tx="common.ok" primary size="md" />}
      >
        <Flex style={$wrapCtnStyles} justify="between">
          {value ? (
            <Text text={value.toDateString()} />
          ) : (
            <Text tx={placeholderTx} text={placeholder} />
          )}
          <Icon icon="calendar" color={colors.palette.neutral500} size={20} />
        </Flex>
      </DatePickerAntd>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </StyledView>
  )
}

export default DatePicker

const $wrapper: ViewStyle = {
  borderWidth: 1,
  backgroundColor: colors.background,
  borderColor: colors.palette.neutral400,
  overflow: "hidden",
}

const $wrapCtn: ViewStyle = {
  height: spacing.s12,
  backgroundColor: colors.background,
  borderRadius: rounded.r3,
  borderColor: colors.palette.neutral400,
  borderWidth: 1,
  paddingLeft: spacing.s4,
  paddingRight: spacing.s5,
}

const $helperStyle: TextStyle = {
  marginTop: spacing.s3,
}
