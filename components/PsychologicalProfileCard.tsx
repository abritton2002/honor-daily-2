import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface PsychologicalProfileCardProps {
  profile: {
    strengths?: string[];
    growthAreas?: string[];
    challenges?: string[];
    personalityType?: string;
    learningStyle?: string;
    motivationFactors?: string[];
  };
}

export default function PsychologicalProfileCard({ profile }: PsychologicalProfileCardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const formatTraitName = (trait: string): string => {
    if (!trait) return '';
    return typeof trait === 'string' 
      ? trait.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : '';
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
          <Brain size={24} color={colorScheme.primary} />
        </View>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>
          Psychological Profile
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
      
      {profile.personalityType && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Personality Type
          </Text>
          <Text style={[styles.personalityType, { color: colorScheme.text.secondary }]}>
            {profile.personalityType}
          </Text>
        </View>
      )}
      
      {profile.learningStyle && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Learning Style
          </Text>
          <Text style={[styles.learningStyle, { color: colorScheme.text.secondary }]}>
            {profile.learningStyle}
          </Text>
        </View>
      )}
      
      {profile.strengths && profile.strengths.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Strengths
          </Text>
          <View style={styles.tagsContainer}>
            {profile.strengths.map((strength, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: `${colorScheme.success}20` }]}
              >
                <Text style={[styles.tagText, { color: colorScheme.success }]}>
                  {formatTraitName(strength)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {profile.growthAreas && profile.growthAreas.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Growth Areas
          </Text>
          <View style={styles.tagsContainer}>
            {profile.growthAreas.map((area, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: `${colorScheme.primary}20` }]}
              >
                <Text style={[styles.tagText, { color: colorScheme.primary }]}>
                  {formatTraitName(area)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {profile.challenges && profile.challenges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Challenges
          </Text>
          <View style={styles.tagsContainer}>
            {profile.challenges.map((challenge, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: `${colorScheme.warning}20` }]}
              >
                <Text style={[styles.tagText, { color: colorScheme.warning }]}>
                  {formatTraitName(challenge)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {profile.motivationFactors && profile.motivationFactors.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
            Motivation Factors
          </Text>
          <View style={styles.tagsContainer}>
            {profile.motivationFactors.map((factor, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: `${colorScheme.accent}20` }]}
              >
                <Text style={[styles.tagText, { color: colorScheme.accent }]}>
                  {formatTraitName(factor)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  personalityType: {
    fontSize: 16,
    marginBottom: 4,
  },
  learningStyle: {
    fontSize: 16,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});