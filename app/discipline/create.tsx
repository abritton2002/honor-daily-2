import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Lightbulb, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useInsightsStore } from '@/store/insights-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { DisciplineFrequency } from '@/types/disciplines';

export default function CreateDisciplineScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const { addDiscipline } = useDisciplinesStore();
  const { getRecommendations, logActivity } = useInsightsStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequency, setFrequency] = useState<DisciplineFrequency>('daily');
  const [scheduledDays, setScheduledDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Default to all days
  
  // Get discipline recommendations
  const disciplineRecommendations = getRecommendations('disciplines', 2);
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your discipline.');
      return;
    }
    
    // Validate scheduled days for non-daily frequencies
    if (frequency !== 'daily' && scheduledDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day for your discipline.');
      return;
    }
    
    addDiscipline({
      title,
      description,
      reminderTime: reminderTime.toISOString(),
      frequency,
      scheduledDays,
    });
    
    // Log activity
    logActivity('disciplines', 'create_discipline', {
      title,
      hasDescription: description.length > 0,
      hasReminder: true,
      frequency,
      scheduledDaysCount: scheduledDays.length
    });
    
    Alert.alert(
      'Success',
      'Your new discipline has been added.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };
  
  const applyRecommendation = (recommendation: any) => {
    if (recommendation.content) {
      setTitle(recommendation.content.title || '');
      setDescription(recommendation.content.description || '');
    }
  };
  
  const toggleDay = (day: number) => {
    if (scheduledDays.includes(day)) {
      setScheduledDays(scheduledDays.filter(d => d !== day));
    } else {
      setScheduledDays([...scheduledDays, day].sort());
    }
  };
  
  const handleFrequencyChange = (newFrequency: DisciplineFrequency) => {
    setFrequency(newFrequency);
    
    // Reset scheduled days based on frequency
    if (newFrequency === 'daily') {
      setScheduledDays([0, 1, 2, 3, 4, 5, 6]); // All days
    } else if (newFrequency === 'weekly') {
      setScheduledDays([0]); // Default to Sunday
    } else {
      // For custom, keep current selection or default to weekdays
      if (scheduledDays.length === 7) {
        setScheduledDays([1, 2, 3, 4, 5]); // Weekdays
      }
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colorScheme.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Add Discipline</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {disciplineRecommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Recommended for You
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colorScheme.text.secondary }]}>
                Based on your patterns and growth areas
              </Text>
              
              {disciplineRecommendations.map((recommendation, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => applyRecommendation(recommendation)}
                  activeOpacity={0.8}
                >
                  <Card style={styles.recommendationCard}>
                    <View style={styles.recommendationHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: `${colorScheme.primary}20` }]}>
                        <Lightbulb size={20} color={colorScheme.primary} />
                      </View>
                      <Text style={[styles.recommendationTitle, { color: colorScheme.text.primary }]}>
                        {recommendation.title}
                      </Text>
                    </View>
                    <Text style={[styles.recommendationDescription, { color: colorScheme.text.secondary }]}>
                      {recommendation.description}
                    </Text>
                    <Text style={[styles.recommendationReason, { color: colorScheme.primary }]}>
                      {recommendation.reason}
                    </Text>
                    <TouchableOpacity 
                      style={[styles.useButton, { backgroundColor: colorScheme.primary }]}
                      onPress={() => applyRecommendation(recommendation)}
                    >
                      <Text style={styles.useButtonText}>Use This</Text>
                    </TouchableOpacity>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
              Discipline Details
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colorScheme.text.secondary }]}>Title</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colorScheme.cardBackground,
                    color: colorScheme.text.primary,
                    borderColor: colorScheme.border
                  }
                ]}
                placeholder="e.g., Morning Meditation"
                placeholderTextColor={colorScheme.text.muted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colorScheme.text.secondary }]}>Description (Optional)</Text>
              <TextInput
                style={[
                  styles.textArea, 
                  { 
                    backgroundColor: colorScheme.cardBackground,
                    color: colorScheme.text.primary,
                    borderColor: colorScheme.border
                  }
                ]}
                placeholder="Describe your discipline..."
                placeholderTextColor={colorScheme.text.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colorScheme.text.secondary }]}>Frequency</Text>
              <View style={styles.frequencyOptions}>
                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    frequency === 'daily' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
                  ]}
                  onPress={() => handleFrequencyChange('daily')}
                >
                  <Text style={[
                    styles.frequencyOptionText,
                    frequency === 'daily' && styles.frequencyOptionTextSelected
                  ]}>
                    Daily
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    frequency === 'weekly' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
                  ]}
                  onPress={() => handleFrequencyChange('weekly')}
                >
                  <Text style={[
                    styles.frequencyOptionText,
                    frequency === 'weekly' && styles.frequencyOptionTextSelected
                  ]}>
                    Weekly
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.frequencyOption,
                    frequency === 'custom' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
                  ]}
                  onPress={() => handleFrequencyChange('custom')}
                >
                  <Text style={[
                    styles.frequencyOptionText,
                    frequency === 'custom' && styles.frequencyOptionTextSelected
                  ]}>
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {frequency !== 'daily' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colorScheme.text.secondary }]}>Scheduled Days</Text>
                <View style={[
                  styles.daysContainer, 
                  { 
                    backgroundColor: colorScheme.cardBackground,
                    borderColor: colorScheme.border
                  }
                ]}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayButton,
                        scheduledDays.includes(index) && [
                          styles.dayButtonSelected, 
                          { backgroundColor: colorScheme.primary }
                        ]
                      ]}
                      onPress={() => toggleDay(index)}
                    >
                      <Text style={[
                        styles.dayButtonText,
                        scheduledDays.includes(index) && styles.dayButtonTextSelected
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colorScheme.text.secondary }]}>Reminder Time</Text>
              <TouchableOpacity
                style={[
                  styles.timePickerButton, 
                  { 
                    backgroundColor: colorScheme.cardBackground,
                    borderColor: colorScheme.border
                  }
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Clock size={20} color={colorScheme.text.secondary} style={styles.timeIcon} />
                <Text style={[styles.timeText, { color: colorScheme.text.primary }]}>
                  {formatTime(reminderTime)}
                </Text>
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
            
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colorScheme.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Discipline</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  recommendationReason: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  useButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    fontSize: 16,
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  frequencyOptionSelected: {
    borderColor: 'transparent',
  },
  frequencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyOptionTextSelected: {
    color: '#FFFFFF',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dayButton: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: '0.5%',
  },
  dayButtonSelected: {
    borderColor: 'transparent',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});