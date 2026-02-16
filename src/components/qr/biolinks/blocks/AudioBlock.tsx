"use client";

import { useState, useRef, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, Music } from 'lucide-react';

/**
 * Audio Block
 * Custom audio player with cover art, title, artist, and full controls
 */

export default function AudioBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { content, design } = block;
  const audioContent = content as {
    url: string;
    title?: string;
    artist?: string;
    cover?: string;
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
  };

  // Handle input changes
  const handleContentChange = (field: string, value: string | boolean) => {
    onUpdate({
      content: {
        ...audioContent,
        [field]: value
      }
    });
  };

  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  // Seek audio to specific time
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Change volume
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    
    // Unmute if volume is increased from 0
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Skip backward (10 seconds)
  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, currentTime - 10);
  };

  // Skip forward (10 seconds)
  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, currentTime + 10);
  };

  // Event handlers for audio element
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setDuration(audio.duration);
    setIsLoading(false);
    
    // Handle autoplay
    if (audioContent.autoplay && !isEditing) {
      audio.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVolumeChangeNative = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setVolume(audio.volume);
    setIsMuted(audio.volume === 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = isMuted ? 0 : volume * 100;

  // Effect to handle autoplay changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isEditing) return;

    if (audioContent.autoplay) {
      audio.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    } else if (isPlaying) {
      audio.pause();
    }
  }, [audioContent.autoplay, isPlaying, isEditing]);

  // Render the audio player (public view)
  if (!isEditing) {
    if (!audioContent.url) {
      return (
        <div 
          className="block-audio" 
          style={{ 
            backgroundColor: design.backgroundColor,
            padding: design.padding,
            margin: design.margin,
            borderRadius: design.borderRadius,
            color: design.textColor
          }}
        >
          <div className="flex items-center justify-center py-12">
            <Music size={32} className="opacity-50 mr-3" />
            <div className="text-center">
              <p className="font-medium">Audio Not Configured</p>
              <p className="text-sm opacity-75">Please add an audio URL in edit mode</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="block-audio" 
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          color: design.textColor
        }}
      >
        <audio
          ref={audioRef}
          src={audioContent.url}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onVolumeChange={handleVolumeChangeNative}
          onEnded={handleEnded}
          onLoadStart={handleLoadStart}
          style={{ display: 'none' }}
        />

        <div className="flex flex-col gap-4">
          {/* Cover Art and Track Info */}
          <div className="flex items-center gap-4">
            {audioContent.cover ? (
              <img 
                src={audioContent.cover} 
                alt={audioContent.title || 'Audio Cover'}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                <Music size={32} className="opacity-50" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">
                {audioContent.title || 'Unknown Track'}
              </h3>
              <p className="opacity-75 truncate">
                {audioContent.artist || 'Unknown Artist'}
              </p>
              {isLoading && (
                <div className="text-sm mt-1 opacity-60">
                  Loading audio...
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipBackward}
              title="Skip Back 10s"
            >
              <SkipBack size={16} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={togglePlayPause}
              className="w-12 h-12"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipForward}
              title="Skip Forward 10s"
            >
              <SkipForward size={16} />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="p-2"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Slider
              value={[volumePercentage]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Loop Toggle */}
          <div className="flex items-center justify-center gap-2">
            <Switch
              checked={audioContent.loop || false}
              onCheckedChange={(checked) => {
                handleContentChange('loop', checked);
                if (audioRef.current) {
                  audioRef.current.loop = checked;
                }
              }}
            />
            <Label className="text-sm">Loop</Label>
          </div>
        </div>
      </div>
    );
  }

  // Render the editor interface
  return (
    <div className="block-editor-audio space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audio Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Audio URL</Label>
          <Input
            type="url"
            value={audioContent.url || ''}
            onChange={(e) => handleContentChange('url', e.target.value)}
            placeholder="https://example.com/audio.mp3"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Supported formats: MP3, WAV, OGG, M4A
          </p>
        </div>

        <div>
          <Label>Track Title</Label>
          <Input
            value={audioContent.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="Track title"
          />
        </div>

        <div>
          <Label>Artist</Label>
          <Input
            value={audioContent.artist || ''}
            onChange={(e) => handleContentChange('artist', e.target.value)}
            placeholder="Artist name"
          />
        </div>

        <div>
          <Label>Cover Image URL</Label>
          <Input
            type="url"
            value={audioContent.cover || ''}
            onChange={(e) => handleContentChange('cover', e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Recommended: 300x300px square image
          </p>
        </div>

        {audioContent.cover && (
          <div className="mt-2">
            <img 
              src={audioContent.cover} 
              alt="Cover preview"
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            checked={audioContent.autoplay || false}
            onCheckedChange={(checked) => handleContentChange('autoplay', checked)}
          />
          <Label>Autoplay</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={audioContent.loop || false}
            onCheckedChange={(checked) => handleContentChange('loop', checked)}
          />
          <Label>Loop Playback</Label>
        </div>

        {/* Live Preview */}
        {audioContent.url && (
          <div className="pt-4 border-t">
            <Label className="mb-2 block">Preview</Label>
            <div 
              className="block-audio-preview" 
              style={{ 
                backgroundColor: design.backgroundColor,
                padding: '1rem',
                borderRadius: '8px',
                color: design.textColor
              }}
            >
              <audio
                ref={audioRef}
                src={audioContent.url}
                preload="metadata"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onVolumeChange={handleVolumeChangeNative}
                onEnded={handleEnded}
                onLoadStart={handleLoadStart}
                style={{ display: 'none' }}
              />
              
              <div className="flex flex-col gap-3">
                {/* Mini Player Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayPause}
                    className="w-8 h-8 p-0"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </Button>
                  
                  <div className="flex-1">
                    <Slider
                      value={[progressPercentage]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <span className="text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                {isLoading && (
                  <div className="text-center text-sm opacity-60">
                    Loading audio...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}