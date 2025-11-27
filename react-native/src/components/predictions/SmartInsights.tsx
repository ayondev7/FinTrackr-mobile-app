import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react-native';
import { Card } from '../shared/Card';

interface SmartInsightsProps {
  recommendations: string[];
  isPositive: boolean;
}

const getInsightStyle = (recommendation: string, isPositive: boolean) => {
  const lower = recommendation.toLowerCase();
  if (lower.includes('warning') || lower.includes('urgent') || lower.includes('exceed')) {
    return { bg: 'bg-red-50 dark:bg-red-900/20', icon: AlertCircle, color: '#EF4444' };
  }
  if (lower.includes('great') || lower.includes('good') || lower.includes('positive')) {
    return { bg: 'bg-green-50 dark:bg-green-900/20', icon: CheckCircle, color: '#10B981' };
  }
  if (lower.includes('consider') || lower.includes('aim') || lower.includes('build')) {
    return { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Lightbulb, color: '#3B82F6' };
  }
  if (lower.includes('invest') || lower.includes('increase')) {
    return { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: TrendingUp, color: '#A855F7' };
  }
  return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: AlertCircle, color: '#F59E0B' };
};

export const SmartInsights = ({ recommendations, isPositive }: SmartInsightsProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mb-6" variant="elevated">
      <Text className="text-gray-900 dark:text-white text-lg font-bold mb-4">
        💡 Smart Insights
      </Text>
      <View className="gap-3">
        {recommendations.map((recommendation, index) => {
          const style = getInsightStyle(recommendation, isPositive);
          const IconComponent = style.icon;
          return (
            <View key={index} className={`flex-row gap-3 p-3 ${style.bg} rounded-xl`}>
              <IconComponent size={20} color={style.color} />
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                {recommendation}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};
