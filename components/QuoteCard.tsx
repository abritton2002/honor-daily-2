import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quote } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { WisdomEntry } from '@/types/wisdom';

interface QuoteCardProps {
  quote: WisdomEntry;
  style?: any;
}

export default function QuoteCard({ quote, style }: QuoteCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.quoteIconContainer}>
        <Quote size={20} color={colors.text.primary} />
      </View>
      
      <Text style={styles.quoteText}>{quote.content}</Text>
      
      {quote.source && (
        <Text style={styles.source}>— {quote.source}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  quoteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteText: {
    ...typography.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  source: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'right',
  },
});