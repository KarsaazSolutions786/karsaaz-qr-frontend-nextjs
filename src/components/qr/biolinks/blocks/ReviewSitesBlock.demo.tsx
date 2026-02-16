import ReviewSitesBlock from './ReviewSitesBlock';
import { Block } from '../types';

// Demo block with sample review platform data
const demoBlock: Block = {
  id: 'review_demo_001',
  type: 'review-sites',
  title: 'Review Sites Block Demo',
  content: {
    platforms: [
      {
        id: 'google',
        name: 'Google',
        rating: 4.8,
        reviewCount: 1247,
        url: 'https://g.page/your-business',
        reviewUrl: 'https://search.google.com/local/writereview',
        icon: null,
        color: '#4285F4',
        verified: true,
        lastUpdated: '2024-01-15'
      },
      {
        id: 'yelp',
        name: 'Yelp',
        rating: 4.5,
        reviewCount: 892,
        url: 'https://www.yelp.com/biz/your-business',
        reviewUrl: 'https://www.yelp.com/writeareview',
        icon: null,
        color: '#FF1A1A',
        verified: true,
        lastUpdated: '2024-01-14'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        rating: 4.9,
        reviewCount: 623,
        url: 'https://www.facebook.com/yourbusiness',
        reviewUrl: 'https://www.facebook.com/yourbusiness/reviews',
        icon: null,
        color: '#1877F2',
        verified: true,
        lastUpdated: '2024-01-13'
      }
    ],
    showAverageRating: true,
    showPlatformIcons: true,
    showReviewCount: true,
    showTrustIndicators: true,
    enableReviewCollection: true,
    collectionTitle: 'Share Your Experience',
    collectionSubtitle: 'Your feedback helps us improve and helps others make informed decisions.',
    customReviewUrl: '',
    headerAlignment: 'center',
    columns: 3,
    style: 'cards'
  },
  settings: {
    visible: true,
    order: 0,
    customClasses: [],
    padding: '1rem',
    margin: '0.5rem 0'
  },
  design: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '12px',
    padding: '1.5rem',
    margin: '0.5rem 0'
  }
};

// Simple demo component
export function ReviewSitesBlockDemo() {
  const handleUpdate = (updates: Partial<Block>) => {
    console.log('Block updated:', updates);
  };

  const handleDelete = () => {
    console.log('Block deleted');
  };

  return (
    <div className="space-y-8">
      {/* Public View Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Public View</h2>
        <div className="border rounded-lg p-4">
          <ReviewSitesBlock
            block={demoBlock}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isEditing={false}
          />
        </div>
      </section>

      {/* Edit View Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Edit View</h2>
        <div className="border rounded-lg p-4">
          <ReviewSitesBlock
            block={demoBlock}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isEditing={true}
          />
        </div>
      </section>
    </div>
  );
}

// Export default demo data
export const reviewSitesDemoData = {
  platforms: [
    {
      id: 'google',
      name: 'Google',
      rating: 4.8,
      reviewCount: 1247,
      url: 'https://g.page/your-business',
      reviewUrl: 'https://search.google.com/local/writereview',
      verified: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'yelp',
      name: 'Yelp',
      rating: 4.5,
      reviewCount: 892,
      url: 'https://www.yelp.com/biz/your-business',
      reviewUrl: 'https://www.yelp.com/writeareview',
      verified: true,
      lastUpdated: '2024-01-14'
    },
    {
      id: 'tripadvisor',
      name: 'TripAdvisor',
      rating: 4.7,
      reviewCount: 534,
      url: 'https://www.tripadvisor.com/your-business',
      reviewUrl: 'https://www.tripadvisor.com/UserReview',
      verified: true,
      lastUpdated: '2024-01-13'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      rating: 4.9,
      reviewCount: 623,
      url: 'https://www.facebook.com/yourbusiness',
      reviewUrl: 'https://www.facebook.com/yourbusiness/reviews',
      verified: true,
      lastUpdated: '2024-01-13'
    }
  ],
  showAverageRating: true,
  showTrustIndicators: true,
  enableReviewCollection: true,
  collectionTitle: 'Share Your Experience',
  collectionSubtitle: 'Your feedback helps us improve and helps others make informed decisions.',
  columns: 3,
  style: 'cards'
};

export default ReviewSitesBlockDemo;
