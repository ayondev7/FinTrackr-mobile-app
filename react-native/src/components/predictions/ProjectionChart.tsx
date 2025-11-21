import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';

interface Projection {
  month: string;
  shortMonth: string;
  balance: number;
}

interface ProjectionChartProps {
  projections: Projection[];
  currentBalance: number;
  chartConfig: any;
  screenWidth: number;
}

export const ProjectionChart = ({ projections, currentBalance, chartConfig, screenWidth }: ProjectionChartProps) => {
  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        6-Month Balance Projection
      </Text>
      <LineChart
        data={{
          labels: ['Now', ...projections.map(p => p.shortMonth)],
          datasets: [{
            data: [currentBalance, ...projections.map(p => p.balance)],
          }],
        }}
        width={screenWidth - 80}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 16,
        }}
        yAxisLabel="$"
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
      />
    </Card>
  );
};
