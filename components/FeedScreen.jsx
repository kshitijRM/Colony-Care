import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform, ScrollView, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, ACCENT, BG, CARD, SUCCESS, WARNING, DANGER, SECONDARY, TEXT, TEXT2, BORDER, TAB_MENU_HEIGHT, SCROLL_EXTRA_PADDING, WEB_TAB_MENU_PADDING, useApp, FEED_SEED, formatTime } from './core';

const TYPE_COLORS = { complaint_ref: DANGER, positive: SUCCESS, announcement: ACCENT, update: SECONDARY, discussion: PRIMARY };
const TYPE_ICONS = { complaint_ref: 'report-problem', positive: 'thumb-up', announcement: 'campaign', update: 'update', discussion: 'forum' };

export default function FeedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const appCtx = useApp();
  const { theme = { bg: '#0F172A', card: '#1E293B' }, userName = 'User' } = appCtx;
  const [tab, setTab] = useState('trending');
  const [upvoted, setUpvoted] = useState({});
  const [counts, setCounts] = useState(FEED_SEED.reduce((acc, f) => { acc[f.id] = f.upvotes; return acc; }, {}));
  const [commentModal, setCommentModal] = useState({ visible: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [allComments, setAllComments] = useState(FEED_SEED.reduce((acc, f) => { 
    acc[f.id] = [
      { id: 'c1', user: 'Ananya', text: 'Totally agree!', time: Date.now() - 100000 },
      { id: 'c2', user: 'Vikram', text: 'This needs to be fixed ASAP.', time: Date.now() - 50000 }
    ].slice(0, f.comments > 0 ? 2 : 0);
    return acc; 
  }, {}));

  const scrollBottom = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING;

  const handleUpvote = useCallback((id) => {
    setUpvoted(p => {
      const isUp = !p[id];
      setCounts(c => ({ ...c, [id]: (c[id] || 0) + (isUp ? 1 : -1) }));
      return { ...p, [id]: isUp };
    });
  }, []);

  const handleAddComment = () => {
    if (!commentText.trim() || !commentModal.postId) return;
    const newComment = {
      id: Date.now().toString(),
      user: appCtx.userName,
      text: commentText,
      time: Date.now()
    };
    setAllComments(p => ({
      ...p,
      [commentModal.postId]: [...(p[commentModal.postId] || []), newComment]
    }));
    setCommentText('');
  };

  const filteredFeed = useMemo(() => {
    if (tab === 'trending') return [...FEED_SEED].sort((a, b) => (counts[b.id] || b.upvotes) - (counts[a.id] || a.upvotes));
    if (tab === 'announcements') return FEED_SEED.filter(f => f.type === 'announcement' || f.type === 'complaint_ref');
    if (tab === 'discussions') return FEED_SEED.filter(f => f.type === 'discussion' || f.type === 'positive' || f.type === 'update');
    return FEED_SEED;
  }, [tab, counts]);

  const TABS = [{ key: 'trending', label: '🔥 Trending' }, { key: 'announcements', label: '📢 Announcements' }, { key: 'discussions', label: '💬 Discuss' }];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingBottom: 0, backgroundColor: theme.bg, borderBottomWidth: 1, borderBottomColor: BORDER }}>
        <Text style={{ color: TEXT, fontSize: 20, fontWeight: 'bold', marginBottom: 14, paddingHorizontal: 20 }}>Community Feed 🏘️</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 0 }}
          style={{ marginBottom: 0 }}
        >
          {TABS.map(t => (
            <TouchableOpacity 
              key={t.key} 
              onPress={() => setTab(t.key)} 
              style={{ 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                marginRight: 8, 
                borderBottomWidth: 2, 
                borderBottomColor: tab === t.key ? PRIMARY : 'transparent',
                backgroundColor: tab === t.key ? PRIMARY + '11' : 'transparent',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: tab === t.key ? PRIMARY : TEXT2, fontSize: 13, fontWeight: tab === t.key ? '700' : '500' }}>{t.label}</Text>
              {t.badge && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: DANGER, marginLeft: 6, marginTop: -8 }} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredFeed}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: scrollBottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BORDER, flexDirection: 'row' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ACCENT + '33', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <MaterialIcons name="create" size={22} color={ACCENT} />
            </View>
            <TouchableOpacity style={{ flex: 1, backgroundColor: BG, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: BORDER }}>
              <Text style={{ color: TEXT2, fontSize: 14 }}>What&apos;s happening in your colony?</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item: post }) => {
          const tc = TYPE_COLORS[post.type] || PRIMARY;
          const ti = TYPE_ICONS[post.type] || 'forum';
          const isUp = upvoted[post.id];
          const postComments = allComments[post.id] || [];
          return (
            <View style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BORDER }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: PRIMARY + '33', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: PRIMARY, fontSize: 16, fontWeight: 'bold' }}>{post.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: TEXT, fontSize: 14, fontWeight: '600' }}>{post.user}</Text>
                  <Text style={{ color: TEXT2, fontSize: 12 }}>{formatTime(post.time)}</Text>
                </View>
                <View style={{ backgroundColor: tc + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name={ti} size={13} color={tc} />
                  <Text style={{ color: tc, fontSize: 11, marginLeft: 4 }}>{post.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
                </View>
              </View>
              <Text style={{ color: TEXT, fontSize: 14, lineHeight: 22, marginBottom: 12 }}>{post.content}</Text>
              {post.complaint_id && (
                <TouchableOpacity onPress={() => navigation.navigate('ComplaintDetail', { complaintId: post.complaint_id })} style={{ backgroundColor: BG, borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: BORDER }}>
                  <MaterialIcons name="link" size={16} color={PRIMARY} />
                  <Text style={{ color: PRIMARY, fontSize: 12, marginLeft: 6 }}>View Referenced Complaint #{post.complaint_id}</Text>
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER }}>
                <TouchableOpacity onPress={() => handleUpvote(post.id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isUp ? PRIMARY + '22' : CARD, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 10, borderWidth: 1, borderColor: isUp ? PRIMARY : BORDER }}>
                  <MaterialIcons name={isUp ? 'thumb-up' : 'thumb-up-off-alt'} size={16} color={isUp ? PRIMARY : TEXT2} />
                  <Text style={{ color: isUp ? PRIMARY : TEXT2, fontSize: 13, marginLeft: 5 }}>{String(counts[post.id] || post.upvotes)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCommentModal({ visible: true, postId: post.id })} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, marginRight: 10 }}>
                  <MaterialIcons name="chat-bubble-outline" size={16} color={TEXT2} />
                  <Text style={{ color: TEXT2, fontSize: 13, marginLeft: 5 }}>{String(postComments.length || post.comments)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 'auto' }}>
                  <MaterialIcons name="share" size={18} color={TEXT2} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal visible={commentModal.visible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%', paddingBottom: insets.bottom }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: BORDER }}>
              <Text style={{ color: TEXT, fontSize: 18, fontWeight: 'bold' }}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModal({ visible: false, postId: null })}>
                <MaterialIcons name="close" size={24} color={TEXT2} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, padding: 20 }}>
              {(allComments[commentModal.postId] || []).map(c => (
                <View key={c.id} style={{ marginBottom: 20, flexDirection: 'row' }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: PRIMARY + '22', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Text style={{ color: PRIMARY, fontSize: 14, fontWeight: 'bold' }}>{c.user[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: TEXT, fontSize: 14, fontWeight: '600' }}>{c.user}</Text>
                      <Text style={{ color: TEXT2, fontSize: 11 }}>{formatTime(c.time)}</Text>
                    </View>
                    <Text style={{ color: TEXT2, fontSize: 14, lineHeight: 20 }}>{c.text}</Text>
                  </View>
                </View>
              ))}
              {(allComments[commentModal.postId] || []).length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                  <MaterialIcons name="chat-bubble-outline" size={48} color={BORDER} />
                  <Text style={{ color: TEXT2, fontSize: 14, marginTop: 12 }}>No comments yet. Be the first!</Text>
                </View>
              )}
            </ScrollView>
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor={TEXT2 + '66'}
                style={{ flex: 1, backgroundColor: theme.bg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: TEXT, marginRight: 12 }}
              />
              <TouchableOpacity onPress={handleAddComment} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

