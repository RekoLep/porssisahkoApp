import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';

export default function CountUp({
  from = 0,
  to,
  duration = 1000, // ms
  style,
  separator = '',
  onEnd
}) {
  const animatedValue = useRef(new Animated.Value(from)).current;
  const [displayValue, setDisplayValue] = useState(from);

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

    return () => animatedValue.removeListener(listener);
  }, [to]);

  return <Text style={style}>{displayValue}</Text>;
}
