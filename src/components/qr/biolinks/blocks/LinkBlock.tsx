import { useState, useCallback, useMemo } from 'react';
import { BlockEditorProps, LinkBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  X,
  Link,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Image,
  Video,
  Music,
  FileText,
  ShoppingCart,
  Book,
  Heart,
  Star,
  Zap,
  Coffee,
  DollarSign,
  Gift,
  Briefcase,
  Home,
  Info,
  Users,
  Settings,
  Shield,
  Lightbulb,
  Award,
  Bell,
  Camera,
  Cloud,
  Code,
  Compass,
  CreditCard,
  Database,
  Download,
  Edit,
  Feather,
  Filter,
  Flag,
  Folder,
  Frown,
  GiftIcon,
  HardDrive,
  Hash,
  Headphones,
  HelpCircle,
  Key,
  Laptop,
  Layers,
  Layout,
  LifeBuoy,
  Lock,
  LogOut,
  Maximize,
  Mic,
  Minimize,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  MousePointer,
  Move,
  Package,
  Paperclip,
  Pause,
  Percent,
  PieChart,
  Pin,
  Play,
  Pocket,
  Power,
  Printer,
  QrCode,
  RefreshCcw,
  Repeat,
  Save,
  Search,
  Send,
  Share2,
  Share,
  ShieldAlert,
  ShoppingCartIcon,
  Smile,
  Speaker,
  Square,
  Sun,
  Tablet,
  Tag,
  Target,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Ticket,
  ToggleLeft,
  ToggleRight,
  Trash,
  TrendingDown,
  TrendingUp,
  Triangle,
  Truck,
  Type,
  Underline,
  Unlock,
  Upload,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Verified,
  Volume1,
  Volume2,
  VolumeX,
  Wallet,
  Wand2,
  Watch,
  Waves,
  Webhook,
  Wifi,
  Wind,
  Wrench,
  ZapOff,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const LinkBlockIcons: Record<string, React.ElementType> = {
  link: Link,
  externalLink: ExternalLink,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  globe: Globe,
  mail: Mail,
  phone: Phone,
  messageSquare: MessageSquare,
  mapPin: MapPin,
  calendar: Calendar,
  image: Image,
  video: Video,
  music: Music,
  fileText: FileText,
  shoppingCart: ShoppingCart,
  book: Book,
  heart: Heart,
  star: Star,
  zap: Zap,
  coffee: Coffee,
  dollarSign: DollarSign,
  gift: Gift,
  briefcase: Briefcase,
  home: Home,
  info: Info,
  users: Users,
  settings: Settings,
  shield: Shield,
  lightbulb: Lightbulb,
  award: Award,
  bell: Bell,
  camera: Camera,
  cloud: Cloud,
  code: Code,
  compass: Compass,
  creditCard: CreditCard,
  database: Database,
  download: Download,
  edit: Edit,
  feather: Feather,
  filter: Filter,
  flag: Flag,
  folder: Folder,
  frown: Frown,
  giftIcon: GiftIcon,
  hardDrive: HardDrive,
  hash: Hash,
  headphones: Headphones,
  helpCircle: HelpCircle,
  key: Key,
  laptop: Laptop,
  layers: Layers,
  layout: Layout,
  lifeBuoy: LifeBuoy,
  lock: Lock,
  logOut: LogOut,
  maximize: Maximize,
  mic: Mic,
  minimize: Minimize,
  monitor: Monitor,
  moon: Moon,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  mousePointer: MousePointer,
  move: Move,
  package: Package,
  paperclip: Paperclip,
  pause: Pause,
  percent: Percent,
  pieChart: PieChart,
  pin: Pin,
  play: Play,
  pocket: Pocket,
  power: Power,
  printer: Printer,
  qrCode: QrCode,
  refreshCcw: RefreshCcw,
  repeat: Repeat,
  save: Save,
  search: Search,
  send: Send,
  share2: Share2,
  share: Share,
  shieldAlert: ShieldAlert,
  shoppingCartIcon: ShoppingCartIcon,
  smile: Smile,
  speaker: Speaker,
  square: Square,
  sun: Sun,
  tablet: Tablet,
  tag: Tag,
  target: Target,
  terminal: Terminal,
  thumbsDown: ThumbsDown,
  thumbsUp: ThumbsUp,
  ticket: Ticket,
  toggleLeft: ToggleLeft,
  toggleRight: ToggleRight,
  trash: Trash,
  trendingDown: TrendingDown,
  trendingUp: TrendingUp,
  triangle: Triangle,
  truck: Truck,
  type: Type,
  underline: Underline,
  unlock: Unlock,
  upload: Upload,
  user: User,
  userCheck: UserCheck,
  userPlus: UserPlus,
  userX: UserX,
  verified: Verified,
  volume1: Volume1,
  volume2: Volume2,
  volumeX: VolumeX,
  wallet: Wallet,
  wand2: Wand2,
  watch: Watch,
  waves: Waves,
  webhook: Webhook,
  wifi: Wifi,
  wind: Wind,
  wrench: Wrench,
  zapOff: ZapOff,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
};

export const LinkBlock: React.FC<BlockEditorProps> = ({ block, onUpdate, isPreview }) => {
  const content = block.content as LinkBlockContent;
  const [searchTerm, setSearchTerm] = useState('');

  const updateContent = (updates: Partial<LinkBlockContent>) => {
    onUpdate({
      content: { ...content, ...updates }
    });
  };

  const updateSettings = (updates: Partial<typeof block.settings>) => {
    onUpdate({
      settings: { ...block.settings, ...updates }
    });
  };

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return Object.keys(LinkBlockIcons);
    return Object.keys(LinkBlockIcons).filter(key => 
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const SelectedIcon = content.icon && LinkBlockIcons[content.icon] 
    ? LinkBlockIcons[content.icon] 
    : Link;

  if (isPreview) {
    return (
      <a 
        href={content.url || '#'} 
        target={content.openInNewTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="flex items-center w-full transition-transform hover:scale-[1.02]"
        style={{
          padding: block.settings.padding,
          margin: block.settings.margin,
          backgroundColor: block.settings.backgroundColor,
          color: block.settings.textColor,
          borderRadius: block.settings.borderRadius,
          border: block.settings.border || '1px solid transparent',
          textDecoration: 'none'
        }}
      >
        {content.icon && content.icon !== 'none' && (
          <div className="mr-3 flex-shrink-0">
            <SelectedIcon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{content.title || 'Link Title'}</div>
          {content.subtitle && (
            <div className="text-sm opacity-80 truncate">{content.subtitle}</div>
          )}
        </div>
        <div className="ml-2 opacity-50">
          <ExternalLink className="w-4 h-4" />
        </div>
      </a>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Link Text</Label>
            <Input 
              value={content.title} 
              onChange={(e) => updateContent({ title: e.target.value })}
              placeholder="e.g. Visit my Website"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle (Optional)</Label>
            <Input 
              value={content.subtitle || ''} 
              onChange={(e) => updateContent({ subtitle: e.target.value })}
              placeholder="e.g. Check out my latest work"
            />
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input 
              value={content.url} 
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Open in new tab</Label>
            <Switch 
              checked={content.openInNewTab}
              onCheckedChange={(checked) => updateContent({ openInNewTab: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {content.icon && content.icon !== 'none' ? (
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="w-4 h-4" />
                      <span>{content.icon}</span>
                    </div>
                  ) : (
                    <span>Select Icon</span>
                  )}
                  <Search className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2 border-b">
                  <Input 
                    placeholder="Search icons..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
                <ScrollArea className="h-[200px] p-2">
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0"
                      onClick={() => updateContent({ icon: 'none' })}
                      title="None"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {filteredIcons.map((key) => {
                      const IconComponent = LinkBlockIcons[key];
                      return (
                        <Button
                          key={key}
                          variant={content.icon === key ? "default" : "ghost"}
                          className="h-10 w-10 p-0"
                          onClick={() => updateContent({ icon: key })}
                          title={key}
                        >
                          <IconComponent className="h-4 w-4" />
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Select 
              value={block.settings.borderRadius || '8px'} 
              onValueChange={(value) => updateSettings({ borderRadius: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">None</SelectItem>
                <SelectItem value="4px">Small</SelectItem>
                <SelectItem value="8px">Medium</SelectItem>
                <SelectItem value="16px">Large</SelectItem>
                <SelectItem value="9999px">Full (Pill)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input 
                type="color" 
                value={block.settings.backgroundColor || '#ffffff'}
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              />
              <Input 
                value={block.settings.backgroundColor || '#ffffff'}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <Input 
                type="color" 
                value={block.settings.textColor || '#000000'}
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => updateSettings({ textColor: e.target.value })}
              />
              <Input 
                value={block.settings.textColor || '#000000'}
                onChange={(e) => updateSettings({ textColor: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
             <Label>Border</Label>
             <Input 
                value={block.settings.border || ''}
                onChange={(e) => updateSettings({ border: e.target.value })}
                placeholder="e.g. 1px solid #e5e5e5"
             />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label>Visible</Label>
            <Switch 
              checked={block.settings.visible}
              onCheckedChange={(checked) => updateSettings({ visible: checked })}
            />
          </div>

          <div className="space-y-2">
             <Label>Padding</Label>
             <Select 
               value={block.settings.padding || '1rem'} 
               onValueChange={(value) => updateSettings({ padding: value })}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select padding" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="0.5rem">Small</SelectItem>
                 <SelectItem value="1rem">Medium</SelectItem>
                 <SelectItem value="1.5rem">Large</SelectItem>
                 <SelectItem value="2rem">Extra Large</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkBlock;
