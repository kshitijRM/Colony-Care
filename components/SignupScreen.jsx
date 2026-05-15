import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, BG, CARD, TEXT, TEXT2, BORDER, ACCENT, SECONDARY, SUCCESS, useApp } from './core';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { setRole, setUserName, setUserEmail, login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('resident');

  const handleSignup = () => {
    // Simulate signup
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    else if (phone) setUserEmail(phone + '@colony.care'); // Fallback email for phone login
    setRole(selectedRole);
    login(selectedRole);
    navigation.replace('MainApp');
  };

  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    setTimeout(() => {
      setUserName('Kshitij Dinni');
      setUserEmail('kshitijdinni6605@gmail.com');
      setRole('resident');
      login('resident');
      setLoadingGoogle(false);
      navigation.replace('MainApp');
    }, 2000);
  };

  const ROLES = [
    { id: 'resident', label: 'Resident', icon: 'person', color: PRIMARY },
    { id: 'admin', label: 'Admin', icon: 'admin-panel-settings', color: ACCENT },
    { id: 'worker', label: 'Worker', icon: 'engineering', color: SUCCESS },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: BG }}
      enabled={Platform.OS !== 'web'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View style={{ paddingTop: insets.top + 40, paddingHorizontal: 30, alignItems: 'center' }}>
          <View style={{ width: 70, height: 70, borderRadius: 22, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: 20, transform: [{ rotate: '45deg' }] }}>
            <View style={{ transform: [{ rotate: '-45deg' }] }}>
              <MaterialIcons name="location-city" size={38} color="#fff" />
            </View>
          </View>
          
          <Text style={{ color: TEXT, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>ColonyCare</Text>
          <Text style={{ color: TEXT2, fontSize: 14, textAlign: 'center', marginBottom: 30 }}>Join your smart community today</Text>

          <View style={{ width: '100%', backgroundColor: CARD, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: BORDER }}>
            <Text style={{ color: TEXT2, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Sign up with Social</Text>
            
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <TouchableOpacity 
                onPress={handleGoogleLogin}
                disabled={loadingGoogle}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, opacity: loadingGoogle ? 0.7 : 1 }}
              >
                {loadingGoogle ? (
                  <ActivityIndicator size="small" color="#EA4335" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="google" size={18} color="#EA4335" />
                    <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold', marginLeft: 8 }}>Sign up with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              <Text style={{ color: TEXT2, fontSize: 12, marginHorizontal: 10 }}>OR</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
            </View>

            <Text style={{ color: TEXT2, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Account Details</Text>
            
            <View style={{ flexDirection: 'row', backgroundColor: BG, borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: BORDER }}>
              {ROLES.map(r => (
                <TouchableOpacity 
                  key={r.id} 
                  onPress={() => setSelectedRole(r.id)} 
                  style={{ 
                    flex: 1, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: selectedRole === r.id ? r.color : 'transparent', 
                    borderRadius: 10, 
                    paddingVertical: 10 
                  }}
                >
                  <MaterialIcons name={r.icon} size={16} color={selectedRole === r.id ? '#fff' : TEXT2} />
                  <Text style={{ color: selectedRole === r.id ? '#fff' : TEXT2, fontSize: 11, fontWeight: selectedRole === r.id ? '700' : '400', marginLeft: 4 }}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="person-outline" size={20} color={TEXT2} />
                <TextInput 
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  placeholderTextColor={TEXT2 + '66'}
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="mail-outline" size={20} color={TEXT2} />
                <TextInput 
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor={TEXT2 + '66'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="phone" size={20} color={TEXT2} />
                <TextInput 
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone Number"
                  placeholderTextColor={TEXT2 + '66'}
                  keyboardType="phone-pad"
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="lock-outline" size={20} color={TEXT2} />
                <TextInput 
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={TEXT2 + '66'}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color={TEXT2} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSignup}
              style={{ backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 14, alignItems: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={{ color: TEXT2, fontSize: 13 }}>Already have an account? <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
