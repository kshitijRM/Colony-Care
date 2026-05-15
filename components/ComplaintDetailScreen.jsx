import React, { useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, Dimensions, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useShare } from 'platform-hooks';
import {
  PRIMARY, ACCENT, BG, CARD, SUCCESS, WARNING, DANGER, SECONDARY, TEXT, TEXT2, BORDER,
  SEED_COMPLAINTS, WORKERS, HEADER_HEIGHT, useApp,
  getCategoryInfo, getPriorityColor, getStatusColor, getStatusLabel, formatTime, getAreaAuthority,
} from './core';

export default function ComplaintDetailScreen({ navigation, route }) {
  const complaintId = route?.params?.complaintId;
  const insets = useSafeAreaInsets();
  const { share } = useShare();
  const { role } = useApp();
  const complaintsQ = useQuery('complaints');
  const workersQ = useQuery('workers');
  const allComplaints = useMemo(() => (complaintsQ.data?.length > 0 ? complaintsQ.data : SEED_COMPLAINTS), [complaintsQ.data]);
  const allWorkers = useMemo(() => {
    const dbData = workersQ.data || [];
    const seedIds = new Set(dbData.map(w => w.id));
    return [...dbData, ...WORKERS.filter(w => !seedIds.has(w.id))];
  }, [workersQ.data]);
  const { mutate: updateComplaint } = useMutation('complaints', 'update');

  const complaint = useMemo(() => (!complaintId ? SEED_COMPLAINTS[0] : allComplaints.find(c => c.id === complaintId) || SEED_COMPLAINTS[0]), [allComplaints, complaintId]);
  const catInfo = getCategoryInfo(complaint.category);
  const [rating, setRating] = useState(0);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const scrollRef = useRef(null);

  const handleAssign = (workerId) => {
    updateComplaint({ id: complaint.id, data: { worker_id: workerId, status: 'in_progress', updated_at: Date.now() } })
      .then(() => { 
        setShowAssignModal(false);
        Platform.OS === 'web' ? alert('Worker assigned!') : Alert.alert('Assigned', 'Worker assigned.'); 
      })
      .catch(e => { Platform.OS === 'web' ? alert(e.message) : Alert.alert('Error', e.message); });
  };

  const handleResolve = () => {
    updateComplaint({ id: complaint.id, data: { status: 'resolved', updated_at: Date.now() } })
      .then(() => { 
        Platform.OS === 'web' ? alert('Issue resolved!') : Alert.alert('Success', 'Issue marked as resolved.'); 
      })
      .catch(e => { Platform.OS === 'web' ? alert(e.message) : Alert.alert('Error', e.message); });
  };

  const timeline = [
    { icon: 'flag', color: PRIMARY, label: 'Complaint Submitted', time: complaint.created_at, desc: 'Complaint #' + complaint.id + ' registered.' },
    complaint.status !== 'pending' ? { icon: 'engineering', color: SECONDARY, label: 'Worker Assigned', time: complaint.created_at + 7200000, desc: 'Worker assigned and inspection scheduled.' } : null,
    (complaint.status === 'in_progress' || complaint.status === 'resolved') ? { icon: 'build', color: WARNING, label: 'Work In Progress', time: complaint.updated_at, desc: 'Team on-site working on the issue.' } : null,
    complaint.status === 'resolved' ? { icon: 'check-circle', color: SUCCESS, label: 'Issue Resolved', time: complaint.updated_at + 3600000, desc: complaint.resolution_notes || 'Issue has been resolved.' } : null,
  ].filter(Boolean);

  const authority = getAreaAuthority(complaint.location);
  const worker = WORKERS.find(w => w.id === complaint.worker_id);
  const scrollH = Dimensions.get('window').height - insets.top - 60;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 14, paddingHorizontal: 20, backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
          <MaterialIcons name="arrow-back" size={24} color={TEXT} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: TEXT, fontSize: 17, fontWeight: 'bold' }}>Complaint Details</Text>
        <TouchableOpacity onPress={() => share({ message: 'Complaint: ' + complaint.title + ' - Status: ' + getStatusLabel(complaint.status), url: '' }).then(r => { if (r.error) alert(r.error); })} style={{ backgroundColor: CARD, borderRadius: 10, padding: 8 }}>
          <MaterialIcons name="share" size={20} color={TEXT} />
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Main card */}
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: BORDER, borderLeftWidth: 4, borderLeftColor: getPriorityColor(complaint.priority) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>{complaint.title}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ backgroundColor: catInfo.color + '22', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name={catInfo.icon} size={13} color={catInfo.color} />
                  <Text style={{ color: catInfo.color, fontSize: 12, marginLeft: 4 }}>{catInfo.label}</Text>
                </View>
                <View style={{ backgroundColor: getPriorityColor(complaint.priority) + '22', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 }}>
                  <Text style={{ color: getPriorityColor(complaint.priority), fontSize: 12 }}>Priority: {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}</Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: getStatusColor(complaint.status) + '22', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: getStatusColor(complaint.status), fontSize: 13, fontWeight: '700' }}>{getStatusLabel(complaint.status)}</Text>
            </View>
          </View>
          <Text style={{ color: TEXT2, fontSize: 14, lineHeight: 22, marginBottom: 12 }}>{complaint.description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="location-on" size={14} color={TEXT2} />
              <Text style={{ color: TEXT2, fontSize: 13, marginLeft: 4 }}>{complaint.location}</Text>
            </View>
            <Text style={{ color: TEXT2, fontSize: 12 }}>{formatTime(complaint.created_at)}</Text>
          </View>
          {complaint.ai_risk && (
            <View style={{ backgroundColor: ACCENT + '15', borderRadius: 10, padding: 12, marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="psychology" size={16} color={ACCENT} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={{ color: ACCENT, fontSize: 12, fontWeight: '600' }}>AI Risk: {complaint.ai_risk}</Text>
                {complaint.ai_category ? <Text style={{ color: TEXT2, fontSize: 12, marginTop: 2 }}>{complaint.ai_category}</Text> : null}
              </View>
            </View>
          )}
          {role === 'admin' && complaint.status !== 'resolved' && (
            <TouchableOpacity 
              onPress={() => setShowAssignModal(true)}
              style={{ backgroundColor: SECONDARY, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialIcons name="engineering" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>
                {complaint.worker_id ? 'Reassign Worker' : 'Assign Worker'}
              </Text>
            </TouchableOpacity>
          )}
          {role === 'admin' && complaint.status === 'in_progress' && (
            <TouchableOpacity 
              onPress={handleResolve}
              style={{ backgroundColor: SUCCESS, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialIcons name="check-circle" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>Resolve Problem</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Local Authority Details */}
        <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: PRIMARY + '44' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <MaterialIcons name="account-balance" size={22} color={PRIMARY} />
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>Local Authority Details</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: TEXT2, fontSize: 13 }}>Constituency MLA</Text>
              <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600' }}>{authority.mla}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: TEXT2, fontSize: 13 }}>Municipality</Text>
              <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600' }}>{authority.municipality}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: TEXT2, fontSize: 13 }}>Department</Text>
              <Text style={{ color: PRIMARY, fontSize: 13, fontWeight: 'bold' }}>{catInfo.label} Department</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: TEXT2, fontSize: 13 }}>Ward No</Text>
              <Text style={{ color: TEXT, fontSize: 13, fontWeight: '600' }}>{authority.ward}</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => {
              const url = 'https://sahaya.bbmp.gov.in/';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                import('react-native').then(({ Linking }) => {
                  Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open the portal.'));
                });
              }
            }}
            style={{ backgroundColor: BG, borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: PRIMARY + '44', marginTop: 4 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="open-in-new" size={16} color={PRIMARY} style={{ marginRight: 6 }} />
              <Text style={{ color: PRIMARY, fontSize: 13, fontWeight: 'bold' }}>Connect to Area Municipality</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Worker card */}
        {worker && (
          <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: PRIMARY + '33', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
              <MaterialIcons name="engineering" size={26} color={PRIMARY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: TEXT2, fontSize: 11, marginBottom: 2 }}>Assigned Worker</Text>
              <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700' }}>{worker.name}</Text>
              <Text style={{ color: TEXT2, fontSize: 12 }}>{worker.dept}</Text>
            </View>
            <View style={{ backgroundColor: SUCCESS + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="star" size={13} color={WARNING} />
              <Text style={{ color: WARNING, fontSize: 12, marginLeft: 3 }}>{String(worker.rating)}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: 'bold', marginBottom: 14 }}>Timeline</Text>
        {timeline.map((event, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ alignItems: 'center', marginRight: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: event.color + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: event.color }}>
                <MaterialIcons name={event.icon} size={18} color={event.color} />
              </View>
              {i < timeline.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: BORDER, marginTop: 4 }} />}
            </View>
            <View style={{ flex: 1, backgroundColor: CARD, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: BORDER }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ color: TEXT, fontSize: 14, fontWeight: '600' }}>{event.label}</Text>
                <Text style={{ color: TEXT2, fontSize: 11 }}>{formatTime(event.time)}</Text>
              </View>
              <Text style={{ color: TEXT2, fontSize: 13 }}>{event.desc}</Text>
            </View>
          </View>
        ))}
        {/* Rating */}
        {complaint.status === 'resolved' && (
          <View style={{ backgroundColor: CARD, borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: BORDER }}>
            <Text style={{ color: TEXT, fontSize: 15, fontWeight: '700', marginBottom: 12 }}>Rate the Service</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ marginHorizontal: 6 }}>
                  <MaterialIcons name={rating >= star ? 'star' : 'star-border'} size={34} color={WARNING} />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <TouchableOpacity style={{ backgroundColor: SUCCESS, borderRadius: 10, padding: 12, alignItems: 'center' }} onPress={() => { Platform.OS === 'web' ? alert('Thank you for rating!') : Alert.alert('Thank you!', 'Rating submitted.'); setRating(0); }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Submit Rating</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Worker Selection Modal */}
      <Modal visible={showAssignModal} transparent animationType="slide" onRequestClose={() => setShowAssignModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Assign Worker</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <MaterialIcons name="close" size={24} color={TEXT2} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: TEXT2, fontSize: 14, marginBottom: 20 }}>Select an available worker for this task.</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allWorkers.map(w => (
                <TouchableOpacity 
                  key={w.id} 
                  onPress={() => handleAssign(w.id)}
                  style={{ 
                    backgroundColor: CARD, borderRadius: 14, padding: 14, marginBottom: 12, 
                    borderWidth: 1, borderColor: complaint.worker_id === w.id ? SECONDARY : BORDER,
                    flexDirection: 'row', alignItems: 'center'
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: (w.active ? SUCCESS : TEXT2) + '22', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                    <MaterialIcons name="engineering" size={22} color={w.active ? SUCCESS : TEXT2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: TEXT, fontSize: 15, fontWeight: '600' }}>{w.name}</Text>
                    <Text style={{ color: TEXT2, fontSize: 12 }}>{w.dept} · {w.completed || 0} resolved</Text>
                  </View>
                  {!w.active && (
                    <View style={{ backgroundColor: TEXT2 + '22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: TEXT2, fontSize: 10 }}>Busy</Text>
                    </View>
                  )}
                  {complaint.worker_id === w.id && (
                    <MaterialIcons name="check-circle" size={20} color={SECONDARY} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
