import {
  ChevronRight,
  Edit3,
  LogOut,
  Mail,
  Shield,
  Tag,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const getInitials = (firstname?: string, lastname?: string) => {
  if (!firstname && !lastname) return 'U';
  const first = firstname?.charAt(0) || '';
  const last = lastname?.charAt(0) || '';
  return (first + last).toUpperCase();
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    { start: '#667eea', end: '#764ba2' },
    { start: '#f093fb', end: '#f5576c' },
    { start: '#4facfe', end: '#00f2fe' },
    { start: '#43e97b', end: '#38f9d7' },
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

const getRoleBadgeColor = (role?: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
    case 'teacher':
      return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
    case 'student':
      return { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
    default:
      return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
  }
};

const InfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  index 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  index: number;
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.infoIconContainer}>
        <Icon color="#667eea" size={20} strokeWidth={2.5} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </Animated.View>
  );
};

const MenuButton = ({ 
  icon: Icon, 
  label, 
  onPress,
  danger = false
}: { 
  icon: any; 
  label: string; 
  onPress: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity 
    style={[styles.menuButton, danger && styles.menuButtonDanger]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
      <Icon 
        color={danger ? '#ef4444' : '#667eea'} 
        size={20} 
        strokeWidth={2.5} 
      />
    </View>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
      {label}
    </Text>
    <ChevronRight 
      color={danger ? '#ef4444' : '#94a3b8'} 
      size={20} 
      strokeWidth={2} 
    />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [headerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const fullName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || 'ผู้ใช้';
  const initials = getInitials(user?.firstname, user?.lastname);
  const gradient = getAvatarGradient(fullName);
  const roleBadge = getRoleBadgeColor(user?.role);

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerGlow1} />
        <View style={styles.headerGlow2} />
      </View>

      {/* Profile Header */}
      <Animated.View 
        style={[
          styles.profileHeader,
          {
            opacity: headerAnim,
            transform: [
              {
                scale: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }
        ]}
      >
        <View style={[styles.avatarLarge, { backgroundColor: gradient.start }]}>
          <View style={[styles.avatarInner, { backgroundColor: gradient.end }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.editBadge}>
            <Edit3 color="#ffffff" size={16} strokeWidth={2.5} />
          </View>
        </View>
        
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <View style={[styles.roleBadge, { backgroundColor: roleBadge.bg, borderColor: roleBadge.border }]}>
          <Shield color={roleBadge.text} size={14} strokeWidth={2.5} />
          <Text style={[styles.roleBadgeText, { color: roleBadge.text }]}>
            {user?.role || 'User'}
          </Text>
        </View>
      </Animated.View>

      {/* Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
        
        <InfoCard
          icon={User}
          label="ชื่อ-นามสกุล"
          value={fullName}
          index={0}
        />
        
        <InfoCard
          icon={Mail}
          label="อีเมล"
          value={user?.email || '-'}
          index={1}
        />
        
        <InfoCard
          icon={Shield}
          label="บทบาท"
          value={user?.role || '-'}
          index={2}
        />
        
        <InfoCard
          icon={Tag}
          label="ประเภท"
          value={user?.type || '-'}
          index={3}
        />
      </View>

      {/* Menu Section */}
      <View style={styles.section}>
        <View style={styles.menuContainer}>
          <MenuButton
            icon={LogOut}
            label="ออกจากระบบ"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>

      {/* Footer */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },

  headerBackground: { height: 220, backgroundColor: '#131619', position: 'relative', overflow: 'hidden', borderBottomWidth: 1, borderColor: '#2a2f34' },
  headerGlow1: { position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(245,197,66,0.08)' },
  headerGlow2: { position: 'absolute', bottom: -80, left: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(245,197,66,0.06)' },

  profileHeader: { alignItems: 'center', marginTop: -80, paddingHorizontal: 24 },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', padding: 4, position: 'relative' },
  avatarInner: { width: '100%', height: '100%', borderRadius: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.22)' },
  avatarText: { fontSize: 42, fontWeight: '800', color: '#0b0b0b' },
  editBadge: {
    position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f5c542', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#131619',
  },

  userName: { fontSize: 26, fontWeight: '800', color: '#ECEDEE', marginTop: 16, letterSpacing: 0.5 },
  userEmail: { fontSize: 15, color: '#9BA1A6', marginTop: 4, fontWeight: '600' },

  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 12, borderWidth: 1, borderColor: '#3a4046', backgroundColor: '#0f1214' },
  roleBadgeText: { fontSize: 13, fontWeight: '800', textTransform: 'capitalize', color: '#f5c542' },

  section: { paddingHorizontal: 24, marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#ECEDEE', marginBottom: 16, letterSpacing: 0.5 },

  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#131619', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#2a2f34',
  },
  infoIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f1214', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#2a2f34' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#9BA1A6', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 15, color: '#ECEDEE', fontWeight: '800' },

  menuContainer: { backgroundColor: '#131619', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#2a2f34' },
  menuButton: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#131619' },
  menuButtonDanger: { backgroundColor: '#221314' },
  menuIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0f1214', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#2a2f34' },
  menuIconDanger: { backgroundColor: '#2b1414' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '800', color: '#ECEDEE' },
  menuLabelDanger: { color: '#ef4444' },

  footer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  footerText: { fontSize: 13, color: '#9BA1A6', fontWeight: '700', marginBottom: 4 },
  footerSubText: { fontSize: 12, color: '#6b7177', fontWeight: '600' },
});