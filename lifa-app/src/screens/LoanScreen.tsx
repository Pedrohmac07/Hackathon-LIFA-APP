import React, { useEffect, useState } from 'react';
import {
 View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
 SafeAreaView, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';
import { ArrowLeft, Coins, CheckCircle, AlertTriangle, Calendar } from 'lucide-react-native';
import { API_URL } from '../config/api';
import { formatMoney, formatDate } from '../utils/formatters';

interface Props {
 userId: number;
 onBack: () => void;
}

export const LoanScreen = ({ userId, onBack }: Props) => {
 const [loading, setLoading] = useState(true);
 const [info, setInfo] = useState<any>(null);

 // Estados do Simulador
 const [amount, setAmount] = useState('');
 const [months, setMonths] = useState(12);
 const [simulating, setSimulating] = useState(false);

 const fetchLoanInfo = () => {
  setLoading(true);
  axios.get(`${API_URL}/loans/info/${userId}`)
   .then(res => setInfo(res.data))
   .catch(err => console.log(err))
   .finally(() => setLoading(false));
 };

 useEffect(() => { fetchLoanInfo(); }, []);

 const handleSimulateAndHire = () => {
  const value = parseFloat(amount);

  if (!value || value <= 0) return Alert.alert("Erro", "Digite um valor válido.");
  if (value > info.maxLimit) return Alert.alert("Negado", `O valor máximo aprovado para seu perfil é ${formatMoney(info.maxLimit)}.`);

  const rate = 0.035;
  const total = value * (1 + (rate * months));

  Alert.alert(
   "Confirmar Empréstimo",
   `Você vai pegar: ${formatMoney(value)}\nVai pagar: ${formatMoney(total)}\nEm: ${months} parcelas.\n\nO dinheiro cai na sua conta agora.`,
   [
    { text: "Cancelar", style: "cancel" },
    { text: "CONTRATAR", onPress: confirmHire }
   ]
  );
 };

 const confirmHire = async () => {
  setSimulating(true);
  try {
   await axios.post(`${API_URL}/loans/create`, {
    userId,
    amount: parseFloat(amount),
    installments: months
   });
   Alert.alert("Sucesso!", "O dinheiro já está na sua conta! 💸");
   fetchLoanInfo();
  } catch (error) {
   Alert.alert("Erro", "Falha ao contratar empréstimo.");
  } finally {
   setSimulating(false);
  }
 };

 if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#F59E0B" /></View>;

 const activeLoan = info?.activeLoan;

 return (
  <SafeAreaView style={styles.container}>

   <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
    <Text style={styles.headerTitle}>Empréstimos</Text>
    <View style={{ width: 24 }} />
   </View>

   <ScrollView contentContainerStyle={{ padding: 24 }}>
    {activeLoan ? (
     <View>
      <View style={styles.activeCard}>
       <View style={styles.activeHeader}>
        <Coins color="#000" size={24} />
        <Text style={styles.activeTitle}>Contrato Ativo</Text>
       </View>

       <Text style={styles.labelDark}>Valor Restante</Text>
       <Text style={styles.debtValue}>{formatMoney(activeLoan.total_payable)}</Text>

       <View style={styles.divider} />

       <View style={styles.row}>
        <View>
         <Text style={styles.labelDark}>Taxa</Text>
         <Text style={styles.infoDark}>{activeLoan.interest_rate}% a.m.</Text>
        </View>
        <View>
         <Text style={styles.labelDark}>Vencimento</Text>
         <Text style={styles.infoDark}>{formatDate(activeLoan.due_date)}</Text>
        </View>
        <View>
         <Text style={styles.labelDark}>Parcelas</Text>
         <Text style={styles.infoDark}>{activeLoan.installments}x</Text>
        </View>
       </View>
      </View>

      <View style={styles.warningBox}>
       <AlertTriangle color="#F59E0B" size={20} />
       <Text style={styles.warningText}>Você só pode solicitar um novo empréstimo após quitar o atual.</Text>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={() => Alert.alert("Boleto", "Código de barras copiado para a área de transferência!")}>
       <Text style={styles.payBtnText}>ANTECIPAR PARCELA</Text>
      </TouchableOpacity>
     </View>

    ) : (
     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.limitCard}>
       <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <CheckCircle color="#10B981" size={24} />
        <View>
         <Text style={styles.limitLabel}>Limite Pré-Aprovado</Text>
         <Text style={styles.limitValue}>{formatMoney(info?.maxLimit || 0)}</Text>
        </View>
       </View>
      </View>

      <Text style={styles.sectionTitle}>Quanto você precisa?</Text>

      <View style={styles.inputContainer}>
       <Text style={styles.currencyPrefix}>R$</Text>
       <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="0,00"
        placeholderTextColor="#52525B"
        value={amount}
        onChangeText={setAmount}
       />
      </View>

      <Text style={styles.sectionTitle}>Parcelar em ({months}x)</Text>
      <View style={styles.monthSelector}>
       {[6, 12, 18, 24].map((m) => (
        <TouchableOpacity
         key={m}
         style={[styles.monthBtn, months === m && styles.monthBtnActive]}
         onPress={() => setMonths(m)}
        >
         <Text style={[styles.monthText, months === m && styles.monthTextActive]}>{m}x</Text>
        </TouchableOpacity>
       ))}
      </View>

      {amount ? (
       <View style={styles.simulationBox}>
        <View style={styles.simRow}>
         <Text style={styles.simLabel}>Você recebe:</Text>
         <Text style={styles.simValue}>{formatMoney(parseFloat(amount))}</Text>
        </View>
        <View style={styles.simRow}>
         <Text style={styles.simLabel}>Juros (3.5%):</Text>
         <Text style={[styles.simValue, { color: '#EF4444' }]}>
          + {formatMoney(parseFloat(amount) * (0.035 * months))}
         </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: '#3F3F46' }]} />
        <View style={styles.simRow}>
         <Text style={styles.simLabel}>Total a pagar:</Text>
         <Text style={[styles.simValue, { color: '#F59E0B' }]}>
          {formatMoney(parseFloat(amount) * (1 + (0.035 * months)))}
         </Text>
        </View>
       </View>
      ) : null}

      <TouchableOpacity style={styles.hireBtn} onPress={handleSimulateAndHire} disabled={simulating}>
       {simulating ? <ActivityIndicator color="#000" /> : <Text style={styles.hireBtnText}>PEGAR EMPRÉSTIMO</Text>}
      </TouchableOpacity>

      <View style={styles.disclaimerBox}>
       <Text style={styles.disclaimerText}>Crédito sujeito a análise. O valor cai na conta na hora.</Text>
      </View>
     </KeyboardAvoidingView>
    )}

   </ScrollView>
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 loading: { flex: 1, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center' },
 header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingTop: 50 },
 backBtn: { padding: 8, backgroundColor: '#18181B', borderRadius: 12 },
 headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

 activeCard: { backgroundColor: '#F59E0B', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
 activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
 activeTitle: { color: '#000', fontSize: 18, fontWeight: 'bold' },
 labelDark: { color: 'rgba(0,0,0,0.6)', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' },
 debtValue: { color: '#000', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
 divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 15 },
 row: { flexDirection: 'row', justifyContent: 'space-between' },
 infoDark: { color: '#000', fontSize: 16, fontWeight: 'bold' },

 payBtn: { backgroundColor: '#18181B', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#27272A', marginTop: 20 },
 payBtnText: { color: '#F59E0B', fontWeight: 'bold' },

 limitCard: { backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 16, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
 limitLabel: { color: '#10B981', fontSize: 12 },
 limitValue: { color: '#10B981', fontSize: 20, fontWeight: 'bold' },

 sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
 inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#27272A' },
 currencyPrefix: { color: '#71717A', fontSize: 24, marginRight: 10 },
 input: { flex: 1, color: '#fff', fontSize: 24, fontWeight: 'bold' },

 monthSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
 monthBtn: { flex: 1, backgroundColor: '#18181B', paddingVertical: 12, marginHorizontal: 4, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },
 monthBtnActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
 monthText: { color: '#71717A', fontWeight: 'bold' },
 monthTextActive: { color: '#000' },

 simulationBox: { backgroundColor: '#18181B', padding: 20, borderRadius: 16, marginBottom: 24 },
 simRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
 simLabel: { color: '#A1A1AA' },
 simValue: { color: '#fff', fontWeight: 'bold' },

 hireBtn: { backgroundColor: '#F59E0B', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
 hireBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

 warningBox: { flexDirection: 'row', gap: 8, paddingHorizontal: 10, alignItems: 'center', marginTop: 10 },
 warningText: { color: '#F59E0B', fontSize: 12 },

 disclaimerBox: { alignItems: 'center' },
 disclaimerText: { color: '#52525B', fontSize: 11 },
});
