import React from "react";
import { TouchableOpacity, Text } from "react-native";

export function Button({ children, onPress, className = "", style = {} }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-blue-500 px-4 py-2 rounded-lg ${className}`}
      style={style}
    >
      {typeof children === "string" ? (
        <Text className="text-white text-center font-semibold">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
