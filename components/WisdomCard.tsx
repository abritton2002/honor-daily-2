import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen, DollarSign, Quote } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { WisdomEntry } from '@/types/wisdom';
import { useThemeStore } from '@/store/theme-store';

interface WisdomCardProps {
  entry: WisdomEntry;
}

export default function WisdomCard({ entry }: WisdomCardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const getIcon = () => {
    switch (entry.type) {
      case 'quote':
        return <Quote size={20} color={colorScheme.text.primary} />;
      case 'financial':
        return <DollarSign size={20} color={colorScheme.text.primary} />;
      case 'parable':
        return <BookOpen size={20} color={colorScheme.text.primary} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (entry.type) {
      case 'quote':
        return 'Daily Quote';
      case 'financial':
        return 'Financial Wisdom';
      case 'parable':
        return 'Reflection';
      default:
        return 'Wisdom';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
          {getIcon()}
        </View>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>{getTitle()}</Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
      
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colorScheme.text.primary }]}>{entry.content}</Text>
        
        {entry.source && (
          <Text style={[styles.source, { color: colorScheme.text.secondary }]}>
            — {entry.source}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  content: {
    marginTop: 4,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  source: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'right',
    fontStyle: 'italic',
  },
});