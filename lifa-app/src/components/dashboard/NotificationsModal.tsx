import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { formatDate } from '../../utils/formatters';

interface Props {
 visible: boolean;
 onClose: () => void;
 userId: number;
}

export const NotificationsModal = ({ visible, onClose, userId }: Props) => {
 const [notifications, setNotifications] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (visible) {
   setLoading(true);
   axios.get(`${API_URL}/notifications/${userId}`)
    .then(res => setNotifications(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }
 }, [visible]);

 const getIcon = (type: string) => {
  switch (type) {
   case 'success': return <CheckCircle color="#10B981" size={20} />;
   case 'warning': return <AlertTriangle color="#F59E0B" size={20} />;
   default: return <Info color="#3B82F6" size={20} />;
  }
 };

 return (
  <Modal visible={visible} transparent animationType="fade">
   <View style={styles.overlay}>
    <View style={styles.container}>

     <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
       <Bell color="#fff" size={20} />
       <Text style={styles.title}>Notificações</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
       <X color="#A1A1AA" size={20} />
      </TouchableOpacity>
     </View>

     {loading ? (
      <ActivityIndicator color="#7C3AED" style={{ margin: 20 }} />
     ) : (
      <FlatList
       data={notifications}
       keyExtractor={(item) => item.id.toString()}
       contentContainerStyle={{ padding: 16 }}
       ListEmptyComponent={<Text style={styles.empty}>Sem notificações novas.</Text>}
       renderItem={({ item }) => (
        <View style={styles.item}>
         <View style={styles.iconCol}>{getIcon(item.type)}</View>
         <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemMsg}>{item.message}</Text>
          <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
         </View>
         {!item.is_read && <View style={styles.dot} />}
        </View>
       )}
      />
     )}
    </View>
   </View>
  </Modal>
 );
};

const styles = StyleSheet.create({
 overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
 container: { height: '60%', backgroundColor: '#18181B', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
 header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#27272A' },
 title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
 closeBtn: { padding: 5 },
 empty: { color: '#71717A', textAlign: 'center', marginTop: 20 },

 item: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#27272A' },
 iconCol: { marginRight: 12, marginTop: 2 },
 itemTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
 itemMsg: { color: '#A1A1AA', fontSize: 13, lineHeight: 18 },
 itemDate: { color: '#52525B', fontSize: 11, marginTop: 6 },
 dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', marginLeft: 10, marginTop: 6 }
});
