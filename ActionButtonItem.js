import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text
} from "react-native";
import PropTypes from "prop-types";

export default class ActionButtonItem extends Component {
  render() {
    const offsetX = this.props.radius * Math.cos(this.props.angle);
    const offsetY = this.props.radius * Math.sin(this.props.angle);
    return (
      <Animated.View
        style={[
          {
            bottom: this.props.bottom,
            opacity: this.props.anim,
            width: this.props.size,
            height: this.props.size,
            transform: [
              {
                translateY: this.props.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, offsetY]
                })
              },
              {
                translateX: this.props.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, offsetX]
                })
              },
              {
                rotate: this.props.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    `${this.props.startDegree}deg`,
                    `${this.props.endDegree}deg`
                  ]
                })
              },
              {
                scale: this.props.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={this.props.onPress}>
          <View
            style={[
              styles.actionButton,
              this.props.buttonColor !== "transparent"
                ? styles.actionButtonShadow
                : null,
              {
                width: this.props.size,
                height: this.props.size,
                borderRadius: this.props.size / 2,
                backgroundColor: this.props.buttonColor
              }
            ]}
          >
            {this.props.children}
          </View>
          {this.props.buttonLabel && (
            <Text
              style={{
                bottom: -25,
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "SFProText-Bold",
                fontSize: 11,
                color: "#FFFFFF",
                opacity: 0.7,
                letterSpacing: -0.1
              }}
            >
              {this.props.buttonLabel}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

ActionButtonItem.propTypes = {
  angle: PropTypes.number,
  radius: PropTypes.number,
  buttonColor: PropTypes.string,
  onPress: PropTypes.func,
  children: PropTypes.node,
  startDegree: PropTypes.number,
  endDegree: PropTypes.number,
  disable: PropTypes.bool
};

ActionButtonItem.defaultProps = {
  onPress: () => {},
  startDegree: 0,
  endDegree: 720,
  disable: false,
  buttonColor: "transparent"
};

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 2,
    shadowRadius: 1,
    backgroundColor: "red",
    position: "absolute"
  },
  actionButtonShadow: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowColor: "#444"
  }
});
