import React from "react";
import { View } from "react-native";

export function Card({ children, className = "", style = {}, ...props }) {
  return (
    <View
      className={`bg-white rounded-lg p-4 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
