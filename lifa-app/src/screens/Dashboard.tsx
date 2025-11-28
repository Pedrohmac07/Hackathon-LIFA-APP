import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, SafeAreaView, Animated, RefreshControl, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { PieChart, ArrowRight, Banknote } from 'lucide-react-native';

import { API_URL } from '../config/api';
import { TransactionCard } from '../components/TransactionCard';
import { StatsModal } from '../components/StatsModal';
import { NotificationsModal } from '../components/dashboard/NotificationsModal';
import { ActionModal } from '../components/dashboard/ActionModal'; // <--- NOVO IMPORT
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { BalanceSummary } from '../components/dashboard/BalanceSummary';
import { ServicesGrid } from '../components/dashboard/ServicesGrid';
import { MenuModal } from '../components/dashboard/MenuModal';

interface DashboardProps {
 userId: number;
 userName: string;
 onLogout: () => void;
 onNavigateToCards: () => void;
 onNavigateToInsurance: () => void;
 onNavigateToLoans: () => void;
}

export const Dashboard = ({
 userId, userName, onLogout,
 onNavigateToCards, onNavigateToInsurance, onNavigateToLoans
}: DashboardProps) => {

 // --- Estados de Dados ---
 const [feed, setFeed] = useState<any[]>([]);
 const [user, setUser] = useState<any>(null);
 const [spendingPercent, setSpendingPercent] = useState<number>(0);

 // --- Estado de UI ---
 const [refreshing, setRefreshing] = useState(false);
 const fadeAnim = useRef(new Animated.Value(0)).current;

 // --- Estados dos Modais ---
 const [menuVisible, setMenuVisible] = useState(false);
 const [statsVisible, setStatsVisible] = useState(false);
 const [notifVisible, setNotifVisible] = useState(false);
 const [actionVisible, setActionVisible] = useState(false); // <--- NOVO MODAL (PIX/ADMIN)

 const fetchData = async () => {
  try {
   const [userData, feedData, statsData] = await Promise.all([
    axios.get(`${API_URL}/user/${userId}`),
    axios.get(`${API_URL}/feed/${userId}`),
    axios.get(`${API_URL}/stats/${userId}`)
   ]);

   setUser(userData.data);
   setFeed(feedData.data);

   const { receitas, despesas } = statsData.data;
   const percent = receitas > 0 ? (despesas / receitas) * 100 : 0;
   setSpendingPercent(percent);

   Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  } catch (error) {
   console.log('Erro ao buscar dados.');
  } finally {
   setRefreshing(false);
  }
 };

 useEffect(() => {
  fetchData();
 }, []);

 const onRefresh = () => {
  setRefreshing(true);
  fetchData();
 };

 return (
  <SafeAreaView style={styles.container}>

   {/* 1. TOPO FIXO */}
   <View style={styles.headerContainer}>
    <DashboardHeader
     userName={userName}
     onMenuPress={() => setMenuVisible(true)}
     onNotificationPress={() => setNotifVisible(true)}
    />

    <BalanceSummary
     saldo={user?.saldo || 0}
     score={user?.score_credito || 0}
     spendingPercent={spendingPercent}
    />

    <ServicesGrid
     onOpenCards={onNavigateToCards}
     onOpenInsurance={onNavigateToInsurance}
     onOpenLoans={onNavigateToLoans}
    />

    <TouchableOpacity style={styles.centralBtn} onPress={() => setStatsVisible(true)}>
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <PieChart color="#000" size={20} />
      <Text style={styles.centralText}>ABRIR CENTRAL DE GASTOS</Text>
     </View>
     <ArrowRight color="#000" size={20} />
    </TouchableOpacity>
   </View>

   {/* 2. LISTA DE TRANSAÇÕES */}
   <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    <FlatList
     data={feed}
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => item.type === 'TRANSACTION' ? <TransactionCard item={item} /> : null}
     contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
     showsVerticalScrollIndicator={false}
     refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
     }
    />
   </Animated.View>

   {/* 3. BOTÃO FLUTUANTE (FAB) - Abre o Hub de Ações */}
   <TouchableOpacity
    style={styles.fab}
    activeOpacity={0.8}
    onPress={() => setActionVisible(true)} // <--- AQUI ABRE O MODAL NOVO
   >
    <Banknote color="#000" size={28} />
   </TouchableOpacity>

   {/* --- MODAIS --- */}

   {/* Menu Lateral (Logout) */}
   <MenuModal
    visible={menuVisible}
    onClose={() => setMenuVisible(false)}
    onLogout={onLogout}
   />

   {/* Central de Gastos */}
   <StatsModal
    visible={statsVisible}
    onClose={() => setStatsVisible(false)}
    userId={userId}
   />

   {/* Notificações */}
   <NotificationsModal
    visible={notifVisible}
    onClose={() => setNotifVisible(false)}
    userId={userId}
   />

   {/* Hub de Ações (PIX / Admin) */}
   <ActionModal
    visible={actionVisible}
    onClose={() => setActionVisible(false)}
    userId={userId}
    onSuccess={onRefresh} // Recarrega os dados ao fazer um Pix
   />

  </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#09090B' },
 headerContainer: {
  padding: 24,
  paddingTop: 50,
  backgroundColor: '#09090B',
  borderBottomWidth: 1,
  borderColor: '#27272A'
 },
 centralBtn: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FCD34D',
  padding: 16,
  borderRadius: 16
 },
 centralText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
 fab: {
  position: 'absolute', bottom: 30, right: 24, width: 64, height: 64,
  borderRadius: 32, backgroundColor: '#10B981',
  justifyContent: 'center', alignItems: 'center', elevation: 10
 },
});
