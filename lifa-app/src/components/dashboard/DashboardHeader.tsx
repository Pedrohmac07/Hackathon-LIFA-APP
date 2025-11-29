import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Bell } from 'lucide-react-native';

interface Props {
 userName: string;
 onMenuPress: () => void;
 onNotificationPress: () => void;
}

export const DashboardHeader = ({ userName, onMenuPress, onNotificationPress }: Props) => {
 return (
  <View style={styles.topRow}>
   <TouchableOpacity style={styles.iconBtn} onPress={onMenuPress}>
    <Menu color="#fff" size={24} />
   </TouchableOpacity>

   <View style={styles.badge}>
    <Text style={styles.user}>Olá, {userName.split(' ')[0]}</Text>
   </View>

   <TouchableOpacity style={styles.iconBtn} onPress={onNotificationPress}>
    <Bell color="#fff" size={24} />
    <View style={styles.dot} />
   </TouchableOpacity>
  </View>
 );
};

const styles = StyleSheet.create({
 topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
 iconBtn: { padding: 10, backgroundColor: '#18181B', borderRadius: 14 },
 badge: { backgroundColor: '#18181B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
 user: { color: '#fff', fontWeight: 'bold' },
 dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
});
