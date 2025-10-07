import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ 
  icon: Icon, 
  value, 
  label, 
  color,
  index,
  loading 
}: { 
  icon: any; 
  value: string | number; 
  label: string; 
  color: string;
  index: number;
  loading?: boolean;
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

 
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [headerAnim] = useState(new Animated.Value(0));
  const [greetingAnim] = useState(new Animated.Value(0));
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    inProgressQuizzes: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(greetingAnim, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setStats({
          totalQuizzes: 24,
          completedQuizzes: 18,
          inProgressQuizzes: 6,
          averageScore: 85,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  const handleStartQuiz = () => {
    // TODO: Navigate to quiz screen
    console.log('Start Quiz');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }
        ]}
      >
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>
            {user?.firstname} {user?.lastname}
          </Text>
        </View>
      </Animated.View>

     

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: '#9BA1A6', fontWeight: '700', marginBottom: 4 },
  userName: { fontSize: 26, fontWeight: '800', color: '#ECEDEE', letterSpacing: 0.5 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#2a2f34', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#3a4046',
  },
  headerBadgeText: { fontSize: 14, fontWeight: '800', color: '#f5c542'
  },

});