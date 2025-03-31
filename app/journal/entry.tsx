import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, Lightbulb } from 'lucide-react-native';
import { useJournalStore } from '@/store/journal-store';
import { useInsightsStore } from '@/store/insights-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import Card from '@/components/Card';
import PremiumFeatureOverlay from '@/components/PremiumFeatureOverlay';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

export default function JournalEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const entryId = params.id as string;
  
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get journal store functions with error handling
  const journalStore = useJournalStore();
  const insightsStore = useInsightsStore();
  const subscriptionStore = useSubscriptionStore();
  
  // Safely access functions with fallbacks
  const currentPrompt = journalStore.currentPrompt;
  const addEntry = journalStore.addEntry || (() => "");
  const getEntryById = journalStore.getEntryById || (() => undefined);
  const getEntryForDate = journalStore.getEntryForDate || (() => undefined);
  
  const logActivity = insightsStore.logActivity || (() => {});
  const analyzeJournalEntry = insightsStore.analyzeJournalEntry || (() => ({}));
  
  const isPremiumFeatureAvailable = subscriptionStore.isPremiumFeatureAvailable || (() => false);
  const PREMIUM_FEATURES = {
    ANALYTICS: "analytics"
  };
  const isPremium = isPremiumFeatureAvailable(PREMIUM_FEATURES.ANALYTICS);
  
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [journalAnalysis, setJournalAnalysis] = useState<any>(null);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);
  
  // Load entry content if editing an existing entry
  useEffect(() => {
    try {
      if (entryId) {
        const entry = getEntryById(entryId);
        if (entry) {
          setContent(entry.content);
          updateWordCount(entry.content);
        }
      } else {
        // Check if there's an existing entry for today
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = getEntryForDate(today);
        
        if (existingEntry) {
          setContent(existingEntry.content);
          updateWordCount(existingEntry.content);
        }
      }
    } catch (error) {
      console.error('Error loading journal entry:', error);
    }
  }, [entryId, getEntryById, getEntryForDate]);
  
  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() === '' ? 0 : words.length);
  };
  
  const handleContentChange = (text: string) => {
    setContent(text);
    updateWordCount(text);
  };
  
  const handleSave = () => {
    try {
      if (content.trim() === '') {
        Alert.alert('Empty Entry', 'Please write something before saving.');
        return;
      }
      
      const savedEntryId = addEntry(content);
      
      // Log journal activity
      try {
        logActivity('journal', 'save_entry', { 
          wordCount,
          promptId: currentPrompt?.id,
          entryId: savedEntryId
        });
      } catch (error) {
        console.error('Error logging activity:', error);
      }
      
      Alert.alert(
        'Entry Saved',
        'Your journal entry has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    }
  };
  
  const handleAnalyze = () => {
    try {
      if (content.trim() === '') {
        Alert.alert('Empty Entry', 'Please write something before analyzing.');
        return;
      }
      
      if (!isPremium) {
        setShowPremiumOverlay(true);
        return;
      }
      
      // First save the entry to get an ID
      const savedEntryId = addEntry(content);
      
      // Analyze the entry
      try {
        const analysis = analyzeJournalEntry(savedEntryId, content);
        setJournalAnalysis(analysis);
        setShowAnalysis(true);
        
        // Log analysis activity
        logActivity('journal', 'analyze_entry', { 
          entryId: savedEntryId
        });
      } catch (error) {
        console.error('Error analyzing journal entry:', error);
        Alert.alert('Analysis Error', 'Failed to analyze your journal entry. Please try again.');
      }
    } catch (error) {
      console.error('Error in analyze handler:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  
  const handleUpgradePress = () => {
    router.push('/subscription');
    setShowPremiumOverlay(false);
  };
  
  const formatTraitName = (trait: string): string => {
    if (!trait) return '';
    return typeof trait === 'string' 
      ? trait.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : '';
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
          <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Journal Entry</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={24} color={colorScheme.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {currentPrompt && (
            <Card style={styles.promptCard}>
              <Text style={[styles.promptText, { color: colorScheme.text.primary }]}>
                {currentPrompt.text}
              </Text>
            </Card>
          )}
          
          <View style={[styles.editorContainer, { backgroundColor: colorScheme.cardBackground }]}>
            <TextInput
              style={[styles.editor, { color: colorScheme.text.primary }]}
              multiline
              placeholder="Start writing here..."
              placeholderTextColor={colorScheme.text.muted}
              value={content}
              onChangeText={handleContentChange}
              autoFocus
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.wordCount, { color: colorScheme.text.secondary }]}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </Text>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, { backgroundColor: colorScheme.primary }]}
              onPress={handleAnalyze}
            >
              <Lightbulb size={18} color="#FFFFFF" style={styles.analyzeIcon} />
              <Text style={styles.analyzeText}>Analyze Entry</Text>
            </TouchableOpacity>
          </View>
          
          {showAnalysis && journalAnalysis && (
            <Card style={styles.analysisCard}>
              <Text style={[styles.analysisTitle, { color: colorScheme.text.primary }]}>
                Entry Analysis
              </Text>
              
              <View style={styles.analysisRow}>
                <Text style={[styles.analysisLabel, { color: colorScheme.text.secondary }]}>
                  Emotional Tone:
                </Text>
                <Text 
                  style={[
                    styles.analysisValue, 
                    { 
                      color: 
                        journalAnalysis.emotionalTone === 'positive' ? colorScheme.success :
                        journalAnalysis.emotionalTone === 'negative' ? colorScheme.error :
                        journalAnalysis.emotionalTone === 'mixed' ? colorScheme.warning :
                        colorScheme.text.primary
                    }
                  ]}
                >
                  {journalAnalysis.emotionalTone 
                    ? journalAnalysis.emotionalTone.charAt(0).toUpperCase() + journalAnalysis.emotionalTone.slice(1) 
                    : 'Neutral'}
                </Text>
              </View>
              
              {journalAnalysis.themes && journalAnalysis.themes.length > 0 && (
                <View style={styles.analysisRow}>
                  <Text style={[styles.analysisLabel, { color: colorScheme.text.secondary }]}>
                    Themes:
                  </Text>
                  <Text style={[styles.analysisValue, { color: colorScheme.text.primary }]}>
                    {journalAnalysis.themes.join(', ')}
                  </Text>
                </View>
              )}
              
              {journalAnalysis.growthAreas && journalAnalysis.growthAreas.length > 0 && (
                <View style={styles.analysisRow}>
                  <Text style={[styles.analysisLabel, { color: colorScheme.text.secondary }]}>
                    Growth Areas:
                  </Text>
                  <View style={styles.tagsContainer}>
                    {journalAnalysis.growthAreas.map((area: string, index: number) => (
                      <View 
                        key={index} 
                        style={[
                          styles.tag, 
                          { backgroundColor: `${colorScheme.primary}20` }
                        ]}
                      >
                        <Text style={[styles.tagText, { color: colorScheme.primary }]}>
                          {formatTraitName(area)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.analysisRow}>
                <Text style={[styles.analysisLabel, { color: colorScheme.text.secondary }]}>
                  Sentiment Score:
                </Text>
                <Text 
                  style={[
                    styles.analysisValue, 
                    { 
                      color: 
                        (journalAnalysis.sentimentScore || 0) > 0.3 ? colorScheme.success :
                        (journalAnalysis.sentimentScore || 0) < -0.3 ? colorScheme.error :
                        colorScheme.text.primary
                    }
                  ]}
                >
                  {(journalAnalysis.sentimentScore || 0).toFixed(2)}
                </Text>
              </View>
              
              <Text style={[styles.analysisNote, { color: colorScheme.text.secondary }]}>
                This analysis helps identify patterns in your journaling to provide personalized insights.
              </Text>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showPremiumOverlay && (
        <View style={styles.overlayContainer}>
          <PremiumFeatureOverlay 
            message="Upgrade to Premium to unlock AI-powered journal analysis and personalized insights."
            onUpgradePress={handleUpgradePress}
            onDismiss={() => setShowPremiumOverlay(false)}
          />
        </View>
      )}
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  promptCard: {
    padding: 16,
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  editorContainer: {
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    marginBottom: 16,
  },
  editor: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  wordCount: {
    fontSize: 14,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  analyzeIcon: {
    marginRight: 8,
  },
  analyzeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  analysisCard: {
    padding: 16,
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  analysisRow: {
    marginBottom: 12,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 14,
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
  analysisNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});