import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppProvider, BG, CARD, BORDER, DANGER, PRIMARY, TEXT2, TAB_MENU_HEIGHT, useApp } from './core';
import HomeScreen from './HomeScreen';
import ComplaintsScreen from './ComplaintsScreen';
import SOSScreen from './SOSScreen';
import FeedScreen from './FeedScreen';
import ProfileScreen from './ProfileScreen';
import RaiseComplaintScreen from './RaiseComplaintScreen';
import ComplaintDetailScreen from './ComplaintDetailScreen';
import AdminDashboardScreen from './AdminDashboardScreen';
import AnalyticsScreen from './AnalyticsScreen';
import MapViewScreen from './MapViewScreen';
import NotificationsScreen from './NotificationsScreen';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import WorkersScreen from './WorkersScreen';
import { useApp } from './core';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root, [data-reactroot] {
      height: 100% !important;
      overflow-y: auto !important;
      background-color: ${BG};
    }
    .react-navigation-container, 
    .react-navigation-container > div, 
    .react-navigation-container > div > div {
      overflow: visible !important;
      height: auto !important;
    }
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: ${BG};
    }
    ::-webkit-scrollbar-thumb {
      background: ${BORDER};
      border-radius: 5px;
      border: 2px solid ${BG};
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${PRIMARY}88;
    }
  `;
  document.head.appendChild(style);
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { role } = useApp();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom,
          borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: CARD,
          elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 12,
        },
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: TEXT2,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />, tabBarLabel: 'Home' }} />
      <Tab.Screen name="MyComplaints" component={ComplaintsScreen} options={{ tabBarLabel: 'Complaints', tabBarIcon: ({ color }) => <MaterialIcons name="report-problem" size={24} color={color} /> }} />
      {role === 'admin' ? (
        <Tab.Screen name="WorkersTab" component={WorkersScreen} options={{
          tabBarLabel: 'Staff',
          tabBarIcon: () => (
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginBottom: Platform.OS === 'ios' ? 14 : 0, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 }}>
              <MaterialIcons name="engineering" size={26} color="#fff" />
            </View>
          ),
          tabBarLabelStyle: { color: PRIMARY, fontSize: 10, fontWeight: '700' },
        }} />
      ) : (
        <Tab.Screen name="SOS" component={SOSScreen} options={{
          tabBarLabel: 'SOS',
          tabBarIcon: () => (
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: DANGER, justifyContent: 'center', alignItems: 'center', marginBottom: Platform.OS === 'ios' ? 14 : 0, shadowColor: DANGER, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 }}>
              <MaterialIcons name="sos" size={26} color="#fff" />
            </View>
          ),
          tabBarLabelStyle: { color: DANGER, fontSize: 10, fontWeight: '700' },
        }} />
      )}

      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: 'Feed', tabBarIcon: ({ color }) => <MaterialIcons name="forum" size={24} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

import AuthScreen from './AuthScreen';

function AppNavigator() {
  const { isLoggedIn, role } = useApp();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
<<<<<<< Updated upstream
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
        <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} initialParams={{ complaintId: null }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="MapView" component={MapViewScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
=======
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : role === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp" component={TabNavigator} />
            <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
            <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} initialParams={{ complaintId: null }} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="MapView" component={MapViewScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}
>>>>>>> Stashed changes
      </Stack.Navigator>
    </>
  );
}

export default function ColonyCareApp() {
  return (
<<<<<<< Updated upstream
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: BG }}>
=======
    <AppProvider>
      <SafeAreaProvider>
>>>>>>> Stashed changes
        <NavigationIndependentTree>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </NavigationIndependentTree>
<<<<<<< Updated upstream
      </View>
    </SafeAreaProvider>
=======
      </SafeAreaProvider>
    </AppProvider>
>>>>>>> Stashed changes
  );
}
