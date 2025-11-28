import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { X, ArrowDownLeft, ArrowUpRight, FileText, ShoppingBag, Car, Zap, Coffee, GraduationCap, HeartPulse, MoreHorizontal } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { DonutChart } from './DonutChart';
import { formatMoney } from '../utils/formatters';

interface Props {
 visible: boolean;
 onClose: () => void;
 userId: number;
}

const getCategoryConfig = (categoryName: string) => {
 const name = categoryName.toLowerCase();
 if (name.includes('mercado') || name.includes('comida') || name.includes('aliment')) return { icon: Coffee, color: '#F59E0B' };
 if (name.includes('transporte') || name.includes('uber') || name.includes('combust')) return { icon: Car, color: '#3B82F6' };
 if (name.includes('lazer') || name.includes('viagem') || name.includes('jogos')) return { icon: ShoppingBag, color: '#EC4899' };
 if (name.includes('educa') || name.includes('livro') || name.includes('curso')) return { icon: GraduationCap, color: '#8B5CF6' };
 if (name.includes('saude') || name.includes('farmacia') || name.includes('medico')) return { icon: HeartPulse, color: '#EF4444' };
 if (name.includes('contas') || name.includes('luz') || name.includes('internet')) return { icon: Zap, color: '#EAB308' };
 return { icon: MoreHorizontal, color: '#71717A' };
};

export const StatsModal = ({ visible, onClose, userId }: Props) => {
 const [stats, setStats] = useState<any>(null);
 const [report, setReport] = useState<string | null>(null);
 const [loadingStats, setLoadingStats] = useState(true);
 const [loadingReport, setLoadingReport] = useState(false);
 const animProgress = useRef(new Animated.Value(0)).current;

 useEffect(() => {
  if (visible) {
   setLoadingStats(true);
   setReport(null);
   animProgress.setValue(0);

   axios.get(`${API_URL}/stats/${userId}`)
    .then(res => {
     setStats(res.data);
     Animated.spring(animProgress, { toValue: 1, friction: 6, useNativeDriver: false }).start();
     setLoadingReport(true);
     return axios.post(`${API_URL}/generate-report`, { userId });
    })
    .then(res => setReport(res.data.report))
    .catch(err => console.log(err))
    .finally(() => {
     setLoadingStats(false);
     setLoadingReport(false);
    });
  }
 }, [visible]);

 // ✨ FUNÇÃO MÁGICA PARA RENDERIZAR NEGRITO
 // Ela quebra o texto onde tem "**" e alterna o estilo
 const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split('**');
  return (
   <Text style={styles.aiReportText}>
    {parts.map((part, index) => {
     // Se o índice for ímpar, é o texto que estava entre asteriscos -> BOLD
     if (index % 2 === 1) {
      return <Text key={index} style={{ fontWeight: 'bold', color: '#000' }}>{part}</Text>;
     }
     return <Text key={index}>{part}</Text>;
    })}
   </Text>
  );
 };

 return (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
   <View style={styles.container}>
    <View style={styles.header}>
     <Text style={styles.title}>Central de Gastos</Text>
     <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X color="#fff" size={24} /></TouchableOpacity>
    </View>

    {loadingStats ? (
     <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 50 }} />
    ) : stats ? (
     <ScrollView contentContainerStyle={{ padding: 24 }}>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
       <Text style={{ color: '#A1A1AA', marginBottom: 10, fontSize: 12, textTransform: 'uppercase' }}>Fluxo de Caixa</Text>
       <Animated.View style={{ opacity: animProgress, transform: [{ scale: animProgress }] }}>
        <DonutChart receitas={stats.receitas} despesas={stats.despesas} />
       </Animated.View>
      </View>

      <View style={styles.summary}>
       <View style={styles.box}>
        <ArrowDownLeft color="#10B981" size={20} />
        <Text style={styles.label}>Entradas</Text>
        <Text style={[styles.value, { color: '#10B981' }]}>{formatMoney(stats.receitas)}</Text>
       </View>
       <View style={[styles.box, { borderLeftWidth: 1, borderColor: '#27272A' }]}>
        <ArrowUpRight color="#EF4444" size={20} />
        <Text style={styles.label}>Saídas</Text>
        <Text style={[styles.value, { color: '#EF4444' }]}>{formatMoney(stats.despesas)}</Text>
       </View>
      </View>

      <Text style={styles.sectionTitle}>Ranking de Despesas</Text>
      {stats.categorias.map((cat: any, index: number) => {
       const config = getCategoryConfig(cat.nome);
       const Icon = config.icon;
       return (
        <View key={index} style={styles.catRow}>
         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={[styles.iconBg, { backgroundColor: `${config.color}20` }]}>
           <Icon size={16} color={config.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
           <Text style={styles.catName}>{cat.nome}</Text>
           <Text style={styles.catValue}>{formatMoney(cat.valor)}</Text>
          </View>
         </View>
         <View style={styles.progressBase}>
          <Animated.View style={[styles.progressFill, { backgroundColor: config.color, width: animProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${cat.porcentagem}%`] }) }]} />
         </View>
         <Text style={styles.catPercent}>{cat.porcentagem.toFixed(1)}% do total</Text>
        </View>
       )
      })}

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Análise da LIFA</Text>
      <View style={styles.aiReportCard}>
       <View style={styles.aiReportHeader}>
        <FileText color="#000" size={20} />
        <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 8 }}>RELATÓRIO MENSAL</Text>
       </View>

       {loadingReport ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
         <ActivityIndicator color="#000" />
         <Text style={{ color: '#333', marginTop: 10, fontStyle: 'italic' }}>Analisando seus dados...</Text>
        </View>
       ) : (
        <View style={{ padding: 16 }}>
         {/* Usando a nova função de renderização */}
         {renderFormattedText(report || "Não foi possível gerar a análise.")}
        </View>
       )}
      </View>

     </ScrollView>
    ) : null}
   </View>
  </Modal>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 40, borderBottomWidth: 1, borderColor: '#27272A' },
 title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
 closeBtn: { padding: 8, backgroundColor: '#18181B', borderRadius: 50 },
 summary: { flexDirection: 'row', backgroundColor: '#18181B', borderRadius: 16, padding: 16, marginBottom: 30 },
 box: { flex: 1, alignItems: 'center', gap: 4 },
 label: { color: '#A1A1AA', fontSize: 12 },
 value: { fontSize: 16, fontWeight: 'bold' },
 sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
 catRow: { marginBottom: 16 },
 iconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
 catName: { color: '#fff', fontWeight: '500', fontSize: 14 },
 catValue: { color: '#E4E4E7', fontWeight: 'bold' },
 catPercent: { color: '#71717A', fontSize: 11, marginTop: 4, textAlign: 'right' },
 progressBase: { height: 6, backgroundColor: '#27272A', borderRadius: 3, overflow: 'hidden' },
 progressFill: { height: '100%', borderRadius: 3 },
 aiReportCard: { backgroundColor: '#FCD34D', borderRadius: 16, overflow: 'hidden', marginBottom: 40 },
 aiReportHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
 // Removi o padding daqui pois movi para a View wrapper
 aiReportText: { color: '#18181B', fontSize: 14, lineHeight: 22, textAlign: 'left' }
});
