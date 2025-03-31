import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookText, ArrowRight } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

interface ReflectionPromptProps {
  onPress: () => void;
  style?: any;
}

export default function ReflectionPrompt({ onPress, style }: ReflectionPromptProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.card, style]} variant="elevated">
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <BookText size={22} color={colors.primary} />
          </View>
          <Text style={styles.title}>Quick Debrief</Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.promptText}>
          What got in your way today?
        </Text>
        
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Log Reflection</Text>
          <ArrowRight size={18} color={colors.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  promptText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});