'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PatternLibrary, { PatternSettings } from '../PatternLibrary';
import { useTranslation } from '@/lib/i18n';

interface PatternFieldsProps {
  patternSettings?: PatternSettings;
  onChange: (pattern?: PatternSettings) => void;
}

type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

/**
 * Purpose: Executes PatternFields functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PatternFields({
  patternSettings,
  onChange,
}: PatternFieldsProps) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(!!patternSettings && patternSettings.type !== 'none');
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');

  /**
   * Purpose: Executes togglePattern functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const togglePattern = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      onChange(undefined);
    } else {
      onChange({
        type: 'dots',
        color: '#e5e7eb',
        density: 50,
      });
    }
  };

  /**
   * Purpose: Executes handlePatternChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handlePatternChange = (pattern?: PatternSettings) => {
    onChange(pattern);
    setEnabled(!!pattern && pattern.type !== 'none');
  };

  return (
    <div className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('Enable Pattern')}</Label>
          <p className="text-xs text-muted-foreground">
            Add decorative patterns to QR background
          </p>
        </div>
        <Button
          variant={enabled ? 'default' : 'outline'}
          size="sm"
          onClick={togglePattern}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {enabled && (
        <>
          {/* Pattern Library */}
          <Card className="p-4">
            <PatternLibrary
              selectedPattern={patternSettings}
              onChange={handlePatternChange}
            />
          </Card>

          {/* Blend Mode Selector */}
          <div className="space-y-2">
            <Label htmlFor="blend-mode">{t('Pattern Blend Mode')}</Label>
            <Select
              value={blendMode}
              onValueChange={(value) => setBlendMode(value as BlendMode)}
            >
              <SelectTrigger id="blend-mode">
                <SelectValue placeholder={t('Select blend mode')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('Normal')}</SelectItem>
                <SelectItem value="multiply">{t('Multiply')}</SelectItem>
                <SelectItem value="screen">{t('Screen')}</SelectItem>
                <SelectItem value="overlay">{t('Overlay')}</SelectItem>
                <SelectItem value="darken">{t('Darken')}</SelectItem>
                <SelectItem value="lighten">{t('Lighten')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How the pattern blends with the QR code background
            </p>
          </div>

          {/* Blend Mode Preview */}
          <div className="space-y-2">
            <Label className="text-sm">{t('Blend Mode Preview')}</Label>
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Normal')}</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'normal' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Multiply')}</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'multiply' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t('Screen')}</div>
                  <div className="h-16 bg-blue-100 rounded border" style={{ mixBlendMode: 'screen' }}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pattern Overlay Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>{t('Tip:')}</strong> Patterns with low density and subtle colors work best.
              Avoid high-contrast patterns that may interfere with QR code scanning.
            </p>
          </div>
        </>
      )}

      {!enabled && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-sm mb-2">{t('Pattern is disabled')}</p>
            <p className="text-xs">
              Enable patterns to add decorative backgrounds to your QR code
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
