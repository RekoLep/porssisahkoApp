import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number; // millisekunteina
  style?: TextStyle;
  separator?: string;
  onEnd?: () => void;
}

export default function CountUp({
  from = 0,
  to,
  duration = 100000,
  style,
  separator = '',
  onEnd,
}: CountUpProps) {
  const animatedValue = useRef(new Animated.Value(from)).current;
  const [displayValue, setDisplayValue] = useState<string | number>(from);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: to,
      duration,
      useNativeDriver: false,
    }).start(() => {
      if (onEnd) onEnd();
    });

    const listener = animatedValue.addListener(({ value }) => {
      let formatted = value.toFixed(2);
      if (separator) {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      }
      setDisplayValue(formatted);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [to, duration, separator, onEnd, animatedValue]);

  return <Text style={style}>{displayValue}</Text>;
}
