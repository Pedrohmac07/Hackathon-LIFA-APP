import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, TrendingUp } from 'lucide-react-native';
import { formatMoney } from '../../utils/formatters';

interface Props {
 saldo: number;
 score: number;
 spendingPercent: number;
}

export const BalanceSummary = ({ saldo, score, spendingPercent }: Props) => {
 return (
  <View>
   <Text style={styles.label}>Saldo disponível</Text>
   <Text style={styles.saldo}>{formatMoney(saldo)}</Text>

   <View style={styles.stats}>
    <View style={styles.pill}>
     <Shield size={14} color="#10B981" />
     <Text style={styles.pillText}>Score {score}</Text>
    </View>
    <View style={[styles.pill, { backgroundColor: '#2E1065' }]}>
     <TrendingUp size={14} color="#A78BFA" />
     <Text style={[styles.pillText, { color: '#A78BFA' }]}>
      Gastos {spendingPercent.toFixed(0)}%
     </Text>
    </View>
   </View>
  </View>
 );
};

const styles = StyleSheet.create({
 label: { color: '#71717A', fontSize: 13, marginTop: 4 },
 saldo: { color: '#fff', fontSize: 38, fontWeight: 'bold', letterSpacing: -1 },
 stats: { flexDirection: 'row', gap: 10, marginTop: 15, marginBottom: 20 },
 pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
 pillText: { color: '#10B981', fontWeight: 'bold', fontSize: 12 },
});
