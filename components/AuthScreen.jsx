import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, BG, CARD, TEXT, TEXT2, BORDER, ACCENT, SUCCESS, useApp } from './core';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, theme } = useApp();

  const [isLogin, setIsLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [selectedRole, setSelectedRole] = useState('resident');

  const ROLES = [
    { id: 'resident', label: 'Resident' },
    { id: 'admin', label: 'Admin' },
  ];

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) return;
    login(selectedRole);
  };

  const handleGoogleLogin = () => {
    login(selectedRole);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.bg }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
        {/* Header section */}
        <View style={{ paddingTop: insets.top + 40, paddingHorizontal: 24, alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: PRIMARY + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <MaterialIcons name="location-city" size={40} color={PRIMARY} />
          </View>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>ColonyCare</Text>
          <Text style={{ color: theme.text2, fontSize: 15, textAlign: 'center' }}>Smarter community management for everyone.</Text>
        </View>

        {/* Main Card */}
        <View style={{ flex: 1, marginTop: 40, paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: theme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }}>
            
            {/* Toggle Login/Signup */}
            <View style={{ flexDirection: 'row', backgroundColor: theme.bg, borderRadius: 12, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: theme.border }}>
              <TouchableOpacity onPress={() => { setIsLogin(false); setStep('phone'); }} style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: !isLogin ? theme.card : 'transparent', alignItems: 'center', shadowColor: !isLogin ? '#000' : 'transparent', shadowOpacity: 0.1, shadowRadius: 4, elevation: !isLogin ? 2 : 0 }}>
                <Text style={{ color: !isLogin ? theme.text : theme.text2, fontWeight: !isLogin ? '700' : '500' }}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setIsLogin(true); setStep('phone'); }} style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: isLogin ? theme.card : 'transparent', alignItems: 'center', shadowColor: isLogin ? '#000' : 'transparent', shadowOpacity: 0.1, shadowRadius: 4, elevation: isLogin ? 2 : 0 }}>
                <Text style={{ color: isLogin ? theme.text : theme.text2, fontWeight: isLogin ? '700' : '500' }}>Login</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
              {isLogin ? 'Welcome Back!' : 'Create an Account'}
            </Text>

            {/* Phone Flow */}
            {step === 'phone' ? (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.text2, fontSize: 13, marginBottom: 8, marginLeft: 4 }}>Phone Number</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.bg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, height: 54 }}>
                  <Text style={{ color: theme.text2, fontSize: 16, marginRight: 8 }}>+91</Text>
                  <View style={{ width: 1, height: 24, backgroundColor: theme.border, marginRight: 12 }} />
                  <TextInput
                    style={{ flex: 1, color: theme.text, fontSize: 16, height: '100%' }}
                    placeholder="Enter mobile number"
                    placeholderTextColor={theme.text2 + '88'}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                  />
                </View>
                <TouchableOpacity onPress={handleSendOTP} style={{ backgroundColor: PRIMARY, borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 24, opacity: phone.length >= 10 ? 1 : 0.5 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginLeft: 4 }}>
                  <Text style={{ color: theme.text2, fontSize: 13 }}>Enter 4-digit OTP</Text>
                  <TouchableOpacity onPress={() => setStep('phone')}>
                    <Text style={{ color: PRIMARY, fontSize: 12, fontWeight: '600' }}>Edit Number</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.bg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, height: 54 }}>
                  <MaterialIcons name="lock-outline" size={20} color={theme.text2} style={{ marginRight: 12 }} />
                  <TextInput
                    style={{ flex: 1, color: theme.text, fontSize: 18, letterSpacing: 8, height: '100%' }}
                    placeholder="••••"
                    placeholderTextColor={theme.text2 + '88'}
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity onPress={handleVerifyOTP} style={{ backgroundColor: SUCCESS, borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 24, opacity: otp.length === 4 ? 1 : 0.5 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Verify & Continue</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
              <Text style={{ color: theme.text2, marginHorizontal: 12, fontSize: 12 }}>OR</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
            </View>

            {/* Google Login */}
            <TouchableOpacity onPress={handleGoogleLogin} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg, borderRadius: 12, height: 54, borderWidth: 1, borderColor: theme.border }}>
              <Ionicons name="logo-google" size={20} color={theme.text} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Temporary Role Selection for Testing */}
            <View style={{ marginTop: 30, padding: 16, backgroundColor: theme.bg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, borderStyle: 'dashed' }}>
              <Text style={{ color: theme.text2, fontSize: 11, textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Login As (Testing)</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {ROLES.map(r => (
                  <TouchableOpacity key={r.id} onPress={() => setSelectedRole(r.id)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: selectedRole === r.id ? PRIMARY + '22' : 'transparent', borderWidth: 1, borderColor: selectedRole === r.id ? PRIMARY : 'transparent', marginHorizontal: 4 }}>
                    <Text style={{ color: selectedRole === r.id ? PRIMARY : theme.text2, fontSize: 13, fontWeight: selectedRole === r.id ? '600' : '400' }}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
