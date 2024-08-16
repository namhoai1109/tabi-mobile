import React, {
  ComponentType,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import {
  Animated,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { isRTL, translate } from "../../i18n"
import { colors, spacing, typography, text, rounded } from "../../theme"
import { Text, ITextProps } from "./Text"
import { styled } from "nativewind"

const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledView = styled(View)
const StyledTextInput = styled(TextInput)

export interface ITextFieldAccessoryProps {
  style: StyleProp<any>
  status: ITextFieldProps["status"]
  multiline: boolean
  editable: boolean
}

export interface ITextFieldProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
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
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: ITextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: ITextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: ITextProps["txOptions"]
  /**
   * Optional input style override.
   */
  className?: string
  /**
   * Style overrides for the container
   */
  containerStyle?: string
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: string
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<ITextFieldAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<ITextFieldAccessoryProps>
}

/**
 * A component that allows for the entering and editing of text.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-TextField.md)
 */
export const TextField = forwardRef(function TextField(
  props: ITextFieldProps,
  ref: Ref<TextInput>,
) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    className,
    containerStyle,
    inputWrapperStyle,
    ...TextInputProps
  } = props
  const input = useRef<TextInput>(null)
  const [isFocus, setIsFocus] = React.useState(false)

  const disabled = TextInputProps.editable === false || status === "disabled"

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  const $labelStyles = [$labelStyle, LabelTextProps?.style]

  const $inputWrapperStyles = [
    $inputWrapperStyle,
    status === "error" && { borderColor: colors.error },
    isFocus && { borderColor: colors.palette.primaryDominant },
    TextInputProps.multiline && { minHeight: 112 },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
  ]

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    disabled && { color: colors.textDim },
    isRTL && { textAlign: "right" as TextStyle["textAlign"] },
    TextInputProps.multiline && { height: "auto" },
  ]

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  function focusInput() {
    if (disabled) {
      return
    }
    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current as TextInput)

  const height = useMemo(() => new Animated.Value(0), [])
  const animHeight = height.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spacing.s9],
  })
  useEffect(() => {
    if (helper || helperTx) {
      Animated.timing(height, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(height, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start()
    }
  }, [helper, helperTx])

  return (
    <StyledTouchableOpacity
      activeOpacity={1}
      className={containerStyle}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={$labelStyles}
        />
      )}

      <StyledView style={$inputWrapperStyles} className={inputWrapperStyle}>
        {!!LeftAccessory && (
          <LeftAccessory
            style={$leftAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <StyledTextInput
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={placeholderContent}
          placeholderTextColor={colors.textDim}
          {...TextInputProps}
          editable={!disabled}
          style={[$inputStyles]}
          className={className}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={$rightAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </StyledView>

      <Animated.View
        style={{
          height: animHeight,
        }}
      >
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      </Animated.View>
    </StyledTouchableOpacity>
  )
})

const $labelStyle: TextStyle = {
  marginBottom: spacing.s3,
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderRadius: rounded.r3,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral400,
  overflow: "hidden",
  paddingRight: 12,
}

const $inputStyle: TextStyle = {
  flex: 1,
  alignSelf: "center",
  fontFamily: typography.primary.normal,
  color: colors.text,
  ...text.sm,
  lineHeight: 20,
  height: 24,
  paddingHorizontal: spacing.s2,
  marginVertical: spacing.s3,
  marginHorizontal: spacing.s4,
}

const $helperStyle: TextStyle = {
  marginTop: spacing.s2,
}

const $rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.s4,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
const $leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.s4,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
