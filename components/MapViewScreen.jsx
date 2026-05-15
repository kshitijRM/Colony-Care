import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMaps } from '../platform-hooks';
import { PRIMARY, SECONDARY, BG, CARD, SUCCESS, WARNING, DANGER, TEXT, TEXT2, BORDER, SEED_COMPLAINTS, getPriorityColor, getStatusLabel } from './core';

export default function MapViewScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [mapFilter, setMapFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const complaintsQ = useQuery('complaints');
  const allComplaints = useMemo(() => (complaintsQ.data?.length > 0 ? complaintsQ.data : SEED_COMPLAINTS), [complaintsQ.data]);
  const { MapView, Marker, mapRef, region, setRegion, isAvailable } = useMaps({ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.03, longitudeDelta: 0.03 });
  const filteredMarkers = useMemo(() => {
    const withCoords = allComplaints.filter(c => c.lat && c.lng);
    return mapFilter === 'all' ? withCoords : withCoords.filter(c => c.status === mapFilter);
  }, [allComplaints, mapFilter]);
  const mapH = Dimensions.get('window').height - insets.top - 160;
  const FILTERS = [{ key: 'all', label: 'All', color: PRIMARY }, { key: 'pending', label: 'Pending', color: WARNING }, { key: 'in_progress', label: 'Active', color: SECONDARY }, { key: 'resolved', label: 'Resolved', color: SUCCESS }];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
            <MaterialIcons name="arrow-back" size={24} color={TEXT} />
          </TouchableOpacity>
          <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Community Map</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              setRegion({ latitude: 20.5937, longitude: 78.9629, latitudeDelta: 25, longitudeDelta: 25, searchQuery: '' });
            }}
            style={{ backgroundColor: CARD, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: BORDER }}
          >
            <Text style={{ color: TEXT2, fontSize: 11, fontWeight: 'bold' }}>India</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              setRegion({ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.005, longitudeDelta: 0.005, searchQuery: '' });
            }}
            style={{ backgroundColor: PRIMARY, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: PRIMARY }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>Bangalore</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: BG }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: BORDER }}>
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search city or location..."
            placeholderTextColor={TEXT2 + '88'}
            style={{ flex: 1, color: TEXT, fontSize: 14, paddingVertical: 10, paddingHorizontal: 10 }}
            onSubmitEditing={() => {
              if (searchQuery) {
                setRegion({ ...region, searchQuery }); 
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 10 }}>
              <MaterialIcons name="close" size={20} color={TEXT2} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => {
              if (searchQuery) {
                setRegion({ ...region, searchQuery }); 
              }
            }}
            style={{ backgroundColor: PRIMARY, padding: 8, borderRadius: 8, marginVertical: 6 }}
          >
            <MaterialIcons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView horizontal style={{ flexGrow: 0, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }} showsHorizontalScrollIndicator={false}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f.key} onPress={() => setMapFilter(f.key)} style={{ backgroundColor: mapFilter === f.key ? f.color : CARD, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1, borderColor: mapFilter === f.key ? f.color : BORDER }}>
            <Text style={{ color: mapFilter === f.key ? '#fff' : TEXT2, fontSize: 12 }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isAvailable ? (
        <View style={{ height: mapH * 0.7, marginVertical: 16, marginHorizontal: 24, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER }}>
          <MapView ref={mapRef} provider="google" mapType="satellite" style={{ flex: 1 }} region={region} onRegionChangeComplete={setRegion} showsUserLocation>
            {filteredMarkers.map(c => (
              <Marker key={c.id} coordinate={{ latitude: c.lat, longitude: c.lng }} title={c.title} description={getStatusLabel(c.status) + ' · ' + c.priority.toUpperCase()} pinColor={getPriorityColor(c.priority)} />
            ))}
          </MapView>
        </View>
      ) : (
        <View style={{ margin: 16, height: mapH * 0.7, backgroundColor: CARD, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER }}>
          <MaterialCommunityIcons name="map-marker-multiple" size={60} color={TEXT2} />
          <Text style={{ color: TEXT2, fontSize: 16, marginTop: 12 }}>Map Preview</Text>
          <Text style={{ color: TEXT2, fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 30 }}>{filteredMarkers.length} complaint markers would appear here on device</Text>
        </View>
      )}

      {/* Raise Issue & List Section */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RaiseComplaint', { lat: region.latitude, lng: region.longitude })}
          style={{ backgroundColor: DANGER, borderRadius: 12, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: DANGER, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}
        >
          <MaterialIcons name="add-location-alt" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Raise Issue on this Location</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: TEXT, fontSize: 16, fontWeight: 'bold' }}>Recent Issues in this Area</Text>
          <Text style={{ color: TEXT2, fontSize: 12 }}>{filteredMarkers.length} Found</Text>
        </View>

        {filteredMarkers.slice(0, 3).map(c => (
          <TouchableOpacity 
            key={c.id} 
            onPress={() => navigation.navigate('ComplaintDetail', { complaintId: c.id })}
            style={{ backgroundColor: CARD, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: getPriorityColor(c.priority) + '22', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <MaterialCommunityIcons name="alert-decagram" size={20} color={getPriorityColor(c.priority)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: TEXT, fontSize: 14, fontWeight: 'bold' }} numberOfLines={1}>{c.title}</Text>
              <Text style={{ color: TEXT2, fontSize: 12 }} numberOfLines={1}>{c.location}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={TEXT2} />
          </TouchableOpacity>
        ))}
        
        {filteredMarkers.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate('Complaints')} style={{ alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: PRIMARY, fontSize: 13, fontWeight: 'bold' }}>View All Issues</Text>
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
    </View>
  );
}
