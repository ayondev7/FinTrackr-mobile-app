import React, { useRef, useState } from 'react';
import { View, Dimensions, FlatList, Animated } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingSlide, Paginator, OnboardingFooter } from '../components/onboarding';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
  bgColor: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Take Control Of\nYour Finances',
    description: 'Track every penny with ease. Monitor all your expenses and income in one beautifully designed app.',
    image: require('../../assets/1.webp'),
    bgColor: '#E8F4F8',
    icon: '💰',
  },
  {
    id: '2',
    title: 'Visualize Your\nSpending Patterns',
    description: 'Get powerful insights with beautiful charts and analytics. See exactly where your money goes.',
    image: require('../../assets/2.webp'),
    bgColor: '#E8F4F8',
    icon: '📊',
  },
  {
    id: '3',
    title: 'Smart Budget\nManagement',
    description: 'Set monthly budgets for categories and get alerts when approaching limits. Stay on track effortlessly.',
    image: require('../../assets/3.webp'),
    bgColor: '#E8F4F8',
    icon: '🎯',
  },
  {
    id: '4',
    title: 'Plan Ahead With\nSmart Predictions',
    description: 'AI-powered predictions help you understand your financial future and achieve your goals faster.',
    image: require('../../assets/4.webp'),
    bgColor: '#E8F4F8',
    icon: '🔮',
  },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { setHasSeenOnboarding } = useOnboardingStore();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setHasSeenOnboarding(true);
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={{ width, flex: 1, backgroundColor: item.bgColor }}>
      <OnboardingSlide
        title={item.title}
        description={item.description}
        image={item.image}
        bgColor={item.bgColor}
      >
        <View className="px-8 mt-12">
          <Paginator data={slides} scrollX={scrollX} />
          <OnboardingFooter
            currentIndex={currentIndex}
            totalSlides={slides.length}
            onSkip={handleFinish}
            onNext={scrollTo}
          />
        </View>
      </OnboardingSlide>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
      />
    </View>
  );
};
