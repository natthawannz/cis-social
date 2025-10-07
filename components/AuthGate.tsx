import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, InteractionManager, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const isNavigationReady = !!navigationState?.key;

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'login';

    InteractionManager.runAfterInteractions(() => {
      console.log('Auth Check:', {
        user: !!user,
        inAuthGroup,
        segment: segments[0],
      });

      if (!user && !inAuthGroup) {
        console.log('Redirecting to login');
        router.replace('/login');
      } else if (user && inAuthGroup) {
        console.log('Redirecting to tabs');
        router.replace('/(tabs)');
      }
    });
  }, [user, segments, isNavigationReady]);

  if (!isNavigationReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>กำลังโหลด...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
