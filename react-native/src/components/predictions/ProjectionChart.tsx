import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';
import { ProjectedBalance } from '../../types';

interface ProjectionChartProps {
  projections: ProjectedBalance[];
  currentBalance: number;
  chartConfig: any;
  screenWidth: number;
}

const getShortMonth = (monthString: string): string => {
  const parts = monthString.split(' ');
  return parts[0].substring(0, 3);
};

export const ProjectionChart = ({ projections, currentBalance, chartConfig, screenWidth }: ProjectionChartProps) => {
  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        6-Month Balance Projection
      </Text>
      <LineChart
        data={{
          labels: ['Now', ...projections.map(p => getShortMonth(p.month))],
          datasets: [{
            data: [currentBalance, ...projections.map(p => p.estimatedBalance)],
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
