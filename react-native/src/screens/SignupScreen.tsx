import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';

export const SignupScreen: React.FC = () => {
  const { setIsAuthenticated } = useOnboardingStore();

  const handleSignup = () => {
    // For now, just mark as authenticated
    // You'll implement actual authentication later
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>FinTrackr</Text>
          <Text style={styles.subtitle}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputPlaceholder}>
            <Text style={styles.placeholderText}>Full Name (coming soon)</Text>
          </View>

          <View style={styles.inputPlaceholder}>
            <Text style={styles.placeholderText}>Email input (coming soon)</Text>
          </View>
          
          <View style={styles.inputPlaceholder}>
            <Text style={styles.placeholderText}>Password input (coming soon)</Text>
          </View>

          <View style={styles.inputPlaceholder}>
            <Text style={styles.placeholderText}>Confirm Password (coming soon)</Text>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#6366F1',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    color: '#6B7280',
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
