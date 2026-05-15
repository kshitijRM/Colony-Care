import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Alert, Platform, StatusBar, ActivityIndicator,
  KeyboardAvoidingView, FlatList, Dimensions, Image, Switch
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// ─── Theme ───────────────────────────────────────────────────────────────────
export const PRIMARY = '#2563EB';
export const SECONDARY = '#06B6D4';
export const BG = '#0F172A';
export const CARD = '#1E293B';
export const ACCENT = '#8B5CF6';
export const SUCCESS = '#10B981';
export const WARNING = '#F59E0B';
export const DANGER = '#EF4444';
export const TEXT = '#F8FAFC';
export const TEXT2 = '#94A3B8';
export const BORDER = 'rgba(255,255,255,0.08)';
export const GLASS = 'rgba(30,41,59,0.85)';
export const TAB_MENU_HEIGHT = Platform.OS === 'web' ? 60 : 52;
export const SCROLL_EXTRA_PADDING = 20;
export const WEB_TAB_MENU_PADDING = 90;
export const FAB_SPACING = 16;
export const HEADER_HEIGHT = 60;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Navigation ──────────────────────────────────────────────────────────────
export const Tab = createBottomTabNavigator();
export const Stack = createStackNavigator();

// ─── App Context ─────────────────────────────────────────────────────────────
export const AppContext = React.createContext({});
export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('resident');
  const [userName, setUserName] = useState('Kshitij Dinni');
  const [userEmail, setUserEmail] = useState('kshitijdinni6605@gmail.com');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const theme = useMemo(() => ({
    bg: darkMode ? BG : '#F1F5F9',
    card: darkMode ? CARD : '#FFFFFF',
    text: darkMode ? TEXT : '#0F172A',
    text2: darkMode ? TEXT2 : '#64748B',
    border: darkMode ? BORDER : 'rgba(0,0,0,0.08)',
    glass: darkMode ? GLASS : 'rgba(255,255,255,0.85)',
  }), [darkMode]);

  const login = useCallback((selectedRole) => {
    setRole(selectedRole || 'resident');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(() => ({
    role, setRole,
    userName, setUserName, userEmail, setUserEmail,
    isLoggedIn, login, logout,
    darkMode, setDarkMode, theme,
  }), [role, userName, userEmail, isLoggedIn, darkMode, theme, login, logout]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useApp = () => useContext(AppContext);

// ─── Static Data ─────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'water', label: 'Water', icon: 'water', color: SECONDARY },
  { id: 'electricity', label: 'Electricity', icon: 'flash-on', color: WARNING },
  { id: 'roads', label: 'Roads', icon: 'directions-car', color: SUCCESS },
  { id: 'safety', label: 'Safety', icon: 'security', color: DANGER },
  { id: 'sanitation', label: 'Sanitation', icon: 'delete', color: ACCENT },
  { id: 'parks', label: 'Parks', icon: 'park', color: '#22C55E' },
  { id: 'noise', label: 'Noise', icon: 'volume-up', color: '#F97316' },
  { id: 'other', label: 'Other', icon: 'more-horiz', color: TEXT2 },
];
export const WORKERS = [
  { id: 'w1', name: 'Rajan Kumar', dept: 'Water & Sanitation', rating: 4.8, active: true, completed: 47 },
  { id: 'w2', name: 'Priya Sharma', dept: 'Electrical', rating: 4.6, active: true, completed: 38 },
  { id: 'w3', name: 'Suresh Nair', dept: 'Roads & Infra', rating: 4.9, active: false, completed: 62 },
  { id: 'w4', name: 'Meena Pillai', dept: 'Sanitation', rating: 4.5, active: true, completed: 29 },
  { id: 'w5', name: 'Arun Das', dept: 'Security', rating: 4.7, active: true, completed: 55 },
];
export const SEED_COMPLAINTS = [
  { id: 'c1', title: 'Burst water pipe near Block A', category: 'water', status: 'in_progress', priority: 'high', description: 'Water has been leaking since morning causing road damage.', location: 'Block A, Gate 2', worker_id: 'w1', created_at: Date.now() - 86400000 * 2, updated_at: Date.now() - 3600000, upvotes: 12, photo: null, lat: 12.9716, lng: 77.5946, ai_risk: 'High', ai_category: 'Water Infrastructure', resolution_notes: '' },
  { id: 'c2', title: 'Street light not working', category: 'electricity', status: 'pending', priority: 'medium', description: 'Three consecutive street lights on Main Avenue are off.', location: 'Main Avenue, Block C', worker_id: null, created_at: Date.now() - 86400000, updated_at: Date.now() - 86400000, upvotes: 8, photo: null, lat: 12.9726, lng: 77.5956, ai_risk: 'Medium', ai_category: 'Electrical Infrastructure', resolution_notes: '' },
  { id: 'c3', title: 'Deep pothole on Entry Road', category: 'roads', status: 'resolved', priority: 'high', description: 'Large pothole causing vehicle damage.', location: 'Entry Road, Main Gate', worker_id: 'w3', created_at: Date.now() - 86400000 * 5, updated_at: Date.now() - 86400000, upvotes: 24, photo: null, lat: 12.9706, lng: 77.5936, ai_risk: 'High', ai_category: 'Road Infrastructure', resolution_notes: 'Pothole filled and road patched successfully.' },
  { id: 'c4', title: 'Suspicious activity near parking', category: 'safety', status: 'pending', priority: 'critical', description: 'Unknown individuals loitering near parking lot B at night.', location: 'Parking Lot B', worker_id: null, created_at: Date.now() - 7200000, updated_at: Date.now() - 7200000, upvotes: 31, photo: null, lat: 12.9736, lng: 77.5966, ai_risk: 'Critical', ai_category: 'Community Safety', resolution_notes: '' },
  { id: 'c5', title: 'Garbage not collected for 3 days', category: 'sanitation', status: 'in_progress', priority: 'medium', description: 'Regular garbage collection missed multiple times this week.', location: 'Block D, Row 4', worker_id: 'w4', created_at: Date.now() - 86400000 * 3, updated_at: Date.now() - 43200000, upvotes: 18, photo: null, lat: 12.9746, lng: 77.5976, ai_risk: 'Medium', ai_category: 'Waste Management', resolution_notes: '' },
];
export const FEED_SEED = [
  { id: 'f1', user: 'Ananya Krishnan', avatar: 'A', content: 'The burst pipe near Block A is really bad. Multiple families affected. Please prioritize!', type: 'complaint_ref', complaint_id: 'c1', upvotes: 23, comments: 5, time: Date.now() - 3600000 * 2 },
  { id: 'f2', user: 'Vikram Bose', avatar: 'V', content: 'Great job by maintenance team fixing the park lights! Community looking much safer now.', type: 'positive', complaint_id: null, upvotes: 45, comments: 12, time: Date.now() - 3600000 * 5 },
  { id: 'f3', user: 'Deepa Menon', avatar: 'D', content: 'Reminder: Community cleaning drive this Saturday morning 7-10am. Everyone please participate!', type: 'announcement', complaint_id: null, upvotes: 67, comments: 8, time: Date.now() - 3600000 * 8 },
  { id: 'f4', user: 'Rahul Singh', avatar: 'R', content: 'The entry road pothole has been fixed! Thanks to the road team. Now if they could fix Block C footpath too...', type: 'update', complaint_id: 'c3', upvotes: 34, comments: 7, time: Date.now() - 86400000 },
  { id: 'f5', user: 'Sunita Patel', avatar: 'S', content: 'Anyone else notice the water pressure drop around 8-9am? Seems like a systemic issue not just isolated.', type: 'discussion', complaint_id: null, upvotes: 19, comments: 14, time: Date.now() - 86400000 * 2 },
];
export const NOTIFS = [
  { id: 'n1', title: 'Complaint Updated', body: 'Your water pipe complaint is now In Progress. Worker Rajan Kumar assigned.', type: 'update', read: false, time: Date.now() - 1800000 },
  { id: 'n2', title: 'Emergency Alert', body: 'Security alert raised near Parking Lot B. Please stay alert.', type: 'emergency', read: false, time: Date.now() - 3600000 },
  { id: 'n3', title: 'Community Announcement', body: 'Monthly colony meeting scheduled for Sunday 10am at Community Hall.', type: 'announcement', read: true, time: Date.now() - 86400000 },
  { id: 'n4', title: 'Complaint Resolved', body: 'Your pothole complaint has been resolved. Please rate the service.', type: 'resolved', read: true, time: Date.now() - 86400000 * 2 },
  { id: 'n5', title: 'New AI Insight', body: 'AI detected pattern: Water pressure issues spike on Monday mornings. Proactive check scheduled.', type: 'ai', read: true, time: Date.now() - 86400000 * 3 },
];
export const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Water Supply Shutdown', body: 'Scheduled water supply maintenance on Dec 15, 6am-10am. Store water accordingly.', priority: 'high', time: Date.now() - 3600000 },
  { id: 'a2', title: 'Community Meeting', body: 'Monthly RWA meeting on Sunday 10am at Block A community hall. All residents welcome.', priority: 'medium', time: Date.now() - 86400000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatTime = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
};
export const getPriorityColor = (p) => {
  if (p === 'critical') return DANGER;
  if (p === 'high') return WARNING;
  if (p === 'medium') return SECONDARY;
  return SUCCESS;
};
export const getStatusColor = (s) => {
  if (s === 'resolved') return SUCCESS;
  if (s === 'in_progress') return PRIMARY;
  if (s === 'pending') return WARNING;
  return TEXT2;
};
export const getStatusLabel = (s) => {
  if (s === 'resolved') return 'Resolved';
  if (s === 'in_progress') return 'In Progress';
  if (s === 'pending') return 'Pending';
  return 'Unknown';
};
export const getCategoryInfo = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
export const generateId = () => 'c_' + Date.now() + '_' + Math.floor(Math.random() * 9999);

export const getAreaAuthority = (location = '') => {
  const loc = location.toLowerCase();
  if (loc.includes('bellandur') || loc.includes('block a') || loc.includes('gate 2')) {
    return { ward: 'Ward 152 (Bellandur)', mla: 'Hon. Manjula S.', municipality: 'BBMP (East)' };
  }
  if (loc.includes('mahadevapura') || loc.includes('whitefield') || loc.includes('main avenue')) {
    return { ward: 'Ward 150 (Mahadevapura)', mla: 'Hon. Aravind Limbavali', municipality: 'BBMP (East)' };
  }
  if (loc.includes('hsr') || loc.includes('sector')) {
    return { ward: 'Ward 174 (HSR Layout)', mla: 'Hon. Satish Reddy', municipality: 'BBMP (South)' };
  }
  if (loc.includes('koramangala') || loc.includes('block d')) {
    return { ward: 'Ward 151 (Koramangala)', mla: 'Hon. Ramalinga Reddy', municipality: 'BBMP (South)' };
  }
  if (loc.includes('indiranagar')) {
    return { ward: 'Ward 80 (Hoysala Nagar)', mla: 'Hon. S. Raghu', municipality: 'BBMP (East)' };
  }
  if (loc.includes('hebbal')) {
    return { ward: 'Ward 22 (Hebbal)', mla: 'Hon. Suresh B. S.', municipality: 'BBMP (North)' };
  }
  // Default fallback for Bengaluru
  return { ward: 'Ward 152 (Central)', mla: 'Hon. Dr. Satish Kumar', municipality: 'BBMP (Bengaluru)' };
};

// ─── AI Analyzer ──────────────────────────────────────────────────────────────
export const analyzeComplaintAI = (title, description, category) => {
  return new Promise((resolve) => {
    if (!title && !description) {
      resolve({ category: category || 'other', priority: 'medium', risk: 'Medium', suggestion: 'Please provide more details.' });
      return;
    }
    // Fallback local analysis (no real API key needed for demo)
    setTimeout(() => {
      const lower = (title + ' ' + description).toLowerCase();
      let detectedCat = category || 'other';
      let detectedPri = 'medium';
      let detectedRisk = 'Medium';
      let suggestion = 'Complaint logged. Team will review within 24 hours.';
      if (lower.includes('burst') || lower.includes('flood') || lower.includes('leaking')) { detectedCat = 'water'; detectedPri = 'high'; detectedRisk = 'High'; suggestion = 'Immediate water team dispatch recommended.'; }
      else if (lower.includes('fire') || lower.includes('smoke')) { detectedPri = 'critical'; detectedRisk = 'Critical'; suggestion = 'URGENT: Fire safety team required immediately.'; }
      else if (lower.includes('suspicious') || lower.includes('threat') || lower.includes('security')) { detectedCat = 'safety'; detectedPri = 'critical'; detectedRisk = 'Critical'; suggestion = 'Security team alert required.'; }
      else if (lower.includes('pothole') || lower.includes('road') || lower.includes('crack')) { detectedCat = 'roads'; detectedPri = 'high'; detectedRisk = 'High'; suggestion = 'Road maintenance team to inspect ASAP.'; }
      else if (lower.includes('light') || lower.includes('power') || lower.includes('electric')) { detectedCat = 'electricity'; detectedPri = 'medium'; detectedRisk = 'Medium'; suggestion = 'Electrical team scheduled for inspection.'; }
      resolve({ category: detectedCat, priority: detectedPri, risk: detectedRisk, suggestion });
    }, 1200);
  });
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 20, width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
});

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, value, label, accent, trend }) => (
  <View style={{
    flex: 1, backgroundColor: GLASS, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: accent ? accent + '33' : BORDER, marginHorizontal: 4,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: (accent || PRIMARY) + '22', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialIcons name={icon} size={20} color={accent || PRIMARY} />
      </View>
      {trend !== undefined && (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: trend >= 0 ? SUCCESS + '22' : DANGER + '22', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
          <MaterialIcons name={trend >= 0 ? 'trending-up' : 'trending-down'} size={12} color={trend >= 0 ? SUCCESS : DANGER} />
          <Text style={{ color: trend >= 0 ? SUCCESS : DANGER, fontSize: 10, marginLeft: 2 }}>{Math.abs(trend)}%</Text>
        </View>
      )}
    </View>
    <Text style={{ color: accent || PRIMARY, fontSize: 26, fontWeight: 'bold' }}>{String(value)}</Text>
    <Text style={{ color: TEXT2, fontSize: 11, marginTop: 2 }}>{label}</Text>
  </View>
);

// ─── ComplaintCard ────────────────────────────────────────────────────────────
export const ComplaintCard = ({ complaint: c, onPress }) => {
  const catInfo = getCategoryInfo(c.category);
  return (
    <TouchableOpacity onPress={onPress} style={{
      backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 12,
      borderWidth: 1, borderColor: BORDER, borderLeftWidth: 3, borderLeftColor: getPriorityColor(c.priority),
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ color: TEXT, fontSize: 15, fontWeight: '600', marginBottom: 4 }} numberOfLines={1}>{c.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: catInfo.color + '22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
              <MaterialIcons name={catInfo.icon} size={12} color={catInfo.color} />
              <Text style={{ color: catInfo.color, fontSize: 11, marginLeft: 4 }}>{catInfo.label}</Text>
            </View>
            <View style={{ backgroundColor: getPriorityColor(c.priority) + '22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: getPriorityColor(c.priority), fontSize: 11 }}>{c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ backgroundColor: getStatusColor(c.status) + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 }}>
            <Text style={{ color: getStatusColor(c.status), fontSize: 11, fontWeight: '600' }}>{getStatusLabel(c.status)}</Text>
          </View>
          <Text style={{ color: TEXT2, fontSize: 10 }}>{formatTime(c.created_at)}</Text>
        </View>
      </View>
      <Text style={{ color: TEXT2, fontSize: 13 }} numberOfLines={2}>{c.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="location-on" size={13} color={TEXT2} />
          <Text style={{ color: TEXT2, fontSize: 12, marginLeft: 3 }}>{c.location}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="thumb-up" size={13} color={TEXT2} />
          <Text style={{ color: TEXT2, fontSize: 12, marginLeft: 3 }}>{String(c.upvotes)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── MiniBarChart ─────────────────────────────────────────────────────────────
export const MiniBarChart = ({ data = [], height = 60 }) => {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, marginTop: 8 }}>
      {data.map((d, i) => {
        const h = Math.max(4, (d.value / max) * height);
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', marginHorizontal: 2 }}>
            <View style={{ width: '70%', height: h, borderRadius: 4, backgroundColor: d.color || PRIMARY + 'AA' }} />
            <Text style={{ color: TEXT2, fontSize: 9, marginTop: 3 }} numberOfLines={1}>{d.label || ''}</Text>
          </View>
        );
      })}
    </View>
  );
};
