import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, Calendar } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';
import Card from '@/components/Card';
import LearnCard from '@/components/LearnCard';
import { useLearnStore } from '@/store/learn-store';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useSubscriptionStore } from '@/store/subscription-store';

export default function LearnScreen() {
  const router = useRouter();
  const { learningItems, categories, getLearningStats } = useLearnStore();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  const { isPremiumFeatureAvailable } = useSubscriptionStore();
  
  // Get learning stats
  const { currentStreak, weeklyProgress } = getLearningStats();
  
  // Get a random item from each category
  const featuredItems = categories.map(category => {
    const categoryItems = learningItems.filter(item => item.category === category);
    const randomIndex = Math.floor(Math.random() * categoryItems.length);
    return categoryItems[randomIndex];
  });
  
  const getCategoryColor = (category) => {
    const categoryColors = {
      'Leadership': colorScheme.primary,
      'Productivity': colorScheme.secondary,
      'Finance': '#4CAF50',
      'Mental Models': '#FF9800',
      'Performance': '#9C27B0'
    };
    
    return categoryColors[category] || colorScheme.primary;
  };
  
  const renderWeekDay = (isCompleted, index) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <View key={index} style={styles.weekDayContainer}>
        <View 
          style={[
            styles.weekDayCircle, 
            { 
              backgroundColor: isCompleted 
                ? colorScheme.primary 
                : 'transparent',
              borderColor: isCompleted 
                ? colorScheme.primary 
                : colorScheme.border
            }
          ]}
        />
        <Text style={[styles.weekDayText, { color: colorScheme.text.secondary }]}>
          {days[index]}
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <HeaderBar 
        title="Daily Learning" 
        showDate 
        rightIcon={
          <TouchableOpacity onPress={() => router.push('/learning/history')}>
            <Calendar size={24} color={colorScheme.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={[styles.streakTitle, { color: colorScheme.text.primary }]}>
              {currentStreak > 0 
                ? `${currentStreak} Day Streak!` 
                : "Start Your Streak Today"}
            </Text>
            <BookOpen size={20} color={colorScheme.primary} />
          </View>
          
          <View style={styles.weekContainer}>
            {weeklyProgress.map((isCompleted, index) => renderWeekDay(isCompleted, index))}
          </View>
        </Card>
        
        <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
          Today's Learning
        </Text>
        
        {/* Featured Learning Items */}
        {featuredItems.map((item, index) => (
          <LearnCard
            key={index}
            category={item.category}
            title={item.title}
            content={item.content}
            icon={<BookOpen size={20} color="#FFFFFF" />}
            color={getCategoryColor(item.category)}
          />
        ))}
        
        {/* View History Button */}
        <TouchableOpacity 
          style={[styles.historyButton, { borderColor: colorScheme.border }]}
          onPress={() => router.push('/learning/history')}
        >
          <Text style={[styles.historyButtonText, { color: colorScheme.text.primary }]}>
            View Learning History
          </Text>
          <ChevronRight size={20} color={colorScheme.text.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  streakCard: {
    padding: 16,
    marginBottom: 24,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekDayContainer: {
    alignItems: 'center',
  },
  weekDayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 4,
  },
  weekDayText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  historyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});