import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '@/components/HeaderBar';
import WisdomCard from '@/components/WisdomCard';
import { useWisdomStore } from '@/store/wisdom-store';
import { formatDate } from '@/utils/date-utils';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

export default function WisdomScreen() {
  const todayEntries = useWisdomStore(state => state.todayEntries);
  const refreshTodayEntries = useWisdomStore(state => state.refreshTodayEntries);
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  const [refreshing, setRefreshing] = React.useState(false);
  
  useEffect(() => {
    if (todayEntries.length === 0) {
      refreshTodayEntries();
    }
  }, [todayEntries.length, refreshTodayEntries]);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshTodayEntries();
    setRefreshing(false);
  }, [refreshTodayEntries]);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <HeaderBar 
        title="Daily Wisdom" 
        date={formatDate(new Date())} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme.primary]}
            tintColor={colorScheme.primary}
          />
        }
      >
        {todayEntries.map(entry => (
          <WisdomCard key={entry.id} entry={entry} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
});