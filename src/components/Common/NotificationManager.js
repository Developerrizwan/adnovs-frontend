import React from "react";
import { toast } from "react-toastify";

const Constants = {
  CHANGE: "change",
  PRIMARY: "primary",
  SECONDARY: "secondary",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

class NotificationManager extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  create = (props) => {
    toast(props.title, {
      position: "top-right",
      autoClose: props.timeOut,
      hideProgressBar: true,
      className: props.customClassName,
    });
  };

  primary(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.PRIMARY,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [
        `bg-${Constants.PRIMARY}`,
        "text-white",
        customClassName,
      ].join(" "),
    });
  }

  secondary(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.SECONDARY,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [
        `bg-${Constants.SECONDARY}`,
        "text-white",
        customClassName,
      ].join(" "),
    });
  }

  info(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.INFO,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [
        `bg-${Constants.INFO}`,
        "text-white",
        customClassName,
      ].join(" "),
    });
  }

  success(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.SUCCESS,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [
        `bg-${Constants.SUCCESS}`,
        "text-white",
        customClassName,
      ].join(" "),
    });
  }

  warning(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.WARNING,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [
        `bg-${Constants.WARNING}`,
        "text-white",
        customClassName,
      ].join(" "),
    });
  }

  error(message, title, timeOut, onClick, priority, customClassName) {
    this.create({
      type: Constants.ERROR,
      message,
      title,
      timeOut,
      onClick,
      priority,
      customClassName: [`bg-danger`, "text-white", customClassName].join(" "),
    });
  }
}

export default new NotificationManager();
