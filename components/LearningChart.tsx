import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Text as RNText } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';

// Use conditional import for web compatibility
let Svg, G, Line, Rect, Text;
if (Platform.OS !== 'web') {
  // Import for native platforms
  const SvgComponents = require('react-native-svg');
  Svg = SvgComponents.Svg;
  G = SvgComponents.G;
  Line = SvgComponents.Line;
  Rect = SvgComponents.Rect;
  Text = SvgComponents.Text;
}

interface LearningChartProps {
  data: {
    category: string;
    completed: number;
    total: number;
  }[];
}

export default function LearningChart({ data }: LearningChartProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Always render the simplified version for web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.webChartItem}>
            <View style={styles.webChartLabelContainer}>
              <View style={[styles.webChartColorDot, { backgroundColor: getCategoryColor(index, colorScheme) }]} />
              <View style={styles.webChartLabel}>
                <RNText style={[styles.webChartLabelText, { color: colorScheme.text.primary }]}>
                  {item.category}
                </RNText>
                <RNText style={[styles.webChartLabelValue, { color: colorScheme.text.secondary }]}>
                  {item.completed} completed
                </RNText>
              </View>
            </View>
            <View style={[styles.webChartBar, { backgroundColor: colorScheme.cardBackgroundAlt || '#e0e0e0' }]}>
              <View 
                style={[
                  styles.webChartFill, 
                  { 
                    backgroundColor: getCategoryColor(index, colorScheme),
                    width: `${(item.completed / Math.max(item.total, 1)) * 100}%` 
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    );
  }
  
  // Native implementation with SVG
  const chartWidth = Dimensions.get('window').width - 48;
  const chartHeight = 200;
  const barWidth = (chartWidth - 40) / Math.min(data.length, 10); // Ensure bars fit even with many categories
  const maxValue = Math.max(...data.map(item => item.total), 5);
  
  // Calculate scale for y-axis
  const yScale = (value: number) => {
    return chartHeight - 40 - ((value / maxValue) * (chartHeight - 60));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Y-axis */}
          <Line
            x1={30}
            y1={10}
            x2={30}
            y2={chartHeight - 30}
            stroke={colorScheme.chart?.grid || colorScheme.border}
            strokeWidth={1}
          />
          
          {/* X-axis */}
          <Line
            x1={30}
            y1={chartHeight - 30}
            x2={chartWidth - 10}
            y2={chartHeight - 30}
            stroke={colorScheme.chart?.grid || colorScheme.border}
            strokeWidth={1}
          />
          
          {/* Y-axis labels */}
          {[0, maxValue / 2, maxValue].map((value, index) => (
            <G key={`y-label-${index}`}>
              <Line
                x1={28}
                y1={yScale(value)}
                x2={32}
                y2={yScale(value)}
                stroke={colorScheme.chart?.grid || colorScheme.border}
                strokeWidth={1}
              />
              <Text
                x={25}
                y={yScale(value) + 4}
                fontSize={10}
                fill={colorScheme.text.secondary}
                textAnchor="end"
              >
                {Math.round(value)}
              </Text>
            </G>
          ))}
          
          {/* Bars */}
          {data.map((item, index) => {
            const x = 40 + (index * barWidth);
            const completedHeight = ((item.completed / maxValue) * (chartHeight - 60));
            const totalHeight = ((item.total / maxValue) * (chartHeight - 60));
            
            return (
              <G key={`bar-${index}`}>
                {/* Total bar (background) */}
                <Rect
                  x={x}
                  y={yScale(item.total)}
                  width={barWidth - 10}
                  height={totalHeight}
                  fill={colorScheme.chart?.grid || colorScheme.border}
                  opacity={0.3}
                  rx={4}
                />
                
                {/* Completed bar */}
                <Rect
                  x={x}
                  y={yScale(item.completed)}
                  width={barWidth - 10}
                  height={completedHeight}
                  fill={getCategoryColor(index, colorScheme)}
                  rx={4}
                />
                
                {/* Category label */}
                <Text
                  x={x + (barWidth - 10) / 2}
                  y={chartHeight - 15}
                  fontSize={9}
                  fill={colorScheme.text.secondary}
                  textAnchor="middle"
                >
                  {item.category.substring(0, 4)}
                </Text>
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

// Helper function to get category colors
function getCategoryColor(index: number, colorScheme: any) {
  const categoryColors = [
    colorScheme.primary,
    colorScheme.secondary,
    '#4CAF50',
    '#FF9800',
    '#9C27B0',
    '#2196F3',
    '#E91E63',
    '#00BCD4',
    '#FFEB3B',
    '#795548',
  ];
  return categoryColors[index % categoryColors.length];
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  // Web-specific styles
  webContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  webChartItem: {
    marginBottom: 16,
  },
  webChartLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  webChartColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  webChartLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  webChartLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  webChartLabelValue: {
    fontSize: 14,
  },
  webChartBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  webChartFill: {
    height: 8,
    borderRadius: 4,
  },
});