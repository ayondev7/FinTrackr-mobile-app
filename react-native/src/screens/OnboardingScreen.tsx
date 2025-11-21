import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Take Control Of\nYour Finances',
    description: 'Track every penny with ease. Monitor all your expenses and income in one beautifully designed app.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=500&fit=crop',
    bgColor: '#F8F5FF',
    icon: '💰',
  },
  {
    id: '2',
    title: 'Visualize Your\nSpending Patterns',
    description: 'Get powerful insights with beautiful charts and analytics. See exactly where your money goes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop',
    bgColor: '#FFF5F0',
    icon: '📊',
  },
  {
    id: '3',
    title: 'Smart Budget\nManagement',
    description: 'Set monthly budgets for categories and get alerts when approaching limits. Stay on track effortlessly.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&h=500&fit=crop',
    bgColor: '#F0F9FF',
    icon: '🎯',
  },
  {
    id: '4',
    title: 'Plan Ahead With\nSmart Predictions',
    description: 'AI-powered predictions help you understand your financial future and achieve your goals faster.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop',
    bgColor: '#F0FFF4',
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

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.imageContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{item.icon}</Text>
          </View>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bottomFade} />
      </View>
    </View>
  );

  const Paginator = () => (
    <View style={styles.paginatorContainer}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.slideContainer}>
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

      <View style={styles.footer}>
        <Paginator />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleFinish}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={scrollTo}
            style={styles.nextButton}
          >
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    flex: 3,
  },
  slide: {
    width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  textContainer: {
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 44,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.85,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  iconCircle: {
    position: 'absolute',
    bottom: -25,
    right: 30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  iconEmoji: {
    fontSize: 45,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  paginatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 50,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
