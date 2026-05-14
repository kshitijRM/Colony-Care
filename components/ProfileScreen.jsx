import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, ACCENT, CARD, SUCCESS, WARNING, DANGER, SECONDARY, TEXT, TEXT2, BORDER, TAB_MENU_HEIGHT, SCROLL_EXTRA_PADDING, WEB_TAB_MENU_PADDING, useApp } from './core';


const BADGES = [
  { icon: 'emoji-events', label: 'Active Reporter', color: WARNING },
  { icon: 'verified', label: 'Verified Member', color: PRIMARY },
  { icon: 'local-fire-department', label: 'Fire Reporter', color: DANGER },
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const appCtx = useApp();
  const { theme, role } = appCtx;
  const scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING;

  const MENU_ITEMS = [
    { icon: 'notifications', label: 'Notifications', action: () => navigation.navigate('Notifications') },
<<<<<<< Updated upstream
    { icon: 'analytics', label: 'Analytics', action: () => navigation.navigate('Analytics'), adminOnly: true },
    { icon: 'admin-panel-settings', label: 'Admin Dashboard', action: () => navigation.navigate('AdminDashboard'), adminOnly: true },
    { icon: 'share', label: 'Share ColonyCare', action: () => {} },
    { icon: 'info', label: 'About', action: () => {} },
    { icon: 'logout', label: 'Logout', action: () => {
      const doLogout = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      };
      if (Platform.OS === 'web') {
        if (confirm('Are you sure you want to logout?')) doLogout();
      } else {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: doLogout }
        ]);
      }
    }, danger: true },
  ].filter(item => !item.adminOnly || role === 'admin');
=======
    { icon: 'analytics', label: 'Analytics', action: () => navigation.navigate('Analytics') },
    { icon: 'map', label: 'Map View', action: () => navigation.navigate('MapView') },
    { icon: 'dark-mode', label: 'Dark Mode', isSwitch: true, value: darkMode, onChange: setDarkMode },
    { icon: 'share', label: 'Share ColonyCare', action: () => {} },
    { icon: 'info', label: 'About', action: () => {} },
    { icon: 'logout', label: 'Logout', action: () => appCtx.logout(), danger: true },
  ];
>>>>>>> Stashed changes

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: scrollBottom }} showsVerticalScrollIndicator={true}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 20, paddingBottom: 24, paddingHorizontal: 20, alignItems: 'center', backgroundColor: PRIMARY }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
          <MaterialIcons name="person" size={44} color="#fff" />
        </View>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{appCtx.userName}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 14 }}>{appCtx.userEmail}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="verified" size={16} color={WARNING} />
          <Text style={{ color: '#fff', fontSize: 13, marginLeft: 5 }}>{role.charAt(0).toUpperCase() + role.slice(1)} · Block A, Unit 204</Text>
        </View>
      </View>
      {/* Stats row */}
      <View style={{ flexDirection: 'row', backgroundColor: CARD, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: BORDER }}>
        {[{ value: '12', label: 'Complaints' }, { value: '9', label: 'Resolved' }, { value: '87', label: 'Health Score' }, { value: '3', label: 'Badges' }].map((s, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 3 ? 1 : 0, borderRightColor: BORDER }}>
            <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>{s.value}</Text>
            <Text style={{ color: TEXT2, fontSize: 11, marginTop: 2 }}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={{ padding: 20 }}>
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {/* Badges */}
        {role !== 'admin' && (
          <>
            <Text style={{ color: TEXT2, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Badges</Text>
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              {BADGES.map((badge, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: CARD, borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: badge.color + '44' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: badge.color + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                    <MaterialIcons name={badge.icon} size={22} color={badge.color} />
                  </View>
                  <Text style={{ color: TEXT2, fontSize: 10, textAlign: 'center' }}>{badge.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        {/* Settings */}
        <Text style={{ color: TEXT2, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Settings</Text>
        <View style={{ backgroundColor: CARD, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} onPress={item.action || (() => {})} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0, borderBottomColor: BORDER }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: (item.danger ? DANGER : PRIMARY) + '22', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                <MaterialIcons name={item.icon} size={18} color={item.danger ? DANGER : PRIMARY} />
              </View>
              <Text style={{ color: item.danger ? DANGER : TEXT, fontSize: 14, flex: 1 }}>{item.label}</Text>
              {item.isSwitch
                ? <Switch value={item.value} onValueChange={item.onChange} trackColor={{ false: BORDER, true: PRIMARY + '88' }} thumbColor={item.value ? PRIMARY : TEXT2} />
                : <MaterialIcons name="chevron-right" size={20} color={TEXT2} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
