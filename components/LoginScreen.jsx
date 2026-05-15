import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, BG, CARD, TEXT, TEXT2, BORDER, ACCENT, SECONDARY, SUCCESS, useApp } from './core';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { setUserName, setUserEmail, setRole, login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    // Simulate login
    const lowEmail = email.toLowerCase();
    const roleToSet = lowEmail.includes('admin') ? 'admin' : lowEmail.includes('worker') ? 'worker' : 'resident';
    
    setUserName(email.split('@')[0] || (roleToSet.charAt(0).toUpperCase() + roleToSet.slice(1)));
    setUserEmail(email || `${roleToSet}@colony.care`);
    setRole(roleToSet);
    login(roleToSet);
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: BG }}
      enabled={Platform.OS !== 'web'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View style={{ paddingTop: insets.top + 60, paddingHorizontal: 30, alignItems: 'center' }}>
          <View style={{ width: 70, height: 70, borderRadius: 22, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: 20, transform: [{ rotate: '45deg' }] }}>
            <View style={{ transform: [{ rotate: '-45deg' }] }}>
              <MaterialIcons name="location-city" size={38} color="#fff" />
            </View>
          </View>
          
          <Text style={{ color: TEXT, fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>Welcome Back</Text>
          <Text style={{ color: TEXT2, fontSize: 14, textAlign: 'center', marginBottom: 40 }}>Login to access your colony portal</Text>

          <View style={{ width: '100%', backgroundColor: CARD, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: BORDER }}>
            <Text style={{ color: TEXT2, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Login with Social</Text>
            
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
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
                    <Text style={{ color: '#000', fontSize: 13, fontWeight: 'bold', marginLeft: 8 }}>Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              <Text style={{ color: TEXT2, fontSize: 12, marginHorizontal: 10 }}>OR</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="mail-outline" size={20} color={TEXT2} />
                <TextInput 
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email or Phone"
                  placeholderTextColor={TEXT2 + '66'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12 }}>
                <MaterialIcons name="lock-outline" size={20} color={TEXT2} />
                <TextInput 
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={TEXT2 + '66'}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10, color: TEXT, fontSize: 14 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color={TEXT2} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name={rememberMe ? "check-box" : "check-box-outline-blank"} size={20} color={rememberMe ? PRIMARY : TEXT2} />
                <Text style={{ color: TEXT2, fontSize: 13, marginLeft: 6 }}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: PRIMARY, fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleLogin}
              style={{ backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Login to Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Signup')}
              style={{ marginTop: 20, alignItems: 'center' }}
            >
              <Text style={{ color: TEXT2, fontSize: 13 }}>Don&apos;t have an account? <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Sign up</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
