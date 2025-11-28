import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';

interface Props {
 visible: boolean;
 onClose: () => void;
 onLogout: () => void;
}

export const MenuModal = ({ visible, onClose, onLogout }: Props) => {
 return (
  <Modal visible={visible} transparent animationType="fade">
   <TouchableOpacity style={styles.overlay} onPress={onClose}>
    <View style={styles.box}>
     <Text style={styles.title}>Menu</Text>
     <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
      <LogOut color="#EF4444" size={20} />
      <Text style={styles.logoutText}>Sair do App</Text>
     </TouchableOpacity>
    </View>
   </TouchableOpacity>
  </Modal>
 );
};

const styles = StyleSheet.create({
 overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 40 },
 box: { backgroundColor: '#18181B', padding: 20, borderRadius: 20 },
 title: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
 logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12 },
 logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10 },
});
