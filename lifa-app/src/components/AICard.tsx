import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export const AICard = ({ item }: { item: any }) => (
 <View style={styles.card}>
  <View style={styles.header}>
   <Sparkles size={18} color="#D8B4FE" />
   <Text style={styles.label}>LIFA Insight</Text>
  </View>
  <Text style={styles.text}>{item.data.mensagem}</Text>
  <TouchableOpacity style={styles.button}>
   <Text style={styles.buttonText}>
    {item.data.tipo_servico === 'seguro' ? '🛡️ ATIVAR PROTEÇÃO' : 'VER OFERTA'}
   </Text>
  </TouchableOpacity>
 </View>
);

const styles = StyleSheet.create({
 card: { backgroundColor: '#1C1038', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#7C3AED', elevation: 5 },
 header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
 label: { color: '#D8B4FE', fontWeight: 'bold', fontSize: 13 },
 text: { color: '#E9D5FF', fontSize: 15, lineHeight: 22, marginBottom: 15 },
 button: { backgroundColor: '#7C3AED', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignSelf: 'flex-start' },
 buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
