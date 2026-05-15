import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '../platform-hooks';
import { PRIMARY, ACCENT, BG, CARD, SECONDARY, SUCCESS, WARNING, DANGER, TEXT, TEXT2, BORDER, WORKERS, getPriorityColor } from './core';

export default function WorkersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const workersQ = useQuery('workers');
  const { mutate: addWorker } = useMutation('workers', 'insert');

  const allWorkers = useMemo(() => {
    const dbData = workersQ.data || [];
    const seedIds = new Set(dbData.map(w => w.id));
    return [...dbData, ...WORKERS.filter(w => !seedIds.has(w.id))];
  }, [workersQ.data]);

  const [newWorker, setNewWorker] = React.useState({ name: '', dept: '', email: '', phone: '', location: '' });

  const handleAddWorker = () => {
    if (!newWorker.name || !newWorker.dept || !newWorker.email || !newWorker.phone || !newWorker.location) {
      Platform.OS === 'web' ? alert('Please fill all fields') : Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const workerObj = {
      id: 'w' + Date.now(),
      name: newWorker.name,
      dept: newWorker.dept,
      email: newWorker.email,
      phone: newWorker.phone,
      location: newWorker.location,
      rating: 5.0,
      active: true,
      completed: 0
    };
    addWorker(workerObj).then(() => {
      Platform.OS === 'web' ? alert(`Worker ${newWorker.name} registered successfully!`) : Alert.alert('Success', `Worker ${newWorker.name} added.`);
      setNewWorker({ name: '', dept: '', email: '', phone: '', location: '' });
    }).catch(e => {
      Platform.OS === 'web' ? alert(e.message) : Alert.alert('Error', e.message);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: TEXT, fontSize: 20, fontWeight: 'bold' }}>Colony Staff</Text>
          <Text style={{ color: TEXT2, fontSize: 12 }}>Manage workers and assignments</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: PRIMARY + '22', borderRadius: 10, padding: 8 }}>
          <MaterialIcons name="filter-list" size={22} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Add Worker Section */}
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: BORDER }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: SUCCESS + '22', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
              <MaterialIcons name="person-add" size={20} color={SUCCESS} />
            </View>
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: '700' }}>Register New Staff</Text>
          </View>
          
          <TextInput 
            placeholder="Full Name" 
            placeholderTextColor={TEXT2 + '88'} 
            value={newWorker.name}
            onChangeText={(t) => setNewWorker({...newWorker, name: t})}
            style={{ backgroundColor: BG, borderRadius: 10, padding: 12, color: TEXT, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER }} 
          />
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TextInput 
              placeholder="Department" 
              placeholderTextColor={TEXT2 + '88'} 
              value={newWorker.dept}
              onChangeText={(t) => setNewWorker({...newWorker, dept: t})}
              style={{ flex: 1, backgroundColor: BG, borderRadius: 10, padding: 12, color: TEXT, fontSize: 14, marginRight: 8, borderWidth: 1, borderColor: BORDER }} 
            />
            <TextInput 
              placeholder="Assigned Block" 
              placeholderTextColor={TEXT2 + '88'} 
              value={newWorker.location}
              onChangeText={(t) => setNewWorker({...newWorker, location: t})}
              style={{ flex: 1, backgroundColor: BG, borderRadius: 10, padding: 12, color: TEXT, fontSize: 14, borderWidth: 1, borderColor: BORDER }} 
            />
          </View>
          <TextInput 
            placeholder="Email Address" 
            placeholderTextColor={TEXT2 + '88'} 
            value={newWorker.email}
            onChangeText={(t) => setNewWorker({...newWorker, email: t})}
            keyboardType="email-address"
            style={{ backgroundColor: BG, borderRadius: 10, padding: 12, color: TEXT, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER }} 
          />
          <TextInput 
            placeholder="Phone Number" 
            placeholderTextColor={TEXT2 + '88'} 
            value={newWorker.phone}
            onChangeText={(t) => setNewWorker({...newWorker, phone: t})}
            keyboardType="phone-pad"
            style={{ backgroundColor: BG, borderRadius: 10, padding: 12, color: TEXT, fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: BORDER }} 
          />
          
          <TouchableOpacity onPress={handleAddWorker} style={{ backgroundColor: SUCCESS, borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: SUCCESS, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Register Worker</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold', marginBottom: 14 }}>Active Staff List</Text>
        {allWorkers.map((w, i) => (
          <View key={w.id} style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: (w.active ? SUCCESS : TEXT2) + '22', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <MaterialIcons name="engineering" size={26} color={w.active ? SUCCESS : TEXT2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: TEXT, fontSize: 15, fontWeight: 'bold' }}>{w.name}</Text>
              <Text style={{ color: TEXT2, fontSize: 13 }}>{w.dept} · {w.location}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <MaterialIcons name="star" size={14} color={WARNING} />
                <Text style={{ color: WARNING, fontSize: 12, marginLeft: 2, fontWeight: '600' }}>{w.rating || '5.0'}</Text>
                <Text style={{ color: TEXT2, fontSize: 12, marginLeft: 8 }}>{w.completed || 0} resolved</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ backgroundColor: (w.active ? SUCCESS : TEXT2) + '15', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: (w.active ? SUCCESS : TEXT2) + '33' }}>
                <Text style={{ color: w.active ? SUCCESS : TEXT2, fontSize: 11, fontWeight: '700' }}>{w.active ? 'AVAILABLE' : 'BUSY'}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
