import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Clock, Trash2, Calendar } from 'lucide-react-native';
import Button from '@/components/Button';
import { useDisciplinesStore } from '@/store/disciplines-store';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { DisciplineFormData, DisciplineFrequency } from '@/types/disciplines';
import { useThemeStore } from '@/store/theme-store';

export default function EditDisciplineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const disciplines = useDisciplinesStore(state => state.disciplines);
  const updateDiscipline = useDisciplinesStore(state => state.updateDiscipline);
  const deleteDiscipline = useDisciplinesStore(state => state.deleteDiscipline);
  
  const discipline = disciplines.find(d => d.id === id);
  
  const [formData, setFormData] = useState<DisciplineFormData>({
    title: '',
    description: '',
    reminderTime: '',
    frequency: 'daily',
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });
  
  useEffect(() => {
    if (discipline) {
      setFormData({
        title: discipline.title,
        description: discipline.description,
        reminderTime: discipline.reminderTime,
        frequency: discipline.frequency || 'daily',
        scheduledDays: discipline.scheduledDays || [0, 1, 2, 3, 4, 5, 6],
      });
    }
  }, [discipline]);
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    // Validate scheduled days for non-daily frequencies
    if (formData.frequency !== 'daily' && formData.scheduledDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day for your discipline.');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = () => {
    if (validateForm() && id) {
      updateDiscipline(id, formData);
      router.back();
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Discipline",
      "Are you sure you want to delete this discipline?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            if (id) {
              deleteDiscipline(id);
              router.back();
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const toggleDay = (day: number) => {
    if (formData.scheduledDays.includes(day)) {
      setFormData({
        ...formData,
        scheduledDays: formData.scheduledDays.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        scheduledDays: [...formData.scheduledDays, day].sort()
      });
    }
  };
  
  const handleFrequencyChange = (newFrequency: DisciplineFrequency) => {
    let updatedScheduledDays = formData.scheduledDays;
    
    // Reset scheduled days based on frequency
    if (newFrequency === 'daily') {
      updatedScheduledDays = [0, 1, 2, 3, 4, 5, 6]; // All days
    } else if (newFrequency === 'weekly' && formData.scheduledDays.length === 7) {
      updatedScheduledDays = [0]; // Default to Sunday if currently all days
    } else if (newFrequency === 'custom' && formData.scheduledDays.length === 7) {
      updatedScheduledDays = [1, 2, 3, 4, 5]; // Weekdays if currently all days
    }
    
    setFormData({
      ...formData,
      frequency: newFrequency,
      scheduledDays: updatedScheduledDays
    });
  };
  
  if (!discipline) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
        <Text style={[typography.body, { color: colorScheme.text.primary }]}>Discipline not found</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colorScheme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={[typography.subtitle, styles.label, { color: colorScheme.text.primary }]}>Title</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colorScheme.cardBackground,
                borderColor: colorScheme.border,
                color: colorScheme.text.primary
              },
              errors.title ? [styles.inputError, { borderColor: colorScheme.error }] : null
            ]}
            placeholder="e.g., Morning Prayer"
            placeholderTextColor={colorScheme.text.light}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          {errors.title ? (
            <Text style={[styles.errorText, { color: colorScheme.error }]}>{errors.title}</Text>
          ) : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[typography.subtitle, styles.label, { color: colorScheme.text.primary }]}>Description</Text>
          <TextInput
            style={[
              styles.input, 
              styles.textArea,
              { 
                backgroundColor: colorScheme.cardBackground,
                borderColor: colorScheme.border,
                color: colorScheme.text.primary
              },
              errors.description ? [styles.inputError, { borderColor: colorScheme.error }] : null
            ]}
            placeholder="e.g., Spend 5 minutes in prayer to start the day"
            placeholderTextColor={colorScheme.text.light}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.description ? (
            <Text style={[styles.errorText, { color: colorScheme.error }]}>{errors.description}</Text>
          ) : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[typography.subtitle, styles.label, { color: colorScheme.text.primary }]}>Frequency</Text>
          <View style={styles.frequencyOptions}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                formData.frequency === 'daily' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
              ]}
              onPress={() => handleFrequencyChange('daily')}
            >
              <Text style={[
                styles.frequencyOptionText,
                { color: colorScheme.text.primary },
                formData.frequency === 'daily' && styles.frequencyOptionTextSelected
              ]}>
                Daily
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                formData.frequency === 'weekly' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
              ]}
              onPress={() => handleFrequencyChange('weekly')}
            >
              <Text style={[
                styles.frequencyOptionText,
                { color: colorScheme.text.primary },
                formData.frequency === 'weekly' && styles.frequencyOptionTextSelected
              ]}>
                Weekly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                formData.frequency === 'custom' && [styles.frequencyOptionSelected, { backgroundColor: colorScheme.primary }]
              ]}
              onPress={() => handleFrequencyChange('custom')}
            >
              <Text style={[
                styles.frequencyOptionText,
                { color: colorScheme.text.primary },
                formData.frequency === 'custom' && styles.frequencyOptionTextSelected
              ]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {formData.frequency !== 'daily' && (
          <View style={styles.formGroup}>
            <Text style={[typography.subtitle, styles.label, { color: colorScheme.text.primary }]}>Scheduled Days</Text>
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
                    formData.scheduledDays.includes(index) && [
                      styles.dayButtonSelected, 
                      { backgroundColor: colorScheme.primary }
                    ]
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    { color: colorScheme.text.primary },
                    formData.scheduledDays.includes(index) && styles.dayButtonTextSelected
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={[typography.subtitle, styles.label, { color: colorScheme.text.primary }]}>Reminder Time</Text>
          <View style={[
            styles.timeInputContainer,
            { 
              backgroundColor: colorScheme.cardBackground,
              borderColor: colorScheme.border
            }
          ]}>
            <Clock size={20} color={colorScheme.text.light} style={styles.timeIcon} />
            <TextInput
              style={[styles.timeInput, { color: colorScheme.text.primary }]}
              placeholder="08:00"
              placeholderTextColor={colorScheme.text.light}
              value={formData.reminderTime}
              onChangeText={(text) => setFormData({ ...formData, reminderTime: text })}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <Text style={[styles.helperText, { color: colorScheme.text.light }]}>
            Format: 24-hour time (e.g., 08:00, 14:30)
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colorScheme.error} />
            <Text style={[styles.deleteText, { color: colorScheme.error }]}>Delete Discipline</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 2,
  },
  textArea: {
    minHeight: 100,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  deleteText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
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
});