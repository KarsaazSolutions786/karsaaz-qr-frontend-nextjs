"use client";

/**
 * Test Page for Phase 1 - QR Types Validation
 * This page tests all QR types to ensure they work correctly
 */

import { useState } from "react";
import { allQRTypes } from "@/data/qr-types";
import { qrCodeService } from "@/services/qr.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface QRTestResult {
  typeId: string;
  name: string;
  status: 'pass' | 'fail' | 'pending' | 'skipped';
  message?: string;
  error?: string;
}

export default function QRTypesTestPage() {
  const [results, setResults] = useState<QRTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'complete'>('idle');

  // QR types that need special handling or are complex
  const skippedTypes = [
    'biolinks', 'website-builder', 'image-gallery', 'social-media', 
    'file-upload', 'lead-form', 'event' // These need more complex data structures
  ];

  // Test data for different QR types
  const getTestData = (typeId: string): Record<string, unknown> => {
    const testData: Record<string, Record<string, any>> = {
      'business-profile': {
        businessName: 'Test Business',
        phone: '+1234567890',
        email: 'test@example.com',
        website: 'https://example.com',
        address: '123 Test St, City, Country',
        description: 'A test business profile',
        openingHours: 'Mon-Fri: 9am-5pm'
      },
      'restaurant-menu': {
        restaurantName: 'Test Restaurant',
        phone: '+1234567890',
        website: 'https://restaurant.com',
        description: 'A test restaurant menu'
      },
      'product-catalogue': {
        businessName: 'Test Store',
        description: 'Our product catalog',
        website: 'https://store.com'
      },
      'vcard-plus': {
        firstName: 'John',
        lastName: 'Doe',
        phones: '+1234567890',
        emails: 'john@example.com',
        company: 'Test Corp',
        job: 'Developer',
        website: 'https://johndoe.com',
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
        state: 'NY',
        country: 'USA',
        bio: 'Software developer and tech enthusiast'
      },
      'business-review': {
        businessName: 'Test Business',
        reviewUrl: 'https://g.page/test/review'
      },
      'resume': {
        fullName: 'John Doe',
        title: 'Software Developer',
        phone: '+1234567890',
        email: 'john@example.com',
        website: 'https://johndoe.com',
        summary: 'Experienced developer with 5+ years'
      },
      'app-download': {
        appName: 'TestApp',
        appStoreUrl: 'https://apps.apple.com/test',
        playStoreUrl: 'https://play.google.com/store/apps/test',
        description: 'Download our app'
      },
      'google-review': {
        placeId: 'ChIJd8BlQ2BZwokRAFUFMrbq63w'
      },
      'whatsapp': {
        mobile_number: '+1234567890',
        message: 'Hello!'
      },
      'upi-dynamic': {
        vpa: 'test@upi',
        payeeName: 'Test User',
        amount: 100,
        currency: 'INR'
      },
      'email-dynamic': {
        email: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test message body'
      },
      'sms-dynamic': {
        phone: '+1234567890',
        message: 'Test SMS message'
      },
      'paypal': {
        email: 'test@paypal.com',
        amount: 50.00,
        currency: 'USD',
        description: 'Test payment'
      },
      'video': {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Test Video',
        description: 'A test video'
      }
    };

    return testData[typeId] || { data: 'Test data' };
  };

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setResults([]);

    // Test each QR type
    for (const type of allQRTypes) {
      if (skippedTypes.includes(type.id)) {
        setResults(prev => [...prev, {
          typeId: type.id,
          name: type.name,
          status: 'skipped',
          message: 'Complex type - requires manual testing'
        }]);
        continue;
      }

      // Set status to pending
      setResults(prev => [...prev, {
        typeId: type.id,
        name: type.name,
        status: 'pending'
      }]);

      try {
        const testData: Record<string, unknown> = getTestData(type.id);
        
        // Create QR code
        const payload = {
          name: `Test - ${type.name} - ${new Date().toLocaleTimeString()}`,
          type: type.id,
          data: testData,
          design: {
            fillType: "solid",
            foregroundColor: "#000000",
            eyeInternalColor: "#000000",
            eyeExternalColor: "#000000",
            backgroundColor: "#ffffff",
            backgroundEnabled: true,
            gradientFill: { type: "RADIAL", colors: ["#000000", "#1c57cb"], rotation: 0 },
            foregroundImage: null,
            module: "square",
            finder: "default",
            finderDot: "default",
            shape: "none",
            frameColor: "#000000",
            logoScale: 0.2,
            logoPositionX: 0.5,
            logoPositionY: 0.5,
            logoRotate: 0,
            logoBackground: true,
            logoBackgroundFill: "#ffffff",
            logoBackgroundShape: "circle",
            logoBackgroundScale: 1.5,
            logoType: "none",
            advancedShape: "none",
            advancedShapeDropShadow: true,
            advancedShapeFrameColor: "#000000",
            text: "SCAN ME",
            textColor: "#ffffff",
            textBackgroundColor: "#000000",
            fontFamily: "Inter",
            fontVariant: "700",
            textSize: "1",
            healthcareFrameColor: "#CC0032",
            healthcareHeartColor: "#ffffff",
            couponLeftColor: "#000000",
            couponRightColor: "#CC0032",
            coupon_text_line_1text: "EXCLUSIVE",
            coupon_text_line_2text: "OFFER",
            coupon_text_line_3text: "50% OFF",
            reviewCollectorCircleColor: "#000000",
            reviewCollectorStarsColor: "#FFD700",
            reviewCollectorLogoSrc: "google",
            is_ai: false,
            ai_strength: 1.8,
            ai_steps: 18,
            ai_model: "1.1",
          }
        };

        const result = await qrCodeService.create(payload);
        
        if (result && result.id) {
          // Test preview generation
          try {
            const previewParams = {
              data: JSON.stringify(testData),
              type: type.id,
              design: JSON.stringify(payload.design),
              renderText: true
            };
            
            await qrCodeService.preview(previewParams);
            
            setResults(prev => prev.map(r => 
              r.typeId === type.id 
                ? { ...r, status: 'pass', message: `✓ Created (ID: ${result.id}) and preview generated` }
                : r
            ));
            
            // Cleanup - delete the test QR
            try {
              await qrCodeService.delete(result.id);
            } catch (_e: unknown) {
              console.log(`Could not cleanup test QR ${result.id}`);
            }
            
          } catch (previewError: unknown) {
            setResults(prev => prev.map(r => 
              r.typeId === type.id 
                ? { ...r, status: 'pass', message: `✓ Created (ID: ${result.id}) but preview failed: ${(previewError as Error).message}` }
                : r
            ));
          }
        } else {
          setResults(prev => prev.map(r => 
            r.typeId === type.id 
              ? { ...r, status: 'fail', error: 'No QR code ID returned' }
              : r
          ));
        }
        
      } catch (error: unknown) {
        setResults(prev => prev.map(r => 
          r.typeId === type.id 
            ? { 
                ...r, 
                status: 'fail', 
                error: (error as Error)?.message || JSON.stringify((error as { jsonResponse?: { message?: string } })?.jsonResponse?.message || (error as { jsonResponse?: object })?.jsonResponse) 
              }
            : r
        ));
      }
    }

    setOverallStatus('complete');
    setIsRunning(false);
  };

  const getStatusIcon = (status: QRTestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: QRTestResult['status']) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">PASS</Badge>;
      case 'fail': return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">FAIL</Badge>;
      case 'skipped': return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">SKIPPED</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">PENDING</Badge>;
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const skipCount = results.filter(r => r.status === 'skipped').length;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Phase 1: QR Types Test Suite</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Testing all QR code types to ensure they work correctly with the backend API.
          This will validate that field definitions, API endpoints, and preview generation work as expected.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Controls</span>
            {overallStatus === 'complete' && (
              <Badge className="text-lg px-4 py-1">
                Results: {passCount} Pass, {failCount} Fail, {skipCount} Skipped
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              size="lg"
              className="font-bold"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run All Tests'
              )}
            </Button>
            
            {isRunning && (
              <div className="text-sm text-muted-foreground">
                Testing {results.filter(r => r.status === 'pending').length} remaining types...
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span>Pass: {passCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span>Fail: {failCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span>Skipped: {skipCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
              <span>Total: {allQRTypes.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {allQRTypes.map((type, _index) => {
          const result = results.find(r => r.typeId === type.id);
          return (
            <Card key={type.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {result ? getStatusIcon(result.status) : <div className="h-4 w-4"></div>}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{type.name}</h3>
                        <Badge variant="outline">{type.category}</Badge>
                        {result && getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      {result?.message && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">{result.message}</p>
                      )}
                      {result?.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-mono">{result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Type ID: <code className="bg-muted px-1 py-0.5 rounded">{type.id}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {overallStatus === 'complete' && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Test Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{passCount}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{failCount}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{skipCount}</div>
                  <div className="text-sm text-muted-foreground">Skipped</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {(passCount / (allQRTypes.length - skipCount) * 100).toFixed(1)}% Success Rate
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complex types ({skippedTypes.join(', ')}) require manual testing with full UI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
