'use client';

import { useState } from 'react';
import { Share2, Copy, Download, Mail, Twitter, Facebook, Instagram, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TripShareProps {
  tripTitle: string;
  tripDuration: number;
  planItems: any[];
  routeStats: {
    totalDistance: string;
    totalTime: string;
  };
  days: any[];
}

export default function TripShare({ tripTitle, tripDuration, planItems, routeStats, days }: TripShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const generateShareUrl = () => {
    // Create a shareable URL with trip data
    const tripData = {
      title: tripTitle,
      duration: tripDuration,
      items: planItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        city: item.cityName || 'Morocco'
      })),
      stats: routeStats,
      createdAt: new Date().toISOString()
    };

    // Encode trip data as base64 for URL sharing
    const encodedData = btoa(JSON.stringify(tripData));
    const url = `${window.location.origin}/share/trip/${encodedData}`;
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async () => {
    const url = shareUrl || generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const url = shareUrl || generateShareUrl();
    const text = `Check out my ${tripDuration}-day Morocco trip: ${tripTitle}!`;
    
    let shareUrl_social = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl_social = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl_social = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy the text
        navigator.clipboard.writeText(`${text} ${url}`);
        return;
      case 'mail':
        shareUrl_social = `mailto:?subject=${encodeURIComponent(`My Morocco Trip: ${tripTitle}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }
    
    if (shareUrl_social) {
      window.open(shareUrl_social, '_blank', 'width=600,height=400');
    }
  };

  const exportTripData = () => {
    const tripData = {
      title: tripTitle,
      duration: tripDuration,
      createdAt: new Date().toISOString(),
      items: planItems,
      route: routeStats,
      days: days.map(day => ({
        dayNumber: day.dayNumber,
        items: day.items,
        estimatedTime: day.estimatedTime,
        estimatedCost: day.estimatedCost
      })),
      summary: {
        totalPlaces: planItems.length,
        totalDistance: routeStats.totalDistance,
        totalTime: routeStats.totalTime,
        estimatedCost: days.reduce((total, day) => total + day.estimatedCost, 0)
      }
    };

    const blob = new Blob([JSON.stringify(tripData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_trip.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printTrip = () => {
    const printContent = `
      <html>
        <head>
          <title>${tripTitle} - Morocco Trip</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .day { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .place { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${tripTitle}</h1>
            <p>Morocco Trip - ${tripDuration} Days</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div><strong>Total Places:</strong> ${planItems.length}</div>
            <div><strong>Total Distance:</strong> ${routeStats.totalDistance}</div>
            <div><strong>Total Time:</strong> ${routeStats.totalTime}</div>
            <div><strong>Estimated Cost:</strong> ~${days.reduce((total, day) => total + day.estimatedCost, 0)} MAD</div>
          </div>
          
          ${days.map(day => `
            <div class="day">
              <h3>Day ${day.dayNumber}</h3>
              <p><strong>Duration:</strong> ${day.estimatedTime} | <strong>Cost:</strong> ~${day.estimatedCost} MAD</p>
              ${day.items.map((item: any, index: number) => `
                <div class="place">
                  <strong>${index + 1}. ${item.name}</strong><br>
                  <em>${item.category}</em> | ${item.cityName || 'Morocco'}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share Trip
      </Button>
    );
  }

  return (
    <Card className="fixed inset-4 z-50 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="card-pad">
        <div className="flex items-center justify-between mb-6">
          <h3 className="h3">Share Your Trip</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
        </div>

        <div className="space-y-6">
          {/* Trip Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">{tripTitle}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div><strong>Duration:</strong> {tripDuration} days</div>
              <div><strong>Places:</strong> {planItems.length}</div>
              <div><strong>Distance:</strong> {routeStats.totalDistance}</div>
              <div><strong>Time:</strong> {routeStats.totalTime}</div>
            </div>
          </div>

          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Shareable Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl || generateShareUrl()}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => shareToSocial('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button
                variant="secondary"
                onClick={() => shareToSocial('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="secondary"
                onClick={() => shareToSocial('instagram')}
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                Instagram
              </Button>
              <Button
                variant="secondary"
                onClick={() => shareToSocial('mail')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-slate-600" />
                Email
              </Button>
            </div>
          </div>


          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h5 className="font-medium text-amber-800 mb-2">Sharing Tips</h5>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Share your trip with friends and family</li>
              <li>• Use social media to inspire others to visit Morocco</li>
              <li>• Your trip is automatically saved to the cloud</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}