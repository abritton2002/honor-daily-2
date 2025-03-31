import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BookText } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface JournalPromptProps {
  prompt: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSave?: () => void;
  onPress?: () => void;
}

export default function JournalPrompt({ 
  prompt, 
  value = '', 
  onChangeText,
  onSave,
  onPress
}: JournalPromptProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // If onPress is provided, render a touchable card
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
              <BookText size={20} color={colorScheme.text.primary} />
            </View>
            <Text style={[styles.title, { color: colorScheme.text.primary }]}>Today's Prompt</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
          
          <Text style={[styles.prompt, { color: colorScheme.text.secondary }]}>
            {prompt}
          </Text>
          
          <View style={[styles.previewContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
            <Text style={[styles.previewText, { color: colorScheme.text.muted }]}>
              Tap to write your journal entry...
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
  
  // Otherwise render the editable version
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
          <BookText size={20} color={colorScheme.text.primary} />
        </View>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>Today's Prompt</Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
      
      <Text style={[styles.prompt, { color: colorScheme.text.secondary }]}>
        {prompt}
      </Text>
      
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: colorScheme.border,
            backgroundColor: colorScheme.cardBackgroundAlt,
            color: colorScheme.text.primary
          }
        ]}
        multiline
        placeholder="Write your thoughts here..."
        placeholderTextColor={colorScheme.text.muted}
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
      />
      
      {onSave && (
        <Button 
          title="Save Journal Entry" 
          onPress={onSave}
          style={styles.button}
        />
      )}
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
  prompt: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
  },
  previewContainer: {
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});