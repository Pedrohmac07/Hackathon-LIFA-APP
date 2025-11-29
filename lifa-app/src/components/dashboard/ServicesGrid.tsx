import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { CreditCard, ShieldCheck, Coins } from 'lucide-react-native';

interface Props {
 onOpenCards: () => void;
 onOpenInsurance: () => void;
 onOpenLoans: () => void;
}

export const ServicesGrid = ({ onOpenCards, onOpenInsurance, onOpenLoans }: Props) => {

 return (
  <View style={styles.grid}>
   <ServiceButton
    icon={CreditCard}
    color="#A78BFA"
    label="Cartões"
    onPress={onOpenCards}
   />

   <ServiceButton
    icon={ShieldCheck}
    color="#10B981"
    label="Seguros"
    onPress={onOpenInsurance}
   />

   <ServiceButton
    icon={Coins}
    color="#F59E0B"
    label="Empréstimo"
    onPress={onOpenLoans}
   />
  </View>
 );
};

const ServiceButton = ({ icon: Icon, color, label, onPress }: any) => (
 <TouchableOpacity style={styles.box} onPress={onPress}>
  <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
   <Icon color={color} size={24} />
  </View>
  <Text style={styles.text}>{label}</Text>
 </TouchableOpacity>
);

const styles = StyleSheet.create({
 grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
 box: {
  flex: 1,
  backgroundColor: '#18181B',
  padding: 16,
  borderRadius: 16,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#27272A'
 },
 iconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
 text: { color: '#E4E4E7', fontSize: 11, fontWeight: 'bold' },
});
