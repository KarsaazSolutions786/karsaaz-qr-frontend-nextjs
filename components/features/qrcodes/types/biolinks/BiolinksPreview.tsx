'use client';

import React, { type JSX } from 'react';
import {
  BiolinkBlock,
  BlockType,
  ProfileSettings,
  ThemeSettings,
  LinkBlock,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  EmailBlock,
  PhoneBlock,
} from '@/types/entities/biolinks';

interface BiolinksPreviewProps {
  profile: ProfileSettings;
  blocks: BiolinkBlock[];
  theme: ThemeSettings;
}

export function BiolinksPreview({ profile, blocks, theme }: BiolinksPreviewProps) {
  const visibleBlocks = blocks.filter((block) => block.visible).sort((a, b) => a.order - b.order);

  const getBackgroundStyle = () => {
    if (theme.backgroundGradient) {
      const { type: _type, colors, angle } = theme.backgroundGradient;
      return {
        background: `linear-gradient(${angle || 135}deg, ${colors.join(', ')})`,
      };
    }
    if (theme.backgroundImage) {
      return {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: theme.backgroundBlur ? `blur(${theme.backgroundBlur}px)` : undefined,
      };
    }
    return {
      backgroundColor: theme.backgroundColor || '#ffffff',
    };
  };

  const getButtonStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: theme.buttonColor || '#3b82f6',
      color: theme.buttonTextColor || '#ffffff',
      borderWidth: theme.buttonBorderWidth || 0,
      borderColor: theme.buttonBorderColor,
      borderRadius:
        theme.buttonStyle === 'pill'
          ? '9999px'
          : theme.buttonStyle === 'square'
          ? '0px'
          : `${theme.borderRadius || 12}px`,
      boxShadow: theme.buttonShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
    };
    return baseStyle;
  };

  const renderBlock = (block: BiolinkBlock) => {
    switch (block.type) {
      case BlockType.LINK:
        const linkBlock = block as LinkBlock;
        return (
          <a
            href={linkBlock.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-4 text-center font-medium transition-transform hover:scale-105"
            style={getButtonStyle()}
          >
            {linkBlock.icon && <span className="mr-2">{linkBlock.icon}</span>}
            {linkBlock.title}
          </a>
        );

      case BlockType.TEXT:
        const textBlock = block as TextBlock;
        return (
          <div
            className="px-4 py-2"
            style={{
              textAlign: textBlock.alignment || 'center',
              color: theme.textColor,
            }}
          >
            {textBlock.content}
          </div>
        );

      case BlockType.HEADING:
        const headingBlock = block as HeadingBlock;
        const HeadingTag = `h${headingBlock.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            className="font-bold text-center"
            style={{
              color: theme.primaryColor || theme.textColor,
              fontSize: `${2.5 - headingBlock.level * 0.3}rem`,
            }}
          >
            {headingBlock.text}
          </HeadingTag>
        );

      case BlockType.IMAGE:
        const imageBlock = block as ImageBlock;
        const ImageWrapper = imageBlock.link ? 'a' : 'div';
        const imageProps = imageBlock.link
          ? { href: imageBlock.link, target: '_blank', rel: 'noopener noreferrer' }
          : {};
        return (
          <ImageWrapper {...imageProps} className="block">
            <img
              src={imageBlock.url}
              alt={imageBlock.alt || ''}
              className="w-full h-auto rounded-lg"
              style={{ borderRadius: `${theme.borderRadius || 12}px` }}
            />
            {imageBlock.caption && (
              <p className="text-sm text-center mt-2" style={{ color: theme.textColor }}>
                {imageBlock.caption}
              </p>
            )}
          </ImageWrapper>
        );

      case BlockType.EMAIL:
        const emailBlock = block as EmailBlock;
        const emailHref = `mailto:${emailBlock.email}${
          emailBlock.subject ? `?subject=${encodeURIComponent(emailBlock.subject)}` : ''
        }`;
        return (
          <a
            href={emailHref}
            className="block w-full px-6 py-4 text-center font-medium transition-transform hover:scale-105"
            style={getButtonStyle()}
          >
            ✉️ {emailBlock.buttonText || 'Send Email'}
          </a>
        );

      case BlockType.PHONE:
        const phoneBlock = block as PhoneBlock;
        return (
          <div className="flex gap-2">
            <a
              href={`tel:${phoneBlock.phone}`}
              className="flex-1 px-6 py-4 text-center font-medium transition-transform hover:scale-105"
              style={getButtonStyle()}
            >
              📞 {phoneBlock.buttonText || 'Call Now'}
            </a>
            {phoneBlock.showWhatsApp && (
              <a
                href={`https://wa.me/${phoneBlock.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 text-center font-medium transition-transform hover:scale-105"
                style={{ ...getButtonStyle(), backgroundColor: '#25D366' }}
              >
                WhatsApp
              </a>
            )}
          </div>
        );

      case BlockType.DIVIDER:
        return (
          <hr
            className="my-4"
            style={{
              borderStyle: (block as any).style || 'solid',
              borderColor: (block as any).color || theme.textColor,
              opacity: 0.3,
            }}
          />
        );

      default:
        return (
          <div className="text-center text-gray-500 text-sm">
            Preview for {block.type} coming soon
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-white text-center py-2 text-sm font-medium">
        📱 Live Preview
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto" style={{ maxWidth: `${theme.maxWidth || 680}px` }}>
          <div
            className="min-h-full rounded-lg shadow-xl overflow-hidden"
            style={{
              ...getBackgroundStyle(),
              fontFamily: theme.fontFamily || 'Inter, sans-serif',
            }}
          >
            <div style={{ padding: `${theme.padding || 24}px` }}>
              {/* Profile Section */}
              {profile.showAvatar && profile.avatar && (
                <div className="flex justify-center mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              )}

              {profile.name && (
                <h1
                  className="text-2xl font-bold text-center mb-2"
                  style={{ color: theme.primaryColor || theme.textColor }}
                >
                  {profile.name}
                </h1>
              )}

              {profile.showBio && profile.bio && (
                <p
                  className="text-center mb-6 opacity-80"
                  style={{ color: theme.textColor }}
                >
                  {profile.bio}
                </p>
              )}

              {/* Blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${theme.spacing || 16}px` }}>
                {visibleBlocks.length > 0 ? (
                  visibleBlocks.map((block) => (
                    <div key={block.id} className={theme.enableAnimations ? 'animate-fade-in' : ''}>
                      {renderBlock(block)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-50">
                    <div className="text-4xl mb-2">📱</div>
                    <p style={{ color: theme.textColor }}>Add blocks to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
