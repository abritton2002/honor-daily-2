import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressCircle from './ProgressCircle';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface ReadinessRingProps {
  readinessScore: number; // 0-100
  size?: number;
  strokeWidth?: number;
  zoneColor?: string;
  zoneLabel?: string;
}

export default function ReadinessRing({ 
  readinessScore, 
  size = 120, 
  strokeWidth = 10,
  zoneColor,
  zoneLabel
}: ReadinessRingProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Normalize score to 0-1 range
  const normalizedScore = useMemo(() => 
    Math.max(0, Math.min(1, readinessScore / 100)), 
    [readinessScore]
  );
  
  // Determine color based on score
  const progressColor = useMemo(() => {
    if (zoneColor) return zoneColor;
    
    if (readinessScore >= 80) return colorScheme.success;
    if (readinessScore >= 60) return colorScheme.primary;
    if (readinessScore >= 40) return colorScheme.warning;
    return colorScheme.error;
  }, [readinessScore, zoneColor, colorScheme]);
  
  // Determine label based on score
  const readinessLabel = useMemo(() => {
    if (zoneLabel) return zoneLabel;
    
    if (readinessScore >= 80) return 'Excellent';
    if (readinessScore >= 60) return 'Good';
    if (readinessScore >= 40) return 'Average';
    if (readinessScore >= 20) return 'Low';
    return 'Poor';
  }, [readinessScore, zoneLabel]);
  
  return (
    <View style={styles.container}>
      <ProgressCircle
        progress={normalizedScore}
        size={size}
        strokeWidth={strokeWidth}
        progressColor={progressColor}
        backgroundColor={colorScheme.progress?.track || '#E5E7EB'}
        showText={false}
      />
      <View style={styles.contentContainer}>
        <Text style={[styles.scoreText, { color: colorScheme.text.primary }]}>
          {readinessScore}
        </Text>
        <Text style={[styles.labelText, { color: progressColor }]}>
          {readinessLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});