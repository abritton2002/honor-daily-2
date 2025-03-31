import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface HeaderBarProps {
  title: string;
  date?: string;
  showSettings?: boolean;
}

export default function HeaderBar({ 
  title, 
  date, 
  showSettings = true 
}: HeaderBarProps) {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const navigateToSettings = () => {
    router.push('/settings');
  };
  
  return (
    <View style={[styles.container, { borderBottomColor: colorScheme.border }]}>
      <View>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>{title}</Text>
        {date && <Text style={[styles.date, { color: colorScheme.text.secondary }]}>{date}</Text>}
      </View>
      
      {showSettings && (
        <TouchableOpacity 
          onPress={navigateToSettings}
          style={[styles.settingsButton, { backgroundColor: colorScheme.cardBackgroundAlt }]}
        >
          <Settings size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});