import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useThemeStore } from '@/store/theme-store';

interface LearnCardProps {
  category: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

export default function LearnCard({ 
  category, 
  title, 
  content, 
  icon,
  color 
}: LearnCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={[styles.category, { color: colorScheme.text.secondary }]}>{category}</Text>
      </View>
      
      <Text style={[styles.title, { color: colorScheme.text.primary }]}>{title}</Text>
      
      <Text 
        style={[
          styles.content, 
          { color: colorScheme.text.secondary },
          !expanded && styles.contentCollapsed
        ]}
        numberOfLines={expanded ? undefined : 2}
      >
        {content}
      </Text>
      
      <TouchableOpacity 
        style={styles.readMoreButton}
        onPress={toggleExpand}
      >
        <Text style={[styles.readMoreText, { color: colorScheme.primary }]}>
          {expanded ? 'Show Less' : 'Read More'}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  contentCollapsed: {
    marginBottom: 8,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  readMoreText: {
    fontWeight: '600',
  },
});