import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../shared/Card';
import { MonthlyOverviewItem, AnalyticsType } from '../../types';

interface MonthlyOverviewChartProps {
  screenWidth: number;
  analyticsType: AnalyticsType;
  chartConfig: any;
  monthlyData: MonthlyOverviewItem[];
}

const formatCompactNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return Math.round(value).toString();
};

export const MonthlyOverviewChart: React.FC<MonthlyOverviewChartProps> = ({
  screenWidth,
  analyticsType,
  chartConfig,
  monthlyData,
}) => {
  const getChartColor = (opacity: number = 1) => {
    // Mix the base color with white by 50% to make it lighter
    const mixWithWhite = (rgb: [number, number, number], factor = 0.5) => {
      return rgb.map((c) => Math.round(c + (255 - c) * factor)) as [number, number, number];
    };

    if (analyticsType === 'revenue') {
      const base: [number, number, number] = [16, 185, 129];
      const [r, g, b] = mixWithWhite(base, 0.5);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    if (analyticsType === 'expense') {
      const base: [number, number, number] = [239, 68, 68];
      const [r, g, b] = mixWithWhite(base, 0.5);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Fallback: try to parse chartConfig.color(opacity) if it returns an rgb/rgba string,
    // otherwise return it as-is.
    try {
      const colorStr = chartConfig?.color ? chartConfig.color(opacity) : `rgba(0,0,0,${opacity})`;
      const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (m) {
        const base: [number, number, number] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const [r, g, b] = mixWithWhite(base, 0.5);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return colorStr;
    } catch (e) {
      return chartConfig.color(opacity);
    }
  };

  const getChartData = () => {
    if (analyticsType === 'expense') {
      return monthlyData.map(item => item.expense);
    }
    if (analyticsType === 'revenue') {
      return monthlyData.map(item => item.revenue);
    }
    return monthlyData.map(item => item.expense + item.revenue);
  };

  const labels = monthlyData.map(item => item.monthName.substring(0, 3));
  const data = getChartData();

  const hasData = data.some(value => value > 0);

  return (
    <Card className="mb-6 p-4">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        Monthly {analyticsType === 'expense' ? 'Expenses' : analyticsType === 'revenue' ? 'Revenue' : 'Overview'}
      </Text>
      {hasData ? (
        (() => {
          // Determine scale for compact display when values get large
          const visibleValues = data.slice(-6).map((v) => v || 0);
          const maxValue = Math.max(...visibleValues, 0);
          let scale = 1;
          let suffix = '';
          let decimals = 0;

          if (maxValue >= 1000000) {
            scale = 1000000;
            suffix = 'M';
            decimals = 1;
          } else if (maxValue >= 10000) {
            scale = 1000;
            suffix = 'k';
            decimals = 1;
          }

          const scaledValues = visibleValues.map((v) => {
            const scaled = v / scale;
            return Number(scaled.toFixed(decimals));
          });

          return (
            <BarChart
              data={{
                labels: labels.slice(-6),
                datasets: [{
                  data: scaledValues,
                }],
              }}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                ...chartConfig,
                decimalPlaces: decimals,
                fillShadowGradientFrom: getChartColor(0.5),
                fillShadowGradientTo: getChartColor(0.5),
                fillShadowGradientFromOpacity: 1,
                fillShadowGradientToOpacity: 1,
                color: () => getChartColor(0.5),
                propsForBackgroundLines: {
                  strokeWidth: 0,
                },
              }}
              style={{
                borderRadius: 16,
              }}
              yAxisLabel=""
              yAxisSuffix={suffix}
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
            />
          );
        })()
      ) : (
        <View className="h-[220] items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        </View>
      )}
    </Card>
  );
};
