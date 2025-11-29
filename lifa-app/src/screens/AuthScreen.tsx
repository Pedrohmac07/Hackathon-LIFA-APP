import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { User, Lock, Mail, ArrowRight } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import icon from '../../assets/icon.png'

export const AuthScreen = ({ onLoginSuccess }: { onLoginSuccess: (id: number, nome: string) => void }) => {
 const [isLogin, setIsLogin] = useState(true);
 const [nome, setNome] = useState('');
 const [email, setEmail] = useState('');
 const [senha, setSenha] = useState('');
 const [loading, setLoading] = useState(false);

 const handleAuth = async () => {
  if (!email || !senha || (!isLogin && !nome)) { Alert.alert("Atenção", "Preencha todos os campos."); return; }
  setLoading(true);
  try {
   const res = await axios.post(`${API_URL}${isLogin ? '/login' : '/signup'}`, { nome, email, senha });
   onLoginSuccess(res.data.userId, res.data.nome);
  } catch (error: any) {
   Alert.alert("Erro", error.response?.data?.error || "Falha na conexão.");
  } finally {
   setLoading(false);
  }
 };

 return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
   <View style={styles.content}>
    <View style={styles.header}>
     <View style={styles.logo}>
      <Image
       source={icon}
       style={{ width: 64, height: 64 }}
       resizeMode={'contain'}
      />
     </View>
     <Text style={styles.brand}>LIFA</Text>
    </View>

    <Text style={styles.title}>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</Text>
    <Text style={styles.subtitle}>{isLogin ? 'Acesse seu hub financeiro.' : 'Inteligência para o seu dinheiro.'}</Text>

    {!isLogin && (<View style={styles.inputBox}><User color="#71717A" size={20} /><TextInput placeholder="Nome" placeholderTextColor="#52525B" style={styles.input} value={nome} onChangeText={setNome} /></View>)}
    <View style={styles.inputBox}><Mail color="#71717A" size={20} /><TextInput placeholder="Email" placeholderTextColor="#52525B" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" /></View>
    <View style={styles.inputBox}><Lock color="#71717A" size={20} /><TextInput placeholder="Senha" placeholderTextColor="#52525B" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry /></View>

    <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
     {loading ? <ActivityIndicator color="#000" /> : <><Text style={styles.btnText}>{isLogin ? 'ENTRAR' : 'CRIAR'}</Text><ArrowRight color="#000" size={20} /></>}
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 20 }}>
     <Text style={styles.switch}>{isLogin ? 'Não tem conta? ' : 'Já tem conta? '} <Text style={{ color: '#10B981', fontWeight: 'bold' }}>{isLogin ? 'Cadastre-se' : 'Faça Login'}</Text></Text>
    </TouchableOpacity>
   </View>
  </KeyboardAvoidingView>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 content: { flex: 1, justifyContent: 'center', padding: 24 },
 header: { alignItems: 'center', marginBottom: 40 },
 logo: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
 brand: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 4 },
 title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
 subtitle: { color: '#A1A1AA', fontSize: 16, marginBottom: 32 },
 inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#27272A' },
 input: { flex: 1, color: '#fff', marginLeft: 12, fontSize: 16 },
 btn: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 10, gap: 10 },
 btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
 switch: { color: '#A1A1AA', textAlign: 'center', fontSize: 14 },
});
