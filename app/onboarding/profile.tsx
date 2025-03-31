import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/Button';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useThemeStore } from '@/store/theme-store';

export default function ProfileCreationScreen() {
  const router = useRouter();
  const createProfile = useProfileStore((state) => state.createProfile);
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
  });
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      createProfile(formData);
      router.replace('/');
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colorScheme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colorScheme.text.primary }]}>Create Your Profile</Text>
          <Text style={[styles.subtitle, { color: colorScheme.text.secondary }]}>
            Tell us a bit about yourself to get started
          </Text>
        </View>
        
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
            {formData.avatar ? (
              <Image source={{ uri: formData.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                <User size={40} color={colorScheme.text.secondary} />
              </View>
            )}
            <View style={[styles.cameraButton, { 
              backgroundColor: colorScheme.primary,
              borderColor: colorScheme.background
            }]}>
              <Camera size={16} color={colorScheme.text.inverse} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colorScheme.text.primary }]}>Name</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colorScheme.cardBackground,
                borderColor: colorScheme.border,
                color: colorScheme.text.primary
              },
              errors.name ? [styles.inputError, { borderColor: colorScheme.error }] : null
            ]}
            placeholder="Your name"
            placeholderTextColor={colorScheme.text.light}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          {errors.name ? (
            <Text style={[styles.errorText, { color: colorScheme.error }]}>{errors.name}</Text>
          ) : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colorScheme.text.primary }]}>Bio (Optional)</Text>
          <TextInput
            style={[
              styles.input, 
              styles.textArea,
              { 
                backgroundColor: colorScheme.cardBackground,
                borderColor: colorScheme.border,
                color: colorScheme.text.primary
              }
            ]}
            placeholder="Tell us a bit about yourself"
            placeholderTextColor={colorScheme.text.light}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <Button
          title="Create Profile"
          onPress={handleSubmit}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 2,
  },
  textArea: {
    minHeight: 120,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    marginTop: 16,
  },
});