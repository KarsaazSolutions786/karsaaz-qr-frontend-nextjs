# Review Sites Block

A comprehensive component for displaying customer reviews from multiple platforms with ratings, review counts, and trust indicators.

## Features

- **Multiple Review Platforms**: Support for Google, Yelp, TripAdvisor, Facebook, Trustpilot, Booking.com, and custom platforms
- **Star Rating Display**: Beautiful star ratings with half-star support
- **Review Count**: Display total number of reviews per platform
- **Platform Icons**: Unique icons and colors for each platform
- **Direct Review Links**: One-click access to view or leave reviews
- **Review Collection CTA**: Encourage customers to leave reviews
- **Dual View Modes**: Edit mode for configuration, public mode for display
- **Average Rating Calculation**: Automatically calculate overall rating across all platforms
- **Responsive Design**: Works perfectly on all screen sizes
- **Trust Indicators**: Display verification badges and trust messages

## Usage

### Adding to Your Biolink Page

1. Open the Biolink Designer
2. Click "Add Block"
3. Select "Review Sites" from the Business category
4. Configure your review platforms and settings

### Basic Configuration

```typescript
const defaultData = {
  platforms: [
    {
      id: 'google',
      name: 'Google',
      rating: 4.8,
      reviewCount: 1247,
      url: 'https://g.page/your-business',
      reviewUrl: 'https://search.google.com/local/writereview',
      icon: Globe,
      color: '#4285F4',
      verified: true,
      lastUpdated: '2024-01-15'
    }
  ],
  showAverageRating: true,
  showTrustIndicators: true,
  enableReviewCollection: true,
  collectionTitle: 'Share Your Experience',
  collectionSubtitle: 'Your feedback helps us improve...',
  columns: 3,
  style: 'cards'
};
```

## Supported Platforms

| Platform | Icon | Color | Key Feature |
|----------|------|-------|-------------|
| Google | Globe | #4285F4 | Search engine reviews |
| Yelp | MapPin | #FF1A1A | Local business reviews |
| TripAdvisor | Calendar | #00AA6C | Travel reviews |
| Facebook | Facebook | #1877F2 | Social media reviews |
| Trustpilot | ShieldCheck | #00B67A | Verified reviews |
| Booking.com | Building | #003580 | Hospitality reviews |
| Custom | Globe | #6B7280 | Any custom platform |

## Editor Features

### Adding Review Platforms

1. Select platform from dropdown
2. Click "Add Platform"
3. Fill in platform details:
   - Profile URL (your business page)
   - Review URL (direct link to leave review)
   - Rating (0-5 stars)
   - Review count
   - Verification status
   - Last updated date

### Global Settings

- **Layout Style**: Cards, Compact, or List view
- **Columns**: 1, 2, 3, or 4 column layout
- **Display Options**:
  - Show/hide average rating
  - Show/hide trust indicators
  - Enable review collection CTA
- **Review Collection**:
  - Custom title and subtitle
  - Optional custom review URL
  - Responsive CTA buttons

## Public View Features

### Rating Display

Each platform card shows:
- Platform name and icon
- Star rating (supports half stars)
- Review count
- Verification badge
- Last updated date

### Average Rating Section

The block calculates and displays:
- Overall average rating (weighted by review count)
- Total review count across all platforms
- Number of active platforms
- Visual rating stars with numeric score

### Trust Indicators

Optional trust badges show:
- "Verified Reviews" with shield icon
- "Real Customers" with user icon
- "Trusted Platforms" with award icon

### Review Collection CTA

A prominent call-to-action section:
- Encourages customers to leave reviews
- Lists all platforms for easy access
- Optional custom review URL
- Gradient background for visual appeal
- Professional messaging

## Customization

### Styling

The component respects your biolink theme:
- Background colors
- Text colors
- Border radius
- Padding and margin
- Dark mode support

### Design Props

```typescript
design: {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  padding: string;
  margin: string;
}
```

## Technical Details

### Component Structure

- Main component: `ReviewSitesBlock.tsx`
- Rating display: `RatingStars` component
- Platform cards: `PlatformCard` component
- Average rating: `AverageRatingDisplay` component
- Block registry: Added to `block-registry.ts`

### Dependencies

- React 19.2.3
- lucide-react (icons)
- Tailwind CSS (styling)
- TypeScript

### TypeScript Interfaces

```typescript
interface ReviewPlatform {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  url: string;
  icon: any;
  color: string;
  reviewUrl?: string;
  lastUpdated?: string;
  verified?: boolean;
}

interface PlatformConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  reviewUrlTemplate?: string;
  placeholder: string;
}
```

## Best Practices

### Platform Setup

1. **Verify Your Business**: Ensure all platforms have verified business listings
2. **Keep Data Updated**: Regularly update ratings and review counts
3. **Use Review URLs**: Provide direct links for customers to leave reviews
4. **Respond to Reviews**: Engage with customer feedback across all platforms

### Display Recommendations

1. **Show Average Rating**: When you have 3+ platforms with good ratings
2. **Trust Indicators**: Always show for credibility
3. **Review Collection**: Enable to actively gather new reviews
4. **Column Count**: Use 3 columns for most layouts, 2 for narrower designs

### Platform Selection

Show platforms that are:
- Most relevant to your industry
- Where you have the most reviews
- Where your target audience looks for reviews
- Verified and actively managed

## Examples

### Restaurant

Platforms: Google, Yelp, Facebook, TripAdvisor
Average Rating: 4.6/5 (2,847 reviews)
Trust indicators enabled
Review collection: "Share your dining experience"

### Hotel

Platforms: Booking.com, Google, TripAdvisor
Average Rating: 4.8/5 (3,124 reviews)
3-column card layout
Custom review URL for direct bookings

### Service Business

Platforms: Google, Facebook, Trustpilot
Average Rating: 4.9/5 (567 reviews)
Trust indicators prominently displayed
Review collection with incentive mention

## Troubleshooting

### Ratings Not Displaying

- Verify rating is between 0-5
- Check review count is greater than 0
- Ensure platform has a valid URL

### Icons Not Showing

- Confirm lucide-react is installed
- Check icon imports are correct
- Verify icon color prop is valid

### Layout Issues

- Adjust column count for screen size
- Check responsive breakpoints
- Verify padding/margin settings

## Future Enhancements

- [ ] Review filtering (by date, rating, platform)
- [ ] Featured review highlights
- [ ] Review sentiment analysis
- [ ] Platform API integrations
- [ ] Automated rating updates
- [ ] Review response tracking
- [ ] Photo reviews display
- [ ] Video testimonials
- [ ] Review incentives tracking
- [ ] Multi-language support
