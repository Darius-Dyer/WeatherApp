import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Props = {
  children?: React.ReactNode;
};

export default function GestureRoot({ children }: Props) {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}
