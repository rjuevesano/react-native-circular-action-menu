import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import ActionButtonItem from "./ActionButtonItem";

const defaultConfig = {
  actionOverlay: {
    bottom: Platform.OS === "ios" ? 65 : 20
  }
};

const alignMap = {
  center: {
    alignItems: "center",
    justifyContent: "flex-end",
    startDegree: 180,
    endDegree: 360
  },
  left: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    startDegree: 270,
    endDegree: 360
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    startDegree: 180,
    endDegree: 270
  }
};

export default class ActionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      anim: new Animated.Value(props.active ? 1 : 0)
    };

    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getActionButtonStyle() {
    return [styles.actionBarItem, this.getButtonSize()];
  }

  getActionContainerOverlay() {
    const { bottomDistance } = this.props;
    return [
      styles.buttonActionOverlay,
      {
        bottom: bottomDistance
          ? bottomDistance
          : defaultConfig.actionOverlay.bottom
      }
    ];
  }

  getActionContainerStyle() {
    const { alignItems, justifyContent } = alignMap[this.props.position];
    return [
      styles.overlay,
      styles.actionContainer,
      {
        alignItems,
        justifyContent
      }
    ];
  }

  getActionsStyle() {
    return [this.getButtonSize()];
  }

  getButtonSize() {
    return {
      width: this.props.size,
      height: this.props.size
    };
  }

  animateButton() {
    if (this.state.active) {
      this.reset();
      return;
    }

    Animated.spring(this.state.anim, {
      toValue: 1,
      duration: 250
    }).start();

    this.setState({ active: true });
  }

  reset() {
    Animated.spring(this.state.anim, {
      toValue: 0,
      duration: 250
    }).start();

    setTimeout(() => {
      this.setState({ active: false });
    }, 250);
  }

  renderButton() {
    let activeStyles = {
      width: this.state.active ? 50 : this.props.size,
      height: this.state.active ? 50 : this.props.size,
      borderRadius: this.props.size / 2,
      backgroundColor: "transparent",
      transform: [
        {
          scale: this.state.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, this.props.outRangeScale]
          })
        },
        {
          rotate: this.state.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", this.props.degrees + "deg"]
          })
        }
      ]
    };

    if (this.state.active) {
      activeStyles = {
        width: this.state.active ? 47 : this.props.size,
        height: this.state.active ? 47 : this.props.size,
        borderRadius: this.props.size / 2,
        backgroundColor: "transparent",
        borderColor: "#9595A2",
        borderWidth: 1,
        transform: [
          {
            scale: this.state.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, this.props.outRangeScale]
            })
          },
          {
            rotate: this.state.anim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", this.props.degrees + "deg"]
            })
          }
        ]
      };
    }

    return (
      <View style={this.getActionButtonStyle()}>
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={this.props.onLongPress}
          onPress={() => {
            this.props.onPress();
            if (this.props.children) {
              this.animateButton();
            }
          }}
        >
          <Animated.View style={[styles.btn, activeStyles]}>
            {this.renderButtonIcon()}
            {!this.state.active && (
              <Text
                style={{
                  fontFamily: "SFProText-Medium",
                  fontSize: 12,
                  color: "#443B76",
                  bottom: 5,
                  opacity: 0.8
                }}
              >
                Track
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  renderButtonIcon() {
    if (this.props.icon) {
      return this.props.icon;
    }

    return (
      <Animated.Text
        style={[
          styles.btnText,
          {
            color: this.state.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                this.props.buttonTextColor,
                this.props.btnOutRangeTxt
              ]
            })
          }
        ]}
      >
        -
      </Animated.Text>
    );
  }

  renderActions() {
    if (!this.state.active) return null;
    const startDegree =
      this.props.startDegree || alignMap[this.props.position].startDegree;
    const endDegree =
      this.props.endDegree || alignMap[this.props.position].endDegree;
    const startRadian = (startDegree * Math.PI) / 180;
    const endRadian = (endDegree * Math.PI) / 180;

    const childrenCount = React.Children.count(this.props.children);
    let offset = 0;
    if (childrenCount !== 1) {
      offset = (endRadian - startRadian) / (childrenCount - 1);
    }

    return React.Children.map(this.props.children, (button, index) => {
      return (
        <View pointerEvents="box-none" style={this.getActionContainerStyle()}>
          <ActionButtonItem
            key={index}
            position={this.props.position}
            anim={this.state.anim}
            size={this.props.itemSize}
            radius={this.props.radius}
            angle={startRadian + index * offset}
            btnColor={this.props.btnOutRange}
            {...button.props}
            onPress={() => {
              if (this.props.autoInactive && !button.props.disable) {
                this.timeout = setTimeout(() => {
                  this.reset();
                }, 200);
              }
              button.props.onPress();
            }}
          />
        </View>
      );
    });
  }

  render() {
    let backdrop;
    if (this.state.active) {
      backdrop = (
        <TouchableWithoutFeedback
          style={styles.overlay}
          onPress={() => {
            this.reset();
            this.props.onOverlayPress();
          }}
        >
          <Animated.View
            style={{
              backgroundColor: this.props.bgColor,
              opacity: this.state.anim,
              flex: 1
            }}
          >
            {this.props.backdrop}
          </Animated.View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View pointerEvents="box-none" style={styles.overlay}>
        {Platform.OS === "ios" && backdrop}

        <View style={this.getActionContainerOverlay()}>
          {this.props.children && this.renderActions()}
        </View>
        <View pointerEvents="box-none" style={this.getActionContainerStyle()}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  active: PropTypes.bool,
  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  buttonLabel: PropTypes.string,
  size: PropTypes.number,
  itemSize: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  onOverlayPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  startDegree: PropTypes.number,
  endDegree: PropTypes.number,
  radius: PropTypes.number,
  children: PropTypes.node,
  position: PropTypes.oneOf(["left", "center", "right"])
};

ActionButton.defaultProps = {
  active: false,
  bgColor: "transparent",
  buttonColor: "rgba(0,0,0,1)",
  buttonTextColor: "rgba(255,255,255,1)",
  buttonLabel: "",
  position: "center",
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  onOverlayPress: () => {},
  backdrop: false,
  degrees: 135,
  size: 63,
  itemSize: 36,
  radius: 100,
  btnOutRange: "rgba(0,0,0,1)",
  btnOutRangeTxt: "rgba(255,255,255,1)"
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "transparent"
  },
  actionContainer: {
    padding: 10,
    bottom: Platform.OS === "ios" ? -2 : 30
  },
  actionBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 0
  },
  btnText: {
    backgroundColor: "transparent",
    position: "relative"
  }
});
