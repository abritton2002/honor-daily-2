import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  AlertCircle, 
  TrendingUp, 
  Link, 
  Award, 
  Lightbulb, 
  Flag, 
  X 
} from 'lucide-react-native';
import Card from './Card';
import { Insight } from '@/types/insights';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface InsightCardProps {
  insight: Insight;
  onPress?: () => void;
  onDismiss?: () => void;
}

function InsightCard({ insight, onPress, onDismiss }: InsightCardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Ensure insight exists and has the necessary properties
  if (!insight || !insight.type) {
    return null;
  }
  
  // Determine icon and color based on insight type
  const getIconAndColor = () => {
    // Default colors if insight colors are not defined
    const defaultColors = {
      pattern: colorScheme.info || '#3B82F6',
      correlation: colorScheme.secondary || '#8B5CF6',
      recommendation: colorScheme.success || '#10B981',
      challenge: colorScheme.warning || '#F59E0B',
      milestone: colorScheme.primary || '#6366F1',
      warning: colorScheme.error || '#EF4444'
    };
    
    // Use insight colors if available, otherwise fall back to defaults
    const insightColors = colorScheme.insight || defaultColors;
    
    switch (insight.type) {
      case 'pattern':
        return { 
          icon: <TrendingUp size={22} color={insightColors.pattern} />,
          color: insightColors.pattern
        };
      case 'correlation':
        return { 
          icon: <Link size={22} color={insightColors.correlation} />,
          color: insightColors.correlation
        };
      case 'recommendation':
        return { 
          icon: <Lightbulb size={22} color={insightColors.recommendation} />,
          color: insightColors.recommendation
        };
      case 'challenge':
        return { 
          icon: <Flag size={22} color={insightColors.challenge} />,
          color: insightColors.challenge
        };
      case 'milestone':
        return { 
          icon: <Award size={22} color={insightColors.milestone} />,
          color: insightColors.milestone
        };
      case 'warning':
        return { 
          icon: <AlertCircle size={22} color={insightColors.warning} />,
          color: insightColors.warning
        };
      default:
        return { 
          icon: <Lightbulb size={22} color={colorScheme.primary || '#6366F1'} />,
          color: colorScheme.primary || '#6366F1'
        };
    }
  };
  
  const { icon, color } = getIconAndColor();
  
  // Determine border color based on priority
  const getBorderColor = () => {
    switch (insight.priority) {
      case 'high':
        return { borderLeftColor: color, borderLeftWidth: 4 };
      case 'medium':
        return { borderLeftColor: color, borderLeftWidth: 3 };
      case 'low':
        return { borderLeftColor: color, borderLeftWidth: 2 };
      default:
        return {};
    }
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Ensure relatedAreas exists
  const relatedAreas = insight.relatedAreas || [];
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={[styles.container, getBorderColor()]}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colorScheme.text.primary }]} numberOfLines={1}>
              {insight.title}
            </Text>
            <Text style={[styles.date, { color: colorScheme.text.secondary }]}>
              {formatDate(insight.createdAt)}
            </Text>
          </View>
          {onDismiss && (
            <TouchableOpacity 
              onPress={onDismiss} 
              style={styles.dismissButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <X size={16} color={colorScheme.text.muted} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          style={[styles.description, { color: colorScheme.text.secondary }]} 
          numberOfLines={3}
        >
          {insight.description}
        </Text>
        
        <View style={styles.footer}>
          {relatedAreas.length > 0 && (
            <View style={styles.tagsContainer}>
              {relatedAreas.slice(0, 2).map((area, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.tag, 
                    { backgroundColor: `${color}20` }
                  ]}
                >
                  <Text style={[styles.tagText, { color }]}>
                    {typeof area === "string" ? area.replace('_', ' ') : ""}
                  </Text>
                </View>
              ))}
              {relatedAreas.length > 2 && (
                <Text style={[styles.moreTag, { color: colorScheme.text.muted }]}>
                  +{relatedAreas.length - 2}
                </Text>
              )}
            </View>
          )}
          
          {insight.type === 'recommendation' && (
            <Text style={[styles.actionText, { color }]}>
              Take Action
            </Text>
          )}
          
          {insight.type === 'challenge' && (
            <Text style={[styles.actionText, { color }]}>
              Accept Challenge
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  dismissButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  moreTag: {
    fontSize: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// Use memo to prevent unnecessary re-renders
export default memo(InsightCard);