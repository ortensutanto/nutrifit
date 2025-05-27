import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.brandCentered}>NutriFit</Text>
        </View>
        <Feather name="bell" size={22} color="#000" style={styles.bellIcon} />
      </View>

      {/* Calories Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calories</Text>
        <Text style={styles.cardSubtitle}>Remaining = Goal - Food + Exercise</Text>
        <View style={styles.calorieContent}>
          {/* Fake circular chart */}
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieValue}>1,550</Text>
            <Text style={styles.calorieLabel}>Remaining</Text>
          </View>
          <View style={styles.calorieBreakdown}>
            <Text style={styles.breakdownText}>🎯 Base Goal 1,550</Text>
            <Text style={styles.breakdownText}>🍽️ Food 989</Text>
            <Text style={styles.breakdownText}>🔥 Exercise 215</Text>
          </View>
        </View>
      </View>

      {/* Weight Card */}
      <View style={styles.card}>
        <View style={styles.weightRow}>
          <Text style={styles.weightText}>80 kg <Text style={styles.weightGoal}>Goal: 70kg</Text></Text>
          <Feather name="edit-2" size={18} />
        </View>
        <Text style={styles.label}>Kalori/day:</Text>
      </View>

      {/* Water & Steps */}
      <View style={styles.bottomRow}>
        <View style={styles.metricBox}>
          <MaterialCommunityIcons name="cup-water" size={40} color="#009EFF" />
          <TouchableOpacity style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.metricValue}>0.5 L</Text>
          <Text style={styles.metricLabel}>Daily Water Intake</Text>
          <Text style={styles.subLabel}>Recommended: 2L</Text>
        </View>

        <View style={styles.metricBox}>
          <Ionicons name="walk" size={40} color="#F49A00" />
          <TouchableOpacity style={styles.syncIcon}>
            <Feather name="refresh-cw" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.metricValue}>7,550</Text>
          <Text style={styles.metricLabel}>Steps Walked</Text>
          <Text style={styles.subLabel}>Goal: 10000</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(236, 250, 216, 1)',
    padding: 16,
    paddingTop: 40,
  },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 20,
  //   alignItems: 'center',
  // },
  // welcomeText: {
  //   fontSize: 14,
  //   color: '#000',
  // },
  // brand: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: 'green',
  // },
  headerContainer: {
    position: 'relative',
    marginBottom: 20,
    height: 40,
    justifyContent: 'center',
  },

  welcomeText: {
    fontSize: 14,
    color: '#000',
    position: 'absolute',
    left: 0,
  },

  brandCentered: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },

  bellIcon: {
    position: 'absolute',
    right: 0,
  },

  card: {
    backgroundColor: '#c6f7b6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  calorieContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieCircle: {
    backgroundColor: '#fff',
    borderRadius: 60,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#666',
  },
  calorieBreakdown: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  breakdownText: {
    fontSize: 13,
    marginVertical: 2,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightText: {
    fontSize: 18,
    fontWeight: '600',
  },
  weightGoal: {
    color: '#aaa',
    fontSize: 14,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  plusButton: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#009EFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  syncIcon: {
    position: 'absolute',
    top: 4,
    right: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
