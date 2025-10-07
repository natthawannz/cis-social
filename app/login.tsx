import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('ผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) { 
      console.log('Login successful'); 
      router.replace('/(tabs)');
      } else { 
    Alert.alert('ล็อกอินผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
 }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('ล็อกอินผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการล็อกอิน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      
      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2e2d2dff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 28,
    color: '#ECEDEE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2a2f34',
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#0f1214',
    color: '#ECEDEE',
  },
  button: {
    backgroundColor: '#f5c542',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#0b0b0b',
    fontSize: 16,
    fontWeight: '800',
  },
});