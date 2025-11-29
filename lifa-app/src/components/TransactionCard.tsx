import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { formatMoney, formatDate } from '../utils/formatters';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
 UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const TransactionCard = ({ item }: { item: any }) => {
 const [loading, setLoading] = useState(false);
 const [insightData, setInsightData] = useState<{ insight: string, action: string | null } | null>(null);
 const [expanded, setExpanded] = useState(false);

 const isSaida = item.data.realType === 'saida';

 const handleGetInsight = async () => {
  if (expanded && insightData) { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpanded(false); return; }
  if (!expanded && insightData) { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpanded(true); return; }

  setLoading(true);
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setExpanded(true);

  try {
   const response = await axios.post(`${API_URL}/generate-insight`, {
    descricao: item.data.estabelecimento,
    valor: item.data.valor,
    categoria: item.data.categoria
   });
   setInsightData(response.data);
  } catch (error) {
   setInsightData({ insight: "Erro ao gerar insight.", action: null });
  } finally { setLoading(false); }
 };

 return (
  <View style={styles.container}>
   <View style={styles.mainRow}>
    <View style={[styles.iconBox, { backgroundColor: isSaida ? '#2A1515' : '#062C1F' }]}>
     {isSaida ? <ArrowUpRight color="#EF4444" size={20} /> : <ArrowDownLeft color="#10B981" size={20} />}
    </View>

    <View style={{ flex: 1 }}>
     <Text style={styles.title}>{item.data.estabelecimento}</Text>
     <Text style={styles.meta}>{item.data.categoria} • {formatDate(item.data.data)}</Text>
    </View>

    <View style={{ alignItems: 'flex-end' }}>
     {/* Corrigido para usar a lógica certa */}
     <Text style={[styles.value, { color: isSaida ? '#F87171' : '#34D399' }]}>
      {isSaida ? '-' : '+'}{formatMoney(item.data.valor)}
     </Text>

     <TouchableOpacity style={[styles.aiBtn, expanded && styles.aiBtnActive]} onPress={handleGetInsight}>
      <Sparkles size={12} color={expanded ? "#fff" : "#D8B4FE"} />
      <Text style={[styles.aiBtnText, expanded && { color: '#fff' }]}>
       {loading ? "..." : (insightData ? "Insight" : "IA")}
      </Text>
     </TouchableOpacity>
    </View>
   </View>

   {expanded && (
    <View style={styles.insightBox}>
     {loading ? <ActivityIndicator color="#7C3AED" size="small" /> : (
      <>
       <Text style={styles.insightText}>{insightData?.insight}</Text>
       {insightData?.action && (
        <TouchableOpacity style={styles.actionBtn}>
         <Text style={styles.actionBtnText}>
          {insightData.action === 'seguro' ? '🛡️ VER PROTEÇÃO' : '💸 VER OPÇÕES'}
         </Text>
        </TouchableOpacity>
       )}
      </>
     )}
    </View>
   )}
  </View>
 );
};

const styles = StyleSheet.create({
 container: { backgroundColor: '#18181B', borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#27272A', overflow: 'hidden' },
 mainRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
 iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
 title: { color: '#fff', fontWeight: '600', fontSize: 15 },
 meta: { color: '#71717A', fontSize: 12, marginTop: 2 },
 value: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
 aiBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(124, 58, 237, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(124, 58, 237, 0.3)' },
 aiBtnActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
 aiBtnText: { color: '#D8B4FE', fontSize: 10, fontWeight: 'bold' },
 insightBox: { backgroundColor: '#151518', padding: 16, borderTopWidth: 1, borderTopColor: '#27272A' },
 insightText: { color: '#E4E4E7', fontSize: 14, lineHeight: 20 },
 actionBtn: { marginTop: 12, backgroundColor: '#7C3AED', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start' },
 actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
