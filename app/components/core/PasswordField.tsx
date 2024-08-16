import { ITextFieldAccessoryProps, ITextFieldProps, Icon, TextField } from "app/components/core"
import { colors } from "app/theme"
import React, {
  ComponentType,
  Ref,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { TextInput } from "react-native"

export const PasswordField = forwardRef(function PasswordField(
  props: ITextFieldProps,
  ref: Ref<TextInput>,
) {
  const [isHidden, setIsAuthPasswordHidden] = useState(true)
  const input = useRef<TextInput>(null)

  const PasswordRightAccessory: ComponentType<ITextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: ITextFieldAccessoryProps) {
        return (
          <Icon
            icon={isHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isHidden)}
          />
        )
      },
    [isHidden],
  )
  useImperativeHandle(ref, () => input.current as TextInput)
  return (
    <TextField
      ref={input}
      {...props}
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={isHidden}
      RightAccessory={PasswordRightAccessory}
    />
  )
})
