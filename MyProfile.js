import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MyProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar} />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johndoe@example.com</Text>
      </View>
      
      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="person-outline" size={24} color="black" />
          <Text style={styles.infoText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="lock-closed-outline" size={24} color="black" />
          <Text style={styles.infoText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="notifications-outline" size={24} color="black" />
          <Text style={styles.infoText}>Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Icon name="settings-outline" size={24} color="black" />
          <Text style={styles.infoText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
