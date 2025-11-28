import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Alert, Platform } from 'react-native';
import axios from 'axios';
// Adicionei Trash2 (Lixeira) nos imports
import { ArrowLeft, CreditCard, Eye, EyeOff, Copy, Trash2, Plus, Sparkles } from 'lucide-react-native';
import { API_URL } from '../config/api';
import { formatMoney } from '../utils/formatters';

interface Props {
 userId: number;
 onBack: () => void;
}

export const CardsScreen = ({ userId, onBack }: Props) => {
 const [cards, setCards] = useState<any>({ credit: null, debit: null });
 const [loading, setLoading] = useState(true);
 const [creating, setCreating] = useState(false);
 const [activeTab, setActiveTab] = useState<'credito' | 'debito'>('credito');
 const [showValues, setShowValues] = useState(true);

 const fetchCards = () => {
  setLoading(true);
  axios.get(`${API_URL}/cards/${userId}`)
   .then(res => setCards(res.data))
   .catch(err => console.log(err))
   .finally(() => setLoading(false));
 };

 useEffect(() => {
  fetchCards();
 }, []);

 const handleCreateCard = async () => {
  setCreating(true);
  try {
   await axios.post(`${API_URL}/cards/create`, { userId, type: activeTab });
   Alert.alert("Sucesso!", `Seu cartão de ${activeTab} foi emitido.`);
   fetchCards();
  } catch (error) {
   Alert.alert("Erro", "Não foi possível emitir o cartão.");
  } finally {
   setCreating(false);
  }
 };

 // 🗑️ FUNÇÃO DE EXCLUIR CARTÃO
 const handleDeleteCard = (cardId: number) => {
  Alert.alert(
   "Excluir Cartão",
   "Tem certeza que deseja cancelar este cartão? Essa ação não pode ser desfeita.",
   [
    { text: "Cancelar", style: "cancel" },
    {
     text: "Excluir",
     style: "destructive",
     onPress: async () => {
      try {
       setLoading(true);
       await axios.delete(`${API_URL}/cards/delete/${cardId}`);

       // Atualiza o estado local removendo o cartão visualmente na hora
       if (activeTab === 'credito') setCards({ ...cards, credit: null });
       else setCards({ ...cards, debit: null });

       Alert.alert("Feito", "Cartão excluído com sucesso.");
      } catch (error) {
       Alert.alert("Erro", "Falha ao excluir cartão.");
      } finally {
       setLoading(false);
      }
     }
    }
   ]
  );
 };

 const currentCard = activeTab === 'credito' ? cards?.credit : cards?.debit;
 const isCredit = activeTab === 'credito';
 const cardColor = isCredit ? '#7C3AED' : '#10B981';

 if (loading && !cards.credit && !cards.debit) {
  return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#7C3AED" /></View>;
 }

 return (
  <SafeAreaView style={styles.container}>

   <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
    <Text style={styles.headerTitle}>Meus Cartões</Text>
    <View style={{ width: 24 }} />
   </View>

   <View style={styles.tabsContainer}>
    <TouchableOpacity style={[styles.tab, activeTab === 'credito' && styles.activeTab]} onPress={() => setActiveTab('credito')}>
     <Text style={[styles.tabText, activeTab === 'credito' && styles.activeTabText]}>Crédito</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.tab, activeTab === 'debito' && styles.activeTab]} onPress={() => setActiveTab('debito')}>
     <Text style={[styles.tabText, activeTab === 'debito' && styles.activeTabText]}>Débito</Text>
    </TouchableOpacity>
   </View>

   <View style={styles.content}>

    {currentCard ? (
     <>
      <View style={[styles.cardVisual, { backgroundColor: cardColor }]}>
       <View style={styles.cardRow}>
        <View style={styles.chip} />
        <CreditCard color="rgba(255,255,255,0.5)" size={32} />
       </View>
       <Text style={styles.cardNumber}>{currentCard.card_number}</Text>
       <View style={styles.cardFooter}>
        <View><Text style={styles.cardLabel}>Titular</Text><Text style={styles.cardInfo}>{currentCard.holder_name}</Text></View>
        <View><Text style={styles.cardLabel}>Validade</Text><Text style={styles.cardInfo}>{currentCard.expiration_date}</Text></View>
       </View>
      </View>

      <View style={styles.infoContainer}>
       <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{isCredit ? 'Fatura Atual' : 'Disponível'}</Text>
        <TouchableOpacity onPress={() => setShowValues(!showValues)}>
         {showValues ? <EyeOff color="#71717A" size={20} /> : <Eye color="#71717A" size={20} />}
        </TouchableOpacity>
       </View>
       <Text style={[styles.infoValue, { color: isCredit ? '#A78BFA' : '#34D399' }]}>
        {showValues ? (isCredit ? formatMoney(currentCard.current_invoice) : 'Ver saldo') : '••••••'}
       </Text>
       {isCredit && (
        <View style={styles.limitBarContainer}>
         <Text style={styles.limitText}>Limite total: {formatMoney(currentCard.limit_amount)}</Text>
         <View style={styles.limitBarBg}><View style={[styles.limitBarFill, { width: '30%' }]} /></View>
        </View>
       )}
      </View>

      {/* AÇÕES ATUALIZADAS: EXCLUIR E COPIAR */}
      <View style={styles.actionsGrid}>

       {/* Botão de Excluir */}
       <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteCard(currentCard.id)}>
        <View style={[styles.actionIconBg, { borderColor: '#EF4444' }]}>
         <Trash2 color="#EF4444" size={24} />
        </View>
        <Text style={[styles.actionText, { color: '#EF4444' }]}>Excluir</Text>
       </TouchableOpacity>

       {/* Botão de Copiar */}
       <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Copiado!", "Número do cartão copiado.")}>
        <View style={styles.actionIconBg}>
         <Copy color="#fff" size={24} />
        </View>
        <Text style={styles.actionText}>Copiar</Text>
       </TouchableOpacity>

      </View>
     </>
    ) : (
     <View style={styles.emptyState}>
      <View style={styles.emptyCard}>
       <Sparkles color="#71717A" size={40} />
       <Text style={styles.emptyTitle}>Você não tem cartão de {activeTab}</Text>
       <Text style={styles.emptyDesc}>
        {isCredit
         ? "Use seu Score para liberar crédito aprovado na hora."
         : "Movimente sua conta com um cartão de débito internacional."}
       </Text>
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={handleCreateCard} disabled={creating}>
       {creating ? <ActivityIndicator color="#000" /> : (
        <>
         <Plus color="#000" size={24} />
         <Text style={styles.createBtnText}>SOLICITAR CARTÃO AGORA</Text>
        </>
       )}
      </TouchableOpacity>
     </View>
    )}

   </View>
  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 loadingContainer: { flex: 1, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center' },
 header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, paddingTop: 50 },
 backBtn: { padding: 8, backgroundColor: '#18181B', borderRadius: 12 },
 headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
 tabsContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24 },
 tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#27272A' },
 activeTab: { borderBottomColor: '#fff' },
 tabText: { color: '#71717A', fontWeight: 'bold' },
 activeTabText: { color: '#fff' },
 content: { paddingHorizontal: 24 },
 cardVisual: { height: 200, borderRadius: 24, padding: 24, justifyContent: 'space-between', marginBottom: 30, elevation: 10 },
 cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
 chip: { width: 40, height: 30, backgroundColor: '#e2e2e2', borderRadius: 6, opacity: 0.8 },
 cardNumber: { color: '#fff', fontSize: 22, letterSpacing: 4, fontWeight: 'bold', marginVertical: 20, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
 cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
 cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase' },
 cardInfo: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
 infoContainer: { marginBottom: 30 },
 infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
 infoLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
 infoValue: { fontSize: 32, fontWeight: 'bold' },
 limitBarContainer: { marginTop: 15 },
 limitText: { color: '#A1A1AA', fontSize: 12, marginBottom: 8 },
 limitBarBg: { height: 8, backgroundColor: '#27272A', borderRadius: 4 },
 limitBarFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },

 // AÇÕES (GRID 2 BOTÕES)
 actionsGrid: { flexDirection: 'row', justifyContent: 'center', gap: 40 }, // Centralizado com espaço
 actionBtn: { alignItems: 'center', gap: 8 },
 actionIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#18181B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },
 actionText: { color: '#A1A1AA', fontSize: 12 },

 emptyState: { alignItems: 'center', marginTop: 40 },
 emptyCard: { width: '100%', height: 200, borderWidth: 2, borderColor: '#27272A', borderRadius: 24, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 20, marginBottom: 30 },
 emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
 emptyDesc: { color: '#71717A', textAlign: 'center', paddingHorizontal: 20 },
 createBtn: { backgroundColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, gap: 10, elevation: 5 },
 createBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
