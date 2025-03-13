import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const Help = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [feedback, setFeedback] = useState('');

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const handleLanguageChange = (itemValue) => setSelectedLanguage(itemValue);
  const handleFeedbackSubmit = () => alert('Feedback sent!');

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Help & Settings</Text>
      
      <View style={styles.settingContainer}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Select Language:</Text>
        <Picker selectedValue={selectedLanguage} style={styles.picker} onValueChange={handleLanguageChange}>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Русский" value="ru" />
          <Picker.Item label="Español" value="es" />
        </Picker>
      </View>
      
      <View style={styles.settingContainer}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Dark Mode:</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Frequently Asked Questions (FAQ)</Text>
      <Text style={[styles.faq, isDarkMode && styles.darkText]}>Q: How to add a product?
        {'\n'}A: Go to "My Products" and click "Add Product".
      </Text>
      <Text style={[styles.faq, isDarkMode && styles.darkText]}>Q: How to change profile details?
        {'\n'}A: Open "My Profile" and click "Edit".
      </Text>
      
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <Button title="Send Feedback" onPress={handleFeedbackSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  darkBackground: { backgroundColor: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  darkText: { color: 'white' },
  settingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { fontSize: 18 },
  picker: { height: 50, width: 150 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  faq: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 10 },
});

export default Help;
