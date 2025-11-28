import React from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

interface Props {
 receitas: number;
 despesas: number;
}

export const DonutChart = ({ receitas, despesas }: Props) => {
 const radius = 60;
 const strokeWidth = 20;
 const center = 75;
 const circumference = 2 * Math.PI * radius;
 const total = receitas + despesas;

 if (total === 0) {
  return (
   <View style={{ alignItems: 'center', justifyContent: 'center', height: 160 }}>
    <Svg width={150} height={150}>
     <Circle cx={center} cy={center} r={radius} stroke="#27272A" strokeWidth={strokeWidth} fill="transparent" />
    </Svg>
    <Text style={{ color: '#555', position: 'absolute' }}>Sem dados</Text>
   </View>
  );
 }

 const percentReceitas = receitas / total;
 const percentDespesas = despesas / total;
 const strokeDasharrayReceitas = `${circumference * percentReceitas} ${circumference}`;
 const strokeDasharrayDespesas = `${circumference * percentDespesas} ${circumference}`;
 const angleDespesas = -90 + (percentReceitas * 360);

 return (
  <View style={{ alignItems: 'center', justifyContent: 'center', height: 160 }}>
   <Svg width={150} height={150}>
    <G rotation="-90" origin={`${center}, ${center}`}>
     <Circle cx={center} cy={center} r={radius} stroke="#18181B" strokeWidth={strokeWidth} fill="transparent" />
     {receitas > 0 && (
      <Circle cx={center} cy={center} r={radius} stroke="#10B981" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={strokeDasharrayReceitas} strokeLinecap="round" />
     )}
    </G>
    <G rotation={angleDespesas} origin={`${center}, ${center}`}>
     {despesas > 0 && (
      <Circle cx={center} cy={center} r={radius} stroke="#EF4444" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={strokeDasharrayDespesas} strokeLinecap="round" />
     )}
    </G>
    <Circle cx={center} cy={center} r={radius - 15} fill="#09090B" />
   </Svg>
   <View style={{ position: 'absolute', alignItems: 'center' }}>
    <Text style={{ color: '#A1A1AA', fontSize: 10, fontWeight: 'bold' }}>SALDO</Text>
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
     {((receitas / (receitas + despesas)) * 100).toFixed(0)}%
    </Text>
   </View>
  </View>
 );
};
