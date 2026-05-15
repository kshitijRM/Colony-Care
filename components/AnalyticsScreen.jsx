import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '../platform-hooks';
import { PRIMARY, ACCENT, BG, CARD, SECONDARY, SUCCESS, WARNING, DANGER, TEXT, TEXT2, BORDER, SEED_COMPLAINTS, CATEGORIES, StatCard, MiniBarChart } from './core';

export default function AnalyticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const complaintsQ = useQuery('complaints');
  const allComplaints = useMemo(() => (complaintsQ.data?.length > 0 ? complaintsQ.data : SEED_COMPLAINTS), [complaintsQ.data]);
  const total = allComplaints.length;
  const resolved = allComplaints.filter(c => c.status === 'resolved').length;
  const pending = allComplaints.filter(c => c.status === 'pending').length;
  const inProg = allComplaints.filter(c => c.status === 'in_progress').length;
  const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const catData = CATEGORIES.map(cat => ({ label: cat.label, value: allComplaints.filter(c => c.category === cat.id).length, color: cat.color }));
  const weeklyData = [
    { label: 'Mon', value: 5, color: PRIMARY }, { label: 'Tue', value: 8, color: PRIMARY },
    { label: 'Wed', value: 3, color: PRIMARY }, { label: 'Thu', value: 12, color: WARNING },
    { label: 'Fri', value: 7, color: PRIMARY }, { label: 'Sat', value: 4, color: SUCCESS },
    { label: 'Sun', value: 6, color: PRIMARY },
  ];
  const monthlyRes = [
    { label: 'Sep', value: 78, color: SECONDARY }, { label: 'Oct', value: 82, color: SECONDARY },
    { label: 'Nov', value: 85, color: SUCCESS }, { label: 'Dec', value: resRate, color: SUCCESS },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
          <MaterialIcons name="arrow-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Analytics</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={true}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <StatCard icon="assessment" value={total} label="Total Complaints" accent={PRIMARY} />
          <StatCard icon="trending-up" value={resRate + '%'} label="Resolution Rate" accent={SUCCESS} trend={5} />
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER }}>
          <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700', marginBottom: 2 }}>Weekly Complaints</Text>
          <Text style={{ color: TEXT2, fontSize: 12, marginBottom: 8 }}>Last 7 days · Total: 45</Text>
          <MiniBarChart data={weeklyData} height={90} />
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER }}>
          <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700', marginBottom: 2 }}>By Category</Text>
          <Text style={{ color: TEXT2, fontSize: 12, marginBottom: 8 }}>Distribution of complaint types</Text>
          <MiniBarChart data={catData} height={90} />
          {catData.map((d, i) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: d.color, marginRight: 8 }} />
                <Text style={{ color: TEXT, fontSize: 13, flex: 1 }}>{d.label}</Text>
                <View style={{ flex: 3, height: 6, backgroundColor: BG, borderRadius: 3, marginHorizontal: 8 }}>
                  <View style={{ height: 6, backgroundColor: d.color, borderRadius: 3, width: pct + '%' }} />
                </View>
                <Text style={{ color: TEXT2, fontSize: 12, minWidth: 30, textAlign: 'right' }}>{String(d.value)}</Text>
              </View>
            );
          })}
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER }}>
          <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700', marginBottom: 16 }}>Status Overview</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[{ label: 'Pending', value: pending, color: WARNING, pct: total > 0 ? Math.round((pending / total) * 100) : 0 }, { label: 'In Progress', value: inProg, color: SECONDARY, pct: total > 0 ? Math.round((inProg / total) * 100) : 0 }, { label: 'Resolved', value: resolved, color: SUCCESS, pct: total > 0 ? Math.round((resolved / total) * 100) : 0 }].map((item, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: item.color + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: item.color, marginBottom: 8 }}>
                  <Text style={{ color: item.color, fontSize: 16, fontWeight: 'bold' }}>{item.pct}%</Text>
                </View>
                <Text style={{ color: TEXT, fontSize: 14, fontWeight: '600' }}>{String(item.value)}</Text>
                <Text style={{ color: TEXT2, fontSize: 11 }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER }}>
          <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700', marginBottom: 2 }}>Monthly Resolution Rate</Text>
          <Text style={{ color: TEXT2, fontSize: 12, marginBottom: 8 }}>Trending upward ↑</Text>
          <MiniBarChart data={monthlyRes} height={80} />
        </View>
        <View style={{ backgroundColor: ACCENT + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: ACCENT + '33' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialIcons name="psychology" size={22} color={ACCENT} />
            <Text style={{ color: ACCENT, fontSize: 15, fontWeight: '700', marginLeft: 8 }}>AI Predictive Insights</Text>
          </View>
          {['📈 Water issues expected to rise 23% next week based on seasonal patterns.', '⚡ 3 street lights in Block C predicted to fail within 7 days.', '🛣️ Main road requires preventive maintenance before monsoon season.'].map((insight, i) => (
            <View key={i} style={{ backgroundColor: CARD, borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: TEXT, fontSize: 13 }}>{insight}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
