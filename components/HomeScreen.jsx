import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, TextInput, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '../platform-hooks';
import {
  PRIMARY, SECONDARY, BG, CARD, ACCENT, SUCCESS, WARNING, DANGER, TEXT, TEXT2, BORDER,
  TAB_MENU_HEIGHT, SCROLL_EXTRA_PADDING, WEB_TAB_MENU_PADDING,
  useApp, SEED_COMPLAINTS, ANNOUNCEMENTS, StatCard, ComplaintCard, MiniBarChart,
  formatTime, getPriorityColor,
} from './core';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const appCtx = useApp();
  const { theme = { bg: '#0F172A', card: '#1E293B' }, role = 'resident', userName = 'User' } = appCtx;
  const [workerName, setWorkerName] = useState('');
  const [workerDept, setWorkerDept] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerLocation, setWorkerLocation] = useState('');
  const complaintsQ = useQuery('complaints');
  const { mutate: addWorker } = useMutation('workers', 'insert');
  const complaints = useMemo(() => {
    const dbData = complaintsQ.data || [];
    const seedIds = new Set(dbData.map(c => c.id));
    return [...dbData, ...SEED_COMPLAINTS.filter(c => !seedIds.has(c.id))];
  }, [complaintsQ.data]);
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProg = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const critical = complaints.filter(c => c.priority === 'critical').length;
    return { total, pending, inProg, resolved, critical };
  }, [complaints]);

  const scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING;
  const chartData = [
    { label: 'Mon', value: 5, color: PRIMARY }, { label: 'Tue', value: 8, color: PRIMARY },
    { label: 'Wed', value: 3, color: PRIMARY }, { label: 'Thu', value: 12, color: WARNING },
    { label: 'Fri', value: 7, color: PRIMARY }, { label: 'Sat', value: 4, color: PRIMARY },
    { label: 'Sun', value: 6, color: PRIMARY },
  ];
  const catData = [
    { label: 'Water', value: complaints.filter(c => c.category === 'water').length, color: SECONDARY },
    { label: 'Elec', value: complaints.filter(c => c.category === 'electricity').length, color: WARNING },
    { label: 'Roads', value: complaints.filter(c => c.category === 'roads').length, color: SUCCESS },
    { label: 'Safety', value: complaints.filter(c => c.category === 'safety').length, color: DANGER },
    { label: 'Other', value: complaints.filter(c => !['water','electricity','roads','safety'].includes(c.category)).length, color: ACCENT },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: theme.bg, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: TEXT2, fontSize: 12 }}>Good Morning,</Text>
          <Text style={{ color: TEXT, fontSize: 20, fontWeight: 'bold' }}>ColonyCare 🏙️</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ marginRight: 12, position: 'relative' }}>
            <MaterialIcons name="notifications" size={26} color={TEXT} />
            <View style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: DANGER }} />
          </TouchableOpacity>
          {appCtx.role === 'admin' && (
            <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')} style={{ backgroundColor: PRIMARY + '22', borderRadius: 10, padding: 6 }}>
              <MaterialIcons name="admin-panel-settings" size={22} color={PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: scrollBottom, paddingHorizontal: 16 }} showsVerticalScrollIndicator={true}>
        {/* Profile Panel */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
          style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: PRIMARY + '22', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: PRIMARY + '44' }}>
            <MaterialIcons name="person" size={28} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: 'bold' }}>{appCtx.userName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <MaterialIcons name="verified" size={14} color={WARNING} />
              <Text style={{ color: TEXT2, fontSize: 12, marginLeft: 4 }}>{appCtx.role.charAt(0).toUpperCase() + appCtx.role.slice(1)} · Block A, Unit 204</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={TEXT2} />
        </TouchableOpacity>

        {/* Admin Management Section */}
        {appCtx.role === 'admin' && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('WorkersTab')}
            style={{ backgroundColor: CARD, borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: PRIMARY + '44', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: SUCCESS + '22', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                <MaterialIcons name="person-add" size={26} color={SUCCESS} />
              </View>
              <View>
                <Text style={{ color: TEXT, fontSize: 17, fontWeight: 'bold' }}>Staff Management</Text>
                <Text style={{ color: TEXT2, fontSize: 13 }}>Register or view all colony workers</Text>
              </View>
            </View>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: BORDER, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="arrow-forward" size={20} color={TEXT2} />
            </View>
          </TouchableOpacity>
        )}

        {/* Hero */}
        <View style={{ borderRadius: 20, padding: 20, marginBottom: 20, backgroundColor: PRIMARY, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>Colony Health Score</Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 12 }}>AI-powered community insights</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 42, fontWeight: 'bold' }}>87</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginLeft: 4 }}>/100</Text>
              </View>
              <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 8, width: '90%' }}>
                <View style={{ height: 6, backgroundColor: '#fff', borderRadius: 3, width: '87%' }} />
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="city" size={64} color="rgba(255,255,255,0.3)" />
              <View style={{ backgroundColor: SUCCESS + 'AA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>↑ +5 this week</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Raise CTA */}
        {appCtx.role !== 'admin' && (
          <TouchableOpacity onPress={() => navigation.navigate('RaiseComplaint')} style={{ backgroundColor: ACCENT, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <MaterialIcons name="add-circle" size={26} color="#fff" />
              </View>
              <View>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Raise a Complaint</Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>AI-powered categorization</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}
        {/* Weekly trend header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 8 }}>
          <Text style={{ color: TEXT, fontSize: 17, fontWeight: 'bold' }}>Weekly Trend</Text>
          {appCtx.role === 'admin' && (
            <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
              <Text style={{ color: PRIMARY, fontSize: 13 }}>View Analytics</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Chart */}
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: BORDER }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ color: TEXT2, fontSize: 12 }}>Complaints this week</Text>
            <Text style={{ color: PRIMARY, fontSize: 18, fontWeight: 'bold' }}>45</Text>
          </View>
          <MiniBarChart data={chartData} height={70} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            {catData.map((d, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: d.color + '22', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ color: d.color, fontSize: 12, fontWeight: 'bold' }}>{String(d.value)}</Text>
                </View>
                <Text style={{ color: TEXT2, fontSize: 10 }}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Recent complaints */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: TEXT, fontSize: 17, fontWeight: 'bold' }}>Recent Complaints</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyComplaints')}>
            <Text style={{ color: PRIMARY, fontSize: 13 }}>View All</Text>
          </TouchableOpacity>
        </View>
        {complaints.slice(0, 3).map(c => (
          <ComplaintCard key={c.id} complaint={c} onPress={() => navigation.navigate('ComplaintDetail', { complaintId: c.id })} />
        ))}
        {/* AI Insight */}
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: BORDER }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: ACCENT + '22', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
              <MaterialIcons name="psychology" size={18} color={ACCENT} />
            </View>
            <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700' }}>AI Insight</Text>
          </View>
          <Text style={{ color: TEXT2, fontSize: 13, lineHeight: 20 }}>⚡ Water pressure complaints spike on Monday mornings (8-10am). Proactive maintenance scheduled. Expected issue reduction: 35%.</Text>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity style={{ backgroundColor: ACCENT, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Schedule Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: BORDER }}>
              <Text style={{ color: TEXT2, fontSize: 12 }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
