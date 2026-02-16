import ShareBlock from './ShareBlock';
import { Block } from '../types';

// Demo: Share Block with default settings
export const DefaultShareBlock = () => {
  const block: Block = {
    id: 'share_demo_1',
    type: 'share',
    title: 'Share Block Demo',
    content: {
      platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
      url: 'https://example.com',
      title: 'Share this page',
      description: 'Share this page with your friends and colleagues',
      buttonStyle: 'default',
      showCounts: true,
      showQRCode: true,
      qrCodeSize: 200,
      customMessage: 'Check out this amazing page!',
      useWebShareApi: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1.5rem',
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

  return (
    <ShareBlock
      block={block}
      onUpdate={(updates) => console.log('Update:', updates)}
      onDelete={() => console.log('Delete block')}
      isEditing={false}
    />
  );
};

// Demo: Share Block in edit mode
export const ShareBlockEditMode = () => {
  const block: Block = {
    id: 'share_demo_2',
    type: 'share',
    title: 'Share Block - Edit Mode',
    content: {
      platforms: ['facebook', 'twitter', 'whatsapp'],
      url: '',
      title: 'Share My Link',
      description: 'Check out my bio link page',
      buttonStyle: 'pill',
      showCounts: false,
      showQRCode: false,
      qrCodeSize: 150,
      customMessage: 'Visit my bio link for all my social profiles!',
      useWebShareApi: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '1rem',
      margin: '0.5rem 0'
    },
    design: {
      backgroundColor: '#f8f9fa',
      textColor: '#212529',
      borderRadius: '8px',
      padding: '1rem',
      margin: '0.5rem 0'
    }
  };

  return (
    <ShareBlock
      block={block}
      onUpdate={(updates) => console.log('Update:', updates)}
      onDelete={() => console.log('Delete block')}
      isEditing={true}
    />
  );
};

// Demo: Minimal Share Block
export const MinimalShareBlock = () => {
  const block: Block = {
    id: 'share_demo_3',
    type: 'share',
    title: 'Minimal Share',
    content: {
      platforms: ['facebook', 'twitter'],
      url: 'https://example.com',
      title: '',
      description: '',
      buttonStyle: 'minimal',
      showCounts: false,
      showQRCode: false,
      qrCodeSize: 200,
      customMessage: '',
      useWebShareApi: false
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '0.5rem 0',
      margin: '0.25rem 0'
    },
    design: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      borderRadius: '0',
      padding: '0.5rem 0',
      margin: '0.25rem 0'
    }
  };

  return (
    <ShareBlock
      block={block}
      onUpdate={(updates) => console.log('Update:', updates)}
      onDelete={() => console.log('Delete block')}
      isEditing={false}
    />
  );
};

// Demo: Share Block with QR Code enabled
export const ShareBlockWithQR = () => {
  const block: Block = {
    id: 'share_demo_4',
    type: 'share',
    title: 'Share with QR',
    content: {
      platforms: ['whatsapp', 'email'],
      url: 'https://example.com/share',
      title: 'Share via Mobile',
      description: 'Share this page on your mobile device',
      buttonStyle: 'outline',
      showCounts: true,
      showQRCode: true,
      qrCodeSize: 250,
      customMessage: 'Scan this QR code to open on your phone!',
      useWebShareApi: true
    },
    settings: {
      visible: true,
      order: 0,
      customClasses: [],
      padding: '2rem',
      margin: '1rem 0'
    },
    design: {
      backgroundColor: '#e3f2fd',
      textColor: '#1565c0',
      borderRadius: '16px',
      padding: '2rem',
      margin: '1rem 0'
    }
  };

  return (
    <ShareBlock
      block={block}
      onUpdate={(updates) => console.log('Update:', updates)}
      onDelete={() => console.log('Delete block')}
      isEditing={false}
    />
  );
};

// Usage example in a biolink page
export const BiolinkPageExample = () => {
  const blocks: Block[] = [
    {
      id: 'profile',
      type: 'profile',
      title: 'Profile',
      content: {
        name: 'John Doe',
        bio: 'Creator & Entrepreneur',
        avatar: 'https://example.com/avatar.jpg'
      },
      settings: {
        visible: true,
        order: 0,
        customClasses: [],
        padding: '2rem 0',
        margin: '0'
      },
      design: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: '0',
        padding: '2rem 0',
        margin: '0'
      }
    },
    {
      id: 'links',
      type: 'link',
      title: 'My Website',
      content: {
        title: 'Visit My Website',
        url: 'https://example.com',
        icon: 'external-link'
      },
      settings: {
        visible: true,
        order: 1,
        customClasses: [],
        padding: '1rem',
        margin: '0.5rem 0'
      },
      design: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        borderRadius: '12px',
        padding: '1rem',
        margin: '0.5rem 0'
      }
    },
    {
      id: 'share',
      type: 'share',
      title: 'Share My Page',
      content: {
        platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp'],
        url: '',
        title: 'Share My Bio Link',
        description: 'Help me reach more people!',
        buttonStyle: 'default',
        showCounts: true,
        showQRCode: true,
        qrCodeSize: 200,
        customMessage: 'Check out this bio link! 🚀',
        useWebShareApi: true
      },
      settings: {
        visible: true,
        order: 2,
        customClasses: [],
        padding: '1.5rem',
        margin: '0.5rem 0'
      },
      design: {
        backgroundColor: '#f8f9fa',
        textColor: '#212529',
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '0.5rem 0'
      }
    }
  ];

  return (
    <div className="max-w-md mx-auto">
      {blocks.map((block) => {
        // This would use a block renderer component in real usage
        switch (block.type) {
          case 'share':
            return (
              <ShareBlock
                key={block.id}
                block={block}
                onUpdate={() => {}}
                onDelete={() => {}}
                isEditing={false}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};