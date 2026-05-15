import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image, Alert, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera, useLocation, useFilePicker, useMutation } from '../platform-hooks';
import {
  PRIMARY, ACCENT, BG, CARD, SECONDARY, TEXT, TEXT2, BORDER,
  CATEGORIES, HEADER_HEIGHT, analyzeComplaintAI, generateId, getPriorityColor,
} from './core';

export default function RaiseComplaintScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const { takePhoto, photo: cameraPhoto } = useCamera();
  const { getCurrentLocation } = useLocation();
  const { pickDocument, lastFile, isLoading: fpLoading } = useFilePicker();
  const { mutate } = useMutation('complaints', 'insert');

  React.useEffect(() => {
    if (route.params?.lat && route.params?.lng) {
      setLat(route.params.lat);
      setLng(route.params.lng);
      setLocation(route.params.lat.toFixed(6) + ', ' + route.params.lng.toFixed(6));
    }
    if (route.params?.quickCategory) {
      setCategory(route.params.quickCategory);
    }
  }, [route.params]);

  React.useEffect(() => { if (cameraPhoto) setPhoto(cameraPhoto.uri); }, [cameraPhoto]);

  const handleGetLocation = useCallback(() => {
    getCurrentLocation().then(r => {
      if (r.error) { Platform.OS === 'web' ? alert(r.error) : Alert.alert('Location Error', r.error); return; }
      setLat(r.latitude); setLng(r.longitude);
      setLocation(r.latitude.toFixed(4) + ', ' + r.longitude.toFixed(4));
    });
  }, [getCurrentLocation]);

  const handleAnalyze = useCallback(() => {
    if (!title && !description) { Platform.OS === 'web' ? alert('Enter title and description first.') : Alert.alert('Missing Info', 'Enter title and description first.'); return; }
    setAnalyzing(true);
    analyzeComplaintAI(title, description, category).then(r => { setAiResult(r); setCategory(r.category); setPriority(r.priority); setAnalyzing(false); });
  }, [title, description, category]);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !description.trim() || !category) { Platform.OS === 'web' ? alert('Fill all required fields.') : Alert.alert('Missing Info', 'Fill all required fields.'); return; }
    setSubmitting(true);
    const nc = { id: generateId(), title: title.trim(), description: description.trim(), category, status: 'pending', priority, location: location || 'Not specified', worker_id: null, created_at: Date.now(), updated_at: Date.now(), upvotes: 0, photo: photo || (lastFile ? lastFile.uri : null), lat, lng, ai_risk: aiResult ? aiResult.risk : 'Medium', ai_category: aiResult ? aiResult.suggestion : '', resolution_notes: '' };
    mutate(nc).then(() => {
      setSubmitting(false);
      Platform.OS === 'web' ? alert('Complaint submitted! ID: ' + nc.id) : Alert.alert('Success! 🎉', 'Submitted.\nID: ' + nc.id, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      if (Platform.OS === 'web') navigation.goBack();
    }).catch(e => { setSubmitting(false); Platform.OS === 'web' ? alert(e.message) : Alert.alert('Error', e.message); });
  }, [title, description, category, priority, location, photo, lat, lng, aiResult, lastFile, mutate]);

  const scrollH = Dimensions.get('window').height - insets.top - 60;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
          <MaterialIcons name="arrow-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Raise Complaint</Text>
          <Text style={{ color: TEXT2, fontSize: 12 }}>AI-powered categorization</Text>
        </View>
        <View style={{ backgroundColor: ACCENT + '22', borderRadius: 8, padding: 6 }}>
          <MaterialIcons name="psychology" size={18} color={ACCENT} />
        </View>
      </View>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS !== 'web'}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={true}>
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 6 }}>Complaint Title *</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Burst water pipe near Block A" placeholderTextColor={TEXT2} style={{ backgroundColor: CARD, borderRadius: 12, padding: 14, color: TEXT, fontSize: 14, borderWidth: 1, borderColor: BORDER, marginBottom: 16 }} autoCapitalize="sentences" />
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 10 }}>Category *</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, marginHorizontal: -4 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => setCategory(cat.id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: category === cat.id ? cat.color : CARD, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, margin: 4, borderWidth: 1, borderColor: category === cat.id ? cat.color : BORDER }}>
                <MaterialIcons name={cat.icon} size={15} color={category === cat.id ? '#fff' : cat.color} />
                <Text style={{ color: category === cat.id ? '#fff' : TEXT2, fontSize: 12, marginLeft: 5 }}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 6 }}>Description *</Text>
          <TextInput value={description} onChangeText={setDescription} placeholder="Describe the issue in detail..." placeholderTextColor={TEXT2} style={{ backgroundColor: CARD, borderRadius: 12, padding: 14, color: TEXT, fontSize: 14, borderWidth: 1, borderColor: BORDER, marginBottom: 16, minHeight: 100, textAlignVertical: 'top' }} multiline numberOfLines={4} textAlignVertical="top" />
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 6 }}>Location</Text>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <TextInput value={location} onChangeText={setLocation} placeholder="Enter location or use GPS" placeholderTextColor={TEXT2} style={{ flex: 1, backgroundColor: CARD, borderRadius: 12, padding: 14, color: TEXT, fontSize: 14, borderWidth: 1, borderColor: BORDER, marginRight: 8 }} />
            <TouchableOpacity onPress={handleGetLocation} style={{ backgroundColor: SECONDARY + '22', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: SECONDARY + '44', justifyContent: 'center' }}>
              <MaterialIcons name="my-location" size={22} color={SECONDARY} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 10 }}>Priority</Text>
          <View style={{ flexDirection: 'row', marginBottom: 16, marginHorizontal: -4 }}>
            {['low','medium','high','critical'].map(p => (
              <TouchableOpacity key={p} onPress={() => setPriority(p)} style={{ flex: 1, margin: 4, paddingVertical: 9, borderRadius: 10, alignItems: 'center', backgroundColor: priority === p ? getPriorityColor(p) : CARD, borderWidth: 1, borderColor: priority === p ? getPriorityColor(p) : BORDER }}>
                <Text style={{ color: priority === p ? '#fff' : TEXT2, fontSize: 12, fontWeight: priority === p ? '700' : '400' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: TEXT2, fontSize: 13, marginBottom: 10 }}>Add Evidence</Text>
          <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: -4 }}>
            <TouchableOpacity onPress={() => takePhoto().then(r => { if (r.error) alert(r.error); })} style={{ flex: 1, margin: 4, backgroundColor: CARD, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: BORDER, borderStyle: 'dashed' }}>
              <MaterialIcons name="camera-alt" size={26} color={PRIMARY} />
              <Text style={{ color: TEXT2, fontSize: 11, marginTop: 6, textAlign: 'center' }}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickDocument({ type: ['image/*','video/*'] })} style={{ flex: 1, margin: 4, backgroundColor: CARD, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: BORDER, borderStyle: 'dashed' }}>
              {fpLoading ? <ActivityIndicator size="small" color={ACCENT} /> : <MaterialIcons name="upload-file" size={26} color={ACCENT} />}
              <Text style={{ color: TEXT2, fontSize: 11, marginTop: 6, textAlign: 'center' }}>Upload File</Text>
            </TouchableOpacity>
          </View>
          {(photo || lastFile?.uri) && (
            <View style={{ marginBottom: 20, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: BORDER }}>
              <Image source={{ uri: photo || lastFile.uri }} style={{ width: '100%', height: 180, backgroundColor: CARD }} resizeMode="cover" />
            </View>
          )}
          <TouchableOpacity onPress={handleAnalyze} disabled={analyzing} style={{ backgroundColor: ACCENT, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            {analyzing ? <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} /> : <MaterialIcons name="psychology" size={22} color="#fff" style={{ marginRight: 10 }} />}
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{analyzing ? 'Analyzing...' : '✨ Analyze with AI'}</Text>
          </TouchableOpacity>
          {aiResult && (
            <View style={{ backgroundColor: ACCENT + '15', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: ACCENT + '44' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <MaterialIcons name="psychology" size={20} color={ACCENT} />
                <Text style={{ color: ACCENT, fontSize: 14, fontWeight: '700', marginLeft: 8 }}>AI Analysis Result</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {[{ label: 'Category', value: aiResult.category }, { label: 'Priority', value: aiResult.priority }, { label: 'Risk Level', value: aiResult.risk }].map((item, i) => (
                  <View key={i} style={{ backgroundColor: CARD, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 }}>
                    <Text style={{ color: TEXT2, fontSize: 10 }}>{item.label}</Text>
                    <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600' }}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <View style={{ backgroundColor: CARD, borderRadius: 10, padding: 12 }}>
                <Text style={{ color: TEXT2, fontSize: 11 }}>💡 AI Suggestion</Text>
                <Text style={{ color: TEXT, fontSize: 13, marginTop: 4 }}>{aiResult.suggestion}</Text>
              </View>
            </View>
          )}
          <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={{ backgroundColor: PRIMARY, borderRadius: 14, padding: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} /> : <MaterialIcons name="send" size={20} color="#fff" style={{ marginRight: 10 }} />}
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{submitting ? 'Submitting...' : 'Submit Complaint'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
