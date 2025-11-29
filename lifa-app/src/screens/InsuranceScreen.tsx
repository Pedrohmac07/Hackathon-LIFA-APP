import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { ArrowLeft, ShieldCheck, Smartphone, Heart, Car, Home, Plus, XCircle, CheckCircle } from 'lucide-react-native';
import { API_URL } from '../config/api';
import { formatMoney } from '../utils/formatters';

interface Props {
 userId: number;
 onBack: () => void;
}

const getIcon = (type: string, color: string) => {
 switch (type) {
  case 'celular': return <Smartphone color={color} size={24} />;
  case 'vida': return <Heart color={color} size={24} />;
  case 'carro': return <Car color={color} size={24} />;
  case 'casa': return <Home color={color} size={24} />;
  default: return <ShieldCheck color={color} size={24} />;
 }
};

export const InsuranceScreen = ({ userId, onBack }: Props) => {
 const [myInsurances, setMyInsurances] = useState<any[]>([]);
 const [availablePlans, setAvailablePlans] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 const fetchData = async () => {
  setLoading(true);
  try {
   const [myRes, plansRes] = await Promise.all([
    axios.get(`${API_URL}/insurance/my/${userId}`),
    axios.get(`${API_URL}/insurance/plans`)
   ]);
   setMyInsurances(myRes.data);

   setAvailablePlans(plansRes.data);
  } catch (error) {
   console.log(error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => { fetchData(); }, []);

 const handleBuy = (plan: any) => {
  Alert.alert(
   "Contratar Seguro",
   `Deseja contratar o ${plan.name} por ${formatMoney(plan.monthly_price)}/mês?`,
   [
    { text: "Cancelar", style: "cancel" },
    {
     text: "Confirmar",
     onPress: async () => {
      try {
       await axios.post(`${API_URL}/insurance/buy`, { userId, planId: plan.id });
       Alert.alert("Sucesso!", "Sua proteção está ativa. 🛡️");
       fetchData();
      } catch (e) { Alert.alert("Erro", "Falha na contratação."); }
     }
    }
   ]
  );
 };

 const handleCancel = (insuranceId: number) => {
  Alert.alert(
   "Cancelar Proteção",
   "Tem certeza que deseja cancelar este seguro?",
   [
    { text: "Não", style: "cancel" },
    {
     text: "Sim, Cancelar",
     style: 'destructive',
     onPress: async () => {
      try {
       await axios.delete(`${API_URL}/insurance/cancel/${insuranceId}`);
       fetchData();
      } catch (e) { Alert.alert("Erro", "Falha ao cancelar."); }
     }
    }
   ]
  );
 };

 return (
  <SafeAreaView style={styles.container}>
   <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
    <Text style={styles.headerTitle}>Seguros e Proteção</Text>
    <View style={{ width: 24 }} />
   </View>

   {loading ? (
    <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 50 }} />
   ) : (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
     <Text style={styles.sectionTitle}>Minhas Proteções</Text>
     {myInsurances.length === 0 ? (
      <View style={styles.emptyBox}>
       <Text style={styles.emptyText}>Você ainda não tem seguros ativos.</Text>
      </View>
     ) : (
      myInsurances.map((ins) => (
       <TouchableOpacity key={ins.id} style={styles.activeCard} onPress={() => handleCancel(ins.id)}>
        <View style={styles.activeHeader}>
         <View style={styles.iconContainerActive}>{getIcon(ins.icon_type, '#10B981')}</View>
         <View style={{ flex: 1 }}>
          <Text style={styles.activeTitle}>{ins.name}</Text>
          <Text style={styles.activeSubtitle}>Cobertura de {formatMoney(ins.coverage_amount)}</Text>
         </View>
         <CheckCircle color="#10B981" size={20} />
        </View>
        <Text style={styles.cancelHint}>Toque para gerenciar ou cancelar</Text>
       </TouchableOpacity>
      ))
     )}

     <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Disponíveis para Você</Text>
     {availablePlans.map((plan) => (
      <View key={plan.id} style={styles.planCard}>
       <View style={styles.planRow}>
        <View style={styles.iconContainerPlan}>{getIcon(plan.icon_type, '#A1A1AA')}</View>
        <View style={{ flex: 1 }}>
         <Text style={styles.planTitle}>{plan.name}</Text>
         <Text style={styles.planDesc}>{plan.description}</Text>
        </View>
       </View>

       <View style={styles.planFooter}>
        <Text style={styles.planPrice}>{formatMoney(plan.monthly_price)}<Text style={styles.perMonth}>/mês</Text></Text>
        <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy(plan)}>
         <Text style={styles.buyBtnText}>CONTRATAR</Text>
        </TouchableOpacity>
       </View>
      </View>
     ))}

    </ScrollView>
   )}
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingTop: 50 },
 backBtn: { padding: 8, backgroundColor: '#18181B', borderRadius: 12 },
 headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

 sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
 emptyBox: { padding: 20, backgroundColor: '#18181B', borderRadius: 16, alignItems: 'center' },
 emptyText: { color: '#71717A' },

 // Cards Ativos (Meus Seguros)
 activeCard: { backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
 activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
 iconContainerActive: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' },
 activeTitle: { color: '#10B981', fontWeight: 'bold', fontSize: 16 },
 activeSubtitle: { color: '#A1A1AA', fontSize: 12 },
 cancelHint: { color: '#065F46', fontSize: 10, marginTop: 10, textAlign: 'center' },

 planCard: { backgroundColor: '#18181B', padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#27272A' },
 planRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
 iconContainerPlan: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#27272A', justifyContent: 'center', alignItems: 'center' },
 planTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
 planDesc: { color: '#A1A1AA', fontSize: 13, marginTop: 2 },

 planFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#27272A', paddingTop: 12 },
 planPrice: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
 perMonth: { fontSize: 12, color: '#71717A', fontWeight: 'normal' },
 buyBtn: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
 buyBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
});
