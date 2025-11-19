import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';

// Simple test component to verify boolean props work correctly
export const TestBoolean = () => {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Boolean Test</Text>
      
      {/* Test 1: TextInput with explicit boolean multiline */}
      <Text style={{ marginBottom: 10 }}>Test 1: Multiline explicitly true</Text>
      <TextInput
        multiline={true}
        numberOfLines={3}
        placeholder="This should be multiline"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
      />
      
      {/* Test 2: TextInput with boolean false */}
      <Text style={{ marginBottom: 10 }}>Test 2: Multiline explicitly false</Text>
      <TextInput
        multiline={false}
        placeholder="This should NOT be multiline"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
      />
      
      {/* Test 3: ScrollView with explicit horizontal */}
      <Text style={{ marginBottom: 10 }}>Test 3: Horizontal ScrollView</Text>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 100, height: 100, backgroundColor: 'red', marginRight: 10 }} />
          <View style={{ width: 100, height: 100, backgroundColor: 'blue', marginRight: 10 }} />
          <View style={{ width: 100, height: 100, backgroundColor: 'green', marginRight: 10 }} />
        </View>
      </ScrollView>
      
      <Text style={{ color: 'green', fontSize: 18 }}>✓ If you see this, booleans work!</Text>
    </View>
  );
};
