/**
 * Blocks Index
 * Export all block components for easy imports
 */

// Basic Blocks
export { default as LinkBlock } from './LinkBlock';
export { default as TextBlock } from './TextBlock';
export { default as ImageBlock } from './ImageBlock';

// Content Blocks
export { default as TitleBlock } from './TitleBlock';
export { default as ParagraphBlock } from './ParagraphBlock';
export { default as ListBlock } from './ListBlock';
export { default as TableBlock } from './TableBlock';
export { default as FAQBlock } from './FAQBlock';
export { default as DividerBlock } from './DividerBlock';

// Media Blocks
export { default as VideoBlock } from './VideoBlock';
export { default as ImageGridBlock } from './ImageGridBlock';

// Social Blocks
export { default as SocialLinksBlock } from './SocialLinksBlock';
export { default as ShareBlock } from './ShareBlock';

// Business Blocks
export { default as BusinessHoursBlock } from './BusinessHoursBlock';
export { default as ContactBlock } from './ContactBlock';
export { default as ProfileBlock } from './ProfileBlock';
export { default as ServicesBlock } from './ServicesBlock';

// Advanced Blocks
export { default as CustomCodeBlock } from './CustomCodeBlock';

// Demo and Example Components
export { default as CustomCodeBlockExamples } from './CustomCodeBlock.demo';

// Re-export types
export type { Block, BlockContent, BlockConfig } from '../types';
