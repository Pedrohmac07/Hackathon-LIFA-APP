import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, ArrowRight, User, DollarSign, Database, PlusCircle, MinusCircle, ShoppingBag } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

interface Props {
 visible: boolean;
 onClose: () => void;
 userId: number;
 onSuccess: () => void;
}

export const ActionModal = ({ visible, onClose, userId, onSuccess }: Props) => {
 const [tab, setTab] = useState<'pix' | 'admin'>('pix');
 const [loading, setLoading] = useState(false);

 // Estados PIX / Saldo
 const [email, setEmail] = useState('');
 const [amount, setAmount] = useState(''); // Valor para PIX e ADD SALDO

 // Estados Despesas
 const [expenseVal, setExpenseVal] = useState(''); // <--- Valor exclusivo da despesa
 const [adminDesc, setAdminDesc] = useState('');
 const [adminCat, setAdminCat] = useState('');

 const handlePix = async () => {
  if (!email || !amount) return Alert.alert("Erro", "Preencha tudo.");
  setLoading(true);
  try {
   await axios.post(`${API_URL}/pix/send`, { senderId: userId, email, amount });
   Alert.alert("Sucesso!", "Pix enviado.");
   onSuccess(); onClose(); setEmail(''); setAmount('');
  } catch (error: any) { Alert.alert("Falha", error.response?.data?.error || "Erro."); }
  finally { setLoading(false); }
 };

 const handleAdminAddMoney = async () => {
  if (!amount) return Alert.alert("Erro", "Digite o valor para adicionar.");
  setLoading(true);
  try {
   await axios.post(`${API_URL}/admin/add-balance`, { userId, amount });
   Alert.alert("Admin", `R$ ${amount} adicionados.`);
   onSuccess(); onClose(); setAmount('');
  } catch (e) { Alert.alert("Erro", "Falha ao add saldo."); }
  finally { setLoading(false); }
 };

 const handleAdminAddExpense = async () => {
  if (!expenseVal || !adminDesc) return Alert.alert("Erro", "Preencha o VALOR e a DESCRIÇÃO.");

  setLoading(true);
  try {
   await axios.post(`${API_URL}/admin/add-expense`, {
    userId,
    value: expenseVal,
    description: adminDesc,
    category: adminCat || 'Outros'
   });
   Alert.alert("Admin", "Gasto registrado com sucesso!");
   onSuccess(); onClose();
   setExpenseVal(''); setAdminDesc(''); setAdminCat('');
  } catch (e) {
   Alert.alert("Erro", "Falha ao criar gasto.");
  }
  finally { setLoading(false); }
 };

 return (
  <Modal visible={visible} transparent animationType="slide">
   <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
    <View style={styles.container}>

     <View style={styles.header}>
      <View style={styles.tabs}>
       <TouchableOpacity onPress={() => setTab('pix')} style={[styles.tab, tab === 'pix' && styles.activeTab]}>
        <Text style={[styles.tabText, tab === 'pix' && styles.activeTabText]}>Área PIX</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => setTab('admin')} style={[styles.tab, tab === 'admin' && styles.activeTab]}>
        <Text style={[styles.tabText, tab === 'admin' && styles.activeTabText]}>Hub Admin</Text>
       </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X color="#fff" size={24} /></TouchableOpacity>
     </View>

     <ScrollView contentContainerStyle={styles.body}>
      {tab === 'pix' ? (
       <View>
        <Text style={styles.label}>Para quem?</Text>
        <View style={styles.inputBox}>
         <User color="#71717A" size={20} />
         <TextInput
          placeholder="E-mail do recebedor" placeholderTextColor="#52525B"
          style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none"
         />
        </View>

        <Text style={styles.label}>Valor (R$)</Text>
        <View style={styles.inputBox}>
         <DollarSign color="#71717A" size={20} />
         <TextInput
          placeholder="0.00" placeholderTextColor="#52525B"
          style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric"
         />
        </View>

        <TouchableOpacity style={styles.sendBtn} onPress={handlePix} disabled={loading}>
         {loading ? <ActivityIndicator color="#000" /> : (
          <><Text style={styles.sendBtnText}>ENVIAR PIX</Text><ArrowRight color="#000" /></>
         )}
        </TouchableOpacity>
       </View>
      ) : (
       <View>
        <View style={styles.adminRow}>
         <Database color="#FCD34D" size={20} />
         <Text style={styles.adminTitle}>Painel de Controle</Text>
        </View>

        <Text style={styles.label}>Injetar Dinheiro</Text>
        <View style={styles.rowInputs}>
         <View style={[styles.inputBox, { flex: 1, marginBottom: 0 }]}>
          <TextInput
           placeholder="Valor Saldo" placeholderTextColor="#52525B"
           style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric"
          />
         </View>
         <TouchableOpacity style={styles.iconBtnGreen} onPress={handleAdminAddMoney}>
          <PlusCircle color="#000" size={24} />
         </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Gerar Despesa Fake</Text>

        <View style={styles.inputBox}>
         <DollarSign color="#EF4444" size={20} />
         <TextInput
          placeholder="Valor do Gasto (R$)" placeholderTextColor="#52525B"
          style={styles.input} value={expenseVal} onChangeText={setExpenseVal} keyboardType="numeric"
         />
        </View>

        <View style={styles.inputBox}>
         <ShoppingBag color="#71717A" size={20} />
         <TextInput placeholder="Descrição (Ex: Netflix)" placeholderTextColor="#52525B" style={styles.input} value={adminDesc} onChangeText={setAdminDesc} />
        </View>

        <View style={styles.inputBox}>
         <TextInput placeholder="Categoria (Ex: Lazer)" placeholderTextColor="#52525B" style={styles.input} value={adminCat} onChangeText={setAdminCat} />
        </View>

        <TouchableOpacity style={[styles.adminBtn, { backgroundColor: '#EF4444' }]} onPress={handleAdminAddExpense}>
         {loading ? <ActivityIndicator color="#fff" /> : (
          <>
           <MinusCircle color="#fff" size={20} />
           <Text style={[styles.adminBtnText, { color: '#fff' }]}>CRIAR GASTO</Text>
          </>
         )}
        </TouchableOpacity>
       </View>
      )}
     </ScrollView>

    </View>
   </KeyboardAvoidingView>
  </Modal>
 );
};

const styles = StyleSheet.create({
 overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
 container: { backgroundColor: '#18181B', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%' },
 header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#27272A' },
 tabs: { flexDirection: 'row', flex: 1, gap: 15 },
 tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
 activeTab: { backgroundColor: '#27272A' },
 tabText: { color: '#71717A', fontWeight: 'bold' },
 activeTabText: { color: '#fff' },
 closeBtn: { padding: 5 },

 body: { padding: 24 },
 label: { color: '#A1A1AA', marginBottom: 8, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
 inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#09090B', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#27272A' },
 input: { flex: 1, color: '#fff', marginLeft: 10, fontSize: 16 },

 sendBtn: { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 10, gap: 10 },
 sendBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

 adminRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
 adminTitle: { color: '#FCD34D', fontWeight: 'bold', fontSize: 16 },
 rowInputs: { flexDirection: 'row', gap: 10, marginBottom: 10 },
 iconBtnGreen: { backgroundColor: '#10B981', width: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
 adminBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 8, marginTop: 5 },
 adminBtnText: { fontWeight: 'bold', fontSize: 14 },
 divider: { height: 1, backgroundColor: '#27272A', marginVertical: 20 }
});
