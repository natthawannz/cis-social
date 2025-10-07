import { Calendar, Loader2, Sparkles, Users, UsersRound } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getClassMembers } from '../../services/api';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

export default function MembersScreen() {
  const [year, setYear] = useState('2565');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const years = ['2563', '2564', '2565', '2566', '2567'];

  useEffect(() => {
    loadMembers();
  }, [year]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error('No auth token');
      const gregorianYear = (() => {
        const n = parseInt(year, 10);
        return Number.isFinite(n) ? String(n - 543) : year;
      })();
      const data = await getClassMembers(gregorianYear, token);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load members', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarGradient = (initial: string) => {
    const gradients = [
      { start: '#667eea', end: '#764ba2' },
      { start: '#f093fb', end: '#f5576c' },
      { start: '#4facfe', end: '#00f2fe' },
      { start: '#43e97b', end: '#38f9d7' },
      { start: '#fa709a', end: '#fee140' },
      { start: '#30cfd0', end: '#330867' },
      { start: '#a8edea', end: '#fed6e3' },
      { start: '#ff9a9e', end: '#fecfef' },
    ];
    const index = initial.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const MemberCard = ({ member, index }: { member: any; index: number }) => {
    const [scaleAnim] = useState(new Animated.Value(0));

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }, []);

    const fullName = member.name || [member.firstname, member.lastname].filter(Boolean).join(' ') || member.email || 'ไม่ระบุชื่อ';
    const studentId = member.studentId || member.education?.studentId || '';
    const initial = (fullName?.charAt(0) || 'S').toUpperCase();
    const gradient = getAvatarGradient(initial);

    return (
      <Animated.View style={[
        styles.memberCard,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        }
      ]}>
        <View style={styles.cardGlow} />
        <View style={[styles.avatar, { backgroundColor: gradient.start }]}>
          <View style={[styles.avatarInner, { backgroundColor: gradient.end }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {fullName}
          </Text>
          {studentId && (
            <View style={styles.idBadge}>
              <View style={styles.idDot} />
              <Text style={styles.studentId} numberOfLines={1}>
                {studentId}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundPattern} />
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCircle}>
              <Loader2 color="#667eea" size={40} strokeWidth={2.5} />
            </View>
            <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
            <Text style={styles.loadingSubText}>โปรดรอสักครู่</Text>
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item, index) => (item?._id || item?.id || `index-${index}`).toString()}
            renderItem={({ item, index }) => <MemberCard member={item} index={index} />}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                {/* Header with Gradient Background */}
                <View style={styles.headerGradient}>
                  <View style={styles.headerGlow} />
                  <View style={styles.header}>
                    <View style={styles.titleContainer}>
                      <View style={styles.iconWrapper}>
                        <Users color="#ffffff" size={28} strokeWidth={2.5} />
                      </View>
                      <View>
                        <Text style={styles.title}>รายชื่อสมาชิก</Text>
                        <View style={styles.titleUnderline} />
                      </View>
                    </View>
                    <Text style={styles.subtitle}>เลือกปีการศึกษาเพื่อดูรายชื่อสมาชิก</Text>
                    
                    <View style={styles.yearSelectorContainer}>
                      <View style={styles.yearLabelContainer}>
                        <View style={styles.calendarIcon}>
                          <Calendar color="#667eea" size={16} strokeWidth={2} />
                        </View>
                        <Text style={styles.yearLabel}>ปีการศึกษา</Text>
                      </View>
                      <View style={styles.yearButtonsWrapper}>
                        {years.map((y) => (
                          <TouchableOpacity
                            key={y}
                            style={[
                              styles.yearButton,
                              year === y && styles.yearButtonActive
                            ]}
                            onPress={() => setYear(y)}
                            activeOpacity={0.7}
                          >
                            <Text style={[
                              styles.yearButtonText,
                              year === y && styles.yearButtonTextActive
                            ]}>
                              {y}
                            </Text>
                            {year === y && (
                              <View style={styles.activeIndicator} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Stats Card */}
                {members.length > 0 && (
                  <View style={styles.statsCard}>
                    <View style={styles.statsGlow} />
                    <View style={styles.statsIconContainer}>
                      <Sparkles color="#667eea" size={24} strokeWidth={2} />
                    </View>
                    <View style={styles.statsTextContainer}>
                      <View style={styles.statsRow}>
                        <Text style={styles.statsNumber}>{members.length}</Text>
                        <Text style={styles.statsUnit}>คน</Text>
                      </View>
                      <Text style={styles.statsLabel}>สมาชิกทั้งหมด</Text>
                    </View>
                    <View style={styles.statsDecorator} />
                  </View>
                )}
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <UsersRound color="#cbd5e1" size={56} strokeWidth={1.5} />
                  <View style={styles.emptyIconDot} />
                </View>
                <Text style={styles.emptyText}>ไม่พบข้อมูลสมาชิก</Text>
                <Text style={styles.emptySubText}>
                  ลองเลือกปีการศึกษาอื่นดู
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  backgroundPattern: { position: 'absolute', top: 0, left: 0, right: 0, height: 400, backgroundColor: '#0b0b0b' },
  content: { flex: 1 },

  headerGradient: {
    backgroundColor: '#131619',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 16,
    elevation: 8, marginBottom: -30, overflow: 'hidden',
    borderBottomWidth: 1, borderColor: '#2a2f34',
  },
  headerGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(245,197,66,0.06)' },
  header: { paddingHorizontal: 24, paddingBottom: 28 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 },
  iconWrapper: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(245,197,66,0.12)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,197,66,0.25)',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#ECEDEE', letterSpacing: 0.5 },
  titleUnderline: { height: 3, width: '100%', backgroundColor: 'rgba(245,197,66,0.35)', borderRadius: 2, marginTop: 4 },
  subtitle: { fontSize: 14, color: '#9BA1A6', textAlign: 'center', marginBottom: 24, fontWeight: '600' },

  yearSelectorContainer: {
    backgroundColor: '#131619', borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 4,
    borderWidth: 1, borderColor: '#2a2f34',
  },
  yearLabelContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  calendarIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0f1214', justifyContent: 'center', alignItems: 'center' },
  yearLabel: { fontSize: 15, fontWeight: '800', color: '#ECEDEE' },

  yearButtonsWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  yearButton: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, backgroundColor: '#0f1214',
    borderWidth: 1, borderColor: '#2a2f34', minWidth: 70, alignItems: 'center', position: 'relative',
  },
  yearButtonActive: {
    backgroundColor: '#f5c542', borderColor: '#f5c542',
    shadowColor: '#f5c542', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  yearButtonText: { fontSize: 15, fontWeight: '700', color: '#9BA1A6' },
  yearButtonTextActive: { color: '#0b0b0b', fontWeight: '800' },
  activeIndicator: { position: 'absolute', bottom: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#0b0b0b' },

  statsCard: {
    flexDirection: 'row', backgroundColor: '#131619', paddingVertical: 20, paddingHorizontal: 20,
    borderRadius: 18, marginBottom: 20, marginTop: 40, marginHorizontal: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
    borderWidth: 1, borderColor: '#2a2f34', overflow: 'hidden', position: 'relative',
  },
  statsGlow: { position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#f5c542', opacity: 0.05 },
  statsIconContainer: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#0f1214', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#2a2f34' },
  statsTextContainer: { flex: 1 },
  statsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  statsNumber: { fontSize: 32, fontWeight: '800', color: '#f5c542', lineHeight: 36 },
  statsUnit: { fontSize: 16, fontWeight: '700', color: '#9BA1A6' },
  statsLabel: { fontSize: 13, color: '#9BA1A6', fontWeight: '700', marginTop: 2 },
  statsDecorator: { position: 'absolute', bottom: -10, right: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5c542', opacity: 0.05 },

  listContent: { paddingBottom: 32 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 16 },

  memberCard: {
    width: CARD_WIDTH, backgroundColor: '#131619', borderRadius: 18, padding: 18, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 5,
    borderWidth: 1, borderColor: '#2a2f34', position: 'relative', overflow: 'hidden',
  },
  cardGlow: { position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5c542', opacity: 0.05 },

  avatar: { width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 16, padding: 3 },
  avatarInner: {
    width: '100%', height: '100%', borderRadius: 39, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.22)',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#0b0b0b' },

  memberInfo: { alignItems: 'center', width: '100%' },
  name: { fontSize: 15, fontWeight: '800', color: '#ECEDEE', textAlign: 'center', marginBottom: 10, lineHeight: 20 },
  idBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f1214',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14, borderWidth: 1, borderColor: '#2a2f34', gap: 6,
  },
  idDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#f5c542' },
  studentId: { fontSize: 12, color: '#f5c542', fontWeight: '800', textAlign: 'center', letterSpacing: 0.3 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  loadingCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#131619', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6, borderWidth: 1, borderColor: '#2a2f34',
  },
  loadingText: { marginTop: 12, fontSize: 18, fontWeight: '800', color: '#ECEDEE' },
  loadingSubText: { fontSize: 14, color: '#9BA1A6', marginTop: 6, fontWeight: '600' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyIconContainer: {
    width: 130, height: 130, borderRadius: 65, backgroundColor: '#0f1214', justifyContent: 'center', alignItems: 'center',
    marginBottom: 28, borderWidth: 1, borderColor: '#2a2f34', borderStyle: 'dashed', position: 'relative',
  },
  emptyIconDot: { position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: '#131619', borderWidth: 2, borderColor: '#2a2f34' },
  emptyText: { fontSize: 20, color: '#ECEDEE', fontWeight: '800', marginBottom: 8 },
  emptySubText: { fontSize: 15, color: '#9BA1A6', textAlign: 'center', fontWeight: '600' },
});