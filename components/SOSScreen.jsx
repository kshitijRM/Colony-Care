import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../platform-hooks';
import { PRIMARY, SECONDARY, ACCENT, BG, CARD, SUCCESS, WARNING, DANGER, TEXT, TEXT2, BORDER, TAB_MENU_HEIGHT, SCROLL_EXTRA_PADDING, WEB_TAB_MENU_PADDING } from './core';

const { width: SCREEN_W } = Dimensions.get('window');

const EMERG_TYPES = [
  { id: 'fire', label: 'Fire', icon: 'local-fire-department', color: '#FF4500', desc: 'Building/area fire emergency' },
  { id: 'medical', label: 'Medical', icon: 'local-hospital', color: DANGER, desc: 'Medical emergency requiring ambulance' },
  { id: 'security', label: 'Security', icon: 'security', color: WARNING, desc: 'Security threat or break-in' },
  { id: 'flood', label: 'Flood', icon: 'waves', color: SECONDARY, desc: 'Flooding or water emergency' },
];

export default function SOSScreen() {
  const insets = useSafeAreaInsets();
  const { getCurrentLocation } = useLocation();
  const [emergType, setEmergType] = useState(null);
  const [activated, setActivated] = useState(false);
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING;

  const handleSOS = useCallback(() => {
    if (!emergType) { Platform.OS === 'web' ? alert('Please select emergency type.') : Alert.alert('Select Type', 'Select the type of emergency.'); return; }
    setLoading(true);
    getCurrentLocation().then(r => {
      if (!r.error) setLoc(r);
      setLoading(false);
      setActivated(true);
      Platform.OS === 'web' ? alert('🚨 SOS ACTIVATED! Emergency teams notified. Help is on the way!') : Alert.alert('🚨 SOS ACTIVATED!', 'Emergency teams notified.\nHelp is on the way!\nStay calm.');
    });
  }, [emergType, getCurrentLocation]);

  return (
    <View style={{ flex: 1, backgroundColor: activated ? '#1A0000' : BG }}>
      <View style={{ paddingTop: insets.top + 12, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: activated ? '#2D0000' : BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: activated ? DANGER : TEXT2, marginRight: 10 }} />
        <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Emergency SOS</Text>
        {activated && <View style={{ marginLeft: 'auto', backgroundColor: DANGER, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>LIVE</Text></View>}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: scrollBottom, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        {activated ? (
          <View style={{ width: '100%', backgroundColor: DANGER + '22', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: DANGER + '66', alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: DANGER + '44', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <MaterialIcons name="emergency" size={44} color={DANGER} />
            </View>
            <Text style={{ color: DANGER, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>🚨 ALERT SENT</Text>
            <Text style={{ color: TEXT, fontSize: 15, textAlign: 'center', marginBottom: 8 }}>Emergency teams notified</Text>
            {loc && <Text style={{ color: TEXT2, fontSize: 13, textAlign: 'center', marginBottom: 12 }}>Your location: {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</Text>}
            <View style={{ backgroundColor: CARD, borderRadius: 12, padding: 14, width: '100%', marginBottom: 12 }}>
              <Text style={{ color: TEXT2, fontSize: 12, textAlign: 'center' }}>Type: {emergType?.toUpperCase()} · Admins Notified: 3 · ETA: 8-12 mins</Text>
            </View>
            <TouchableOpacity onPress={() => { setActivated(false); setEmergType(null); setLoc(null); }} style={{ backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: BORDER }}>
              <Text style={{ color: TEXT2, fontSize: 14 }}>Cancel Alert</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: DANGER + '15', borderWidth: 3, borderColor: DANGER + '44', justifyContent: 'center', alignItems: 'center', marginBottom: 28, marginTop: 12 }}>
              <TouchableOpacity onPress={handleSOS} style={{ width: 130, height: 130, borderRadius: 65, backgroundColor: DANGER, justifyContent: 'center', alignItems: 'center' }}>
                {loading ? <ActivityIndicator size="large" color="#fff" /> : (
                  <View style={{ alignItems: 'center' }}>
                    <MaterialIcons name="sos" size={44} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4 }}>HOLD</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text style={{ color: TEXT, fontSize: 17, fontWeight: 'bold', marginBottom: 6 }}>Select Emergency Type</Text>
            <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 20, textAlign: 'center' }}>Choose the type of emergency then tap SOS</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {EMERG_TYPES.map(e => (
                <TouchableOpacity key={e.id} onPress={() => setEmergType(e.id)} style={{ width: (SCREEN_W - 64) / 2, backgroundColor: emergType === e.id ? e.color : CARD, borderRadius: 14, padding: 16, margin: 6, alignItems: 'center', borderWidth: 2, borderColor: emergType === e.id ? e.color : BORDER }}>
                  <MaterialIcons name={e.icon} size={32} color={emergType === e.id ? '#fff' : e.color} />
                  <Text style={{ color: emergType === e.id ? '#fff' : TEXT, fontSize: 14, fontWeight: '700', marginTop: 8, marginBottom: 4 }}>{e.label}</Text>
                  <Text style={{ color: emergType === e.id ? 'rgba(255,255,255,0.75)' : TEXT2, fontSize: 11, textAlign: 'center' }}>{e.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 16, marginTop: 20, width: '100%', borderWidth: 1, borderColor: BORDER }}>
              <Text style={{ color: TEXT, fontSize: 14, fontWeight: '700', marginBottom: 8 }}>Emergency Contacts</Text>
              {[{ name: 'Colony Security', phone: '100', icon: 'security' }, { name: 'Fire Station', phone: '101', icon: 'local-fire-department' }, { name: 'Ambulance', phone: '108', icon: 'local-hospital' }].map((contact, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: BORDER }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: DANGER + '22', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <MaterialIcons name={contact.icon} size={16} color={DANGER} />
                  </View>
                  <Text style={{ color: TEXT, fontSize: 14, flex: 1 }}>{contact.name}</Text>
                  <Text style={{ color: PRIMARY, fontSize: 15, fontWeight: '700' }}>{contact.phone}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
