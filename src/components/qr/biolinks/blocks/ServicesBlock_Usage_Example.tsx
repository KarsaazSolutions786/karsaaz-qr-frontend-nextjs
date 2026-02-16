import ServicesBlock from './ServicesBlock';
import { Block } from '../types';
import { useState } from 'react';

/**
 * ServicesBlock Usage Examples
 * Demonstrates various configurations and use cases
 */

// Example 1: Digital Agency Services
export const ExampleDigitalAgency = () => {
  const [block, setBlock] = useState<Block>({
    id: 'services-agency-1',
    type: 'services',
    title: 'Digital Agency Services',
    subtitle: 'Comprehensive digital solutions',
    content: {
      title: 'Our Services',
      description: 'We help businesses grow with modern digital solutions',
      services: [
        {
          id: '1',
          title: 'Website Development',
          description: 'Custom websites built with cutting-edge technologies. Responsive design, SEO optimized, and blazing fast performance.',
          price: '$5,000',
          duration: '4-6 weeks',
          category: 'Development',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
          icon: '🚀',
          featured: true,
          rating: 4.9,
          reviewCount: 156,
          bookingUrl: 'https://calendly.com/consultation',
          tags: ['React', 'Next.js', 'Full-stack', 'SEO']
        },
        {
          id: '2',
          title: 'UI/UX Design',
          description: 'Beautiful, intuitive interfaces that users love. From wireframes to polished designs.',
          price: '$3,500',
          duration: '2-3 weeks',
          category: 'Design',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
          icon: '🎨',
          rating: 4.8,
          reviewCount: 89,
          bookingUrl: 'https://calendly.com/design-consultation',
          tags: ['Figma', 'Prototyping', 'User Research']
        },
        {
          id: '3',
          title: 'Digital Marketing',
          description: 'Data-driven marketing strategies to grow your online presence and generate leads.',
          price: '$2,500/month',
          duration: 'Ongoing',
          category: 'Marketing',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          icon: '📈',
          rating: 4.7,
          reviewCount: 203,
          bookingUrl: 'https://calendly.com/marketing-strategy',
          tags: ['SEO', 'PPC', 'Social Media', 'Analytics']
        },
        {
          id: '4',
          title: 'Mobile App Development',
          description: 'Native and cross-platform mobile applications for iOS and Android.',
          price: '$8,000',
          duration: '8-12 weeks',
          category: 'Development',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
          icon: '📱',
          rating: 4.6,
          reviewCount: 67,
          bookingUrl: 'https://calendly.com/app-consultation',
          tags: ['iOS', 'Android', 'React Native']
        },
        {
          id: '5',
          title: 'Brand Identity',
          description: 'Complete brand identity packages including logo, colors, typography, and guidelines.',
          price: '$4,500',
          duration: '3-4 weeks',
          category: 'Design',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
          icon: '🎯',
          featured: true,
          rating: 5.0,
          reviewCount: 42,
          bookingUrl: 'https://calendly.com/branding',
          tags: ['Logo', 'Branding', 'Guidelines']
        },
        {
          id: '6',
          title: 'E-commerce Solutions',
          description: 'Complete online stores with payment integration, inventory management, and analytics.',
          price: '$7,500',
          duration: '6-8 weeks',
          category: 'Development',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          icon: '🛒',
          rating: 4.5,
          reviewCount: 78,
          bookingUrl: 'https://calendly.com/ecommerce',
          tags: ['Shopify', 'WooCommerce', 'Payments', 'Analytics']
        }
      ],
      categories: ['Development', 'Design', 'Marketing'],
      showSearch: true,
      showFilters: true,
      showRatings: true,
      enableBooking: true,
      featuredBadgeText: 'Premium',
      popularBadgeText: 'Top Rated',
      columns: 3
    },
    settings: {
      visible: true,
      order: 1,
      customClasses: [],
      padding: '2rem',
      margin: '1rem'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '12px',
      padding: '2rem',
      margin: '1rem'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ServicesBlock
        block={block}
        onUpdate={handleUpdate}
        onDelete={() => console.log('Delete block')}
        isEditing={true}
      />
    </div>
  );
};

// Example 2: Fitness & Wellness Services
export const ExampleFitnessStudio = () => {
  const [block, setBlock] = useState<Block>({
    id: 'services-fitness-1',
    type: 'services',
    title: 'Fitness Services',
    content: {
      title: 'Classes & Personal Training',
      description: 'Transform your body and mind with our expert trainers',
      services: [
        {
          id: '1',
          title: 'Personal Training',
          description: 'One-on-one training sessions tailored to your fitness goals.',
          price: '$120/session',
          duration: '1 hour',
          category: 'Personal Training',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          icon: '💪',
          featured: true,
          rating: 5.0,
          reviewCount: 234,
          bookingUrl: 'https://trainerize.me/schedule',
          tags: ['Strength', 'Weight Loss', 'Custom Plan']
        },
        {
          id: '2',
          title: 'Yoga Classes',
          description: 'Vinyasa flow yoga for all levels. Improve flexibility and mindfulness.',
          price: '$25/class',
          duration: '75 minutes',
          category: 'Group Classes',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
          icon: '🧘',
          rating: 4.9,
          reviewCount: 156,
          bookingUrl: 'https://mindbody.io/yoga',
          tags: ['All Levels', 'Meditation', 'Flexibility']
        },
        {
          id: '3',
          title: 'HIIT Training',
          description: 'High-intensity interval training for maximum calorie burn.',
          price: '$35/class',
          duration: '45 minutes',
          category: 'Group Classes',
          image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
          icon: '🔥',
          popular: true,
          rating: 4.8,
          reviewCount: 89,
          bookingUrl: 'https://mindbody.io/hiit',
          tags: ['Fat Burn', 'Cardio', 'Intensity']
        },
        {
          id: '4',
          title: 'Nutrition Coaching',
          description: 'Personalized nutrition plans and ongoing coaching support.',
          price: '$200/month',
          duration: 'Monthly program',
          category: 'Coaching',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
          icon: '🥗',
          rating: 4.7,
          reviewCount: 67,
          bookingUrl: 'https://nutrition-coach.app',
          tags: ['Meal Plans', 'Macros', 'Accountability']
        },
        {
          id: '5',
          title: 'Pilates Classes',
          description: 'Core strengthening and postural alignment through controlled movements.',
          price: '$30/class',
          duration: '60 minutes',
          category: 'Group Classes',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
          icon: '🤸',
          rating: 4.6,
          reviewCount: 45,
          bookingUrl: 'https://mindbody.io/pilates',
          tags: ['Core', 'Posture', 'Strength']
        },
        {
          id: '6',
          title: 'Meditation Workshop',
          description: 'Learn mindfulness and meditation techniques for stress reduction.',
          price: '$60/workshop',
          duration: '2 hours',
          category: 'Workshops',
          image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
          icon: '🕉️',
          rating: 4.9,
          reviewCount: 38,
          bookingUrl: 'https://insight-timer.com/workshop',
          tags: ['Mindfulness', 'Stress Relief', 'Beginner Friendly']
        }
      ],
      categories: ['Personal Training', 'Group Classes', 'Coaching', 'Workshops'],
      showSearch: true,
      showFilters: true,
      showRatings: true,
      enableBooking: true,
      featuredBadgeText: 'Premium',
      popularBadgeText: 'Hot',
      columns: 3
    },
    settings: {
      visible: true,
      order: 1,
      customClasses: [],
      padding: '2rem',
      margin: '1rem'
    },
    design: {
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      borderRadius: '16px',
      padding: '2rem',
      margin: '1rem'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <ServicesBlock
        block={block}
        onUpdate={handleUpdate}
        onDelete={() => console.log('Delete block')}
        isEditing={false}
      />
    </div>
  );
};

// Example 3: Consulting Services (Minimal)
export const ExampleConsulting = () => {
  const [block, setBlock] = useState<Block>({
    id: 'services-consulting-1',
    type: 'services',
    title: 'Consulting Services',
    content: {
      title: 'Business Consulting',
      description: 'Strategic consulting to accelerate your business growth',
      services: [
        {
          id: '1',
          title: 'Strategy Consultation',
          description: '2-hour deep dive into your business challenges and opportunities.',
          price: '$500',
          duration: '2 hours',
          category: 'Strategy',
          icon: '🎯',
          featured: true,
          rating: 5.0,
          reviewCount: 42,
          bookingUrl: 'https://calendly.com/strategy',
          tags: ['Business Strategy', 'Growth Planning']
        },
        {
          id: '2',
          title: 'Market Analysis',
          description: 'Comprehensive market research and competitive analysis report.',
          price: '$1,200',
          duration: '1 week',
          category: 'Research',
          icon: '📊',
          rating: 4.8,
          reviewCount: 28,
          bookingUrl: 'https://calendly.com/market-analysis',
          tags: ['Market Research', 'Competitive Analysis']
        },
        {
          id: '3',
          title: 'Process Optimization',
          description: 'Streamline operations and improve efficiency.',
          price: '$2,500',
          duration: '2 weeks',
          category: 'Operations',
          icon: '⚡',
          rating: 4.7,
          reviewCount: 15,
          bookingUrl: 'https://calendly.com/operations',
          tags: ['Efficiency', 'Workflow', 'Automation']
        }
      ],
      categories: ['Strategy', 'Research', 'Operations'],
      showSearch: false,
      showFilters: true,
      showRatings: true,
      enableBooking: true,
      featuredBadgeText: 'Popular',
      columns: 1
    },
    settings: {
      visible: true,
      order: 1,
      customClasses: [],
      padding: '1.5rem',
      margin: '1rem'
    },
    design: {
      backgroundColor: '#ffffff',
      textColor: '#111827',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem'
    }
  });

  const handleUpdate = (updates: Partial<Block>) => {
    setBlock(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <ServicesBlock
        block={block}
        onUpdate={handleUpdate}
        isEditing={true}
      />
    </div>
  );
};

// Export all examples
export const ServicesBlockExamples = {
  ExampleDigitalAgency,
  ExampleFitnessStudio,
  ExampleConsulting
};

export default ServicesBlockExamples;