import React from "react";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const KeyboardScrollView = ({ padding, ...rest }) => (
  <KeyboardAwareScrollView
    style={{ flex: 1, paddingTop: padding, paddingBottom: padding }}
    {...rest}
  />
);

KeyboardScrollView.propTypes = {
  padding: PropTypes.number
};

KeyboardScrollView.defaultProps = {
  padding: 16
};
