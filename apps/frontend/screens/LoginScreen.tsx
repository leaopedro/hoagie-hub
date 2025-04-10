import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useUser } from '../context/UserContext';
import { useApi } from '../hooks/useApi';


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { user, setUser } = useUser();
  const api = useApi();
  
  if (user) navigation.replace('Hoagies');

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!isSignup) {
        try {
            const res = await api.post('/auth/login', { email });
            setUser(res.data);
            navigation.replace('Hoagies');
        } catch (err: any) {
            if (err.response.data.statusCode === 401) {
                setIsSignup(true);
            } else {
                setError('Login failed. Please check your connection or try again later.');
            }
            setIsLoading(false);
            return;
        }
    }

    if (name.trim().length < 2) {
        setError('Name must be at least 2 characters.');
        setIsLoading(false);
        return;
    }
    try {
        const signupRes = await api.post('/auth/signup', { email, name });
        setUser(signupRes.data);
        navigation.replace('Hoagies');
    } catch (err: any) {
        setError('Signup failed. Please check your connection or try again later.');
        setIsLoading(false);
    }
    return;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {isSignup && <>
        <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      </>}
      

      {error.length > 0 && <Text style={styles.error}>{error}</Text>}

      <Button title="Continue" disabled={isLoading} onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12
  },
  label: { fontWeight: 'bold', marginBottom: 4 },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center'
  }
});
