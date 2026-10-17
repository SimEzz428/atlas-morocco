'use client';

import { useEffect, useMemo, useState } from 'react';
import { Share2, Copy, Mail, Twitter, Facebook, MessageCircle, Check, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { PlanPlace } from '@/features/plan/usePlan';
import { encodeTrip } from '@/features/planner/utils/share';
import { formatTime } from '@/features/planner/utils/geo';
import { getCity } from '@/data/cities';

interface TripShareProps {
  tripTitle: string;
  tripDuration: number;
  planItems: PlanPlace[];
  routeStats: { totalDistance: string; totalTime: string };
  days: { dayNumber: number; items: PlanPlace[]; totalMinutes: number; costMad: number }[];
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const cityName = (slug: string) => getCity(slug)?.name ?? slug;

export default function TripShare({ tripTitle, tripDuration, planItems, routeStats, days }: TripShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!isOpen) return '';
    const items = days.flatMap((day) =>
      day.items.map((item) => ({ name: item.name, category: item.category, city: item.city, day: day.dayNumber }))
    );
    const data = encodeTrip({ title: tripTitle, duration: tripDuration, items, stats: routeStats });
    return `${window.location.origin}/share/trip/${data}`;
  }, [isOpen, days, tripTitle, tripDuration, routeStats]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const shareText = `Check out my ${tripDuration}-day Morocco trip: ${tripTitle}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. non-HTTPS); the link stays selectable in the input.
    }
  };

  const shareTo = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'mail') => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);
    const targets = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      mail: `mailto:?subject=${encodeURIComponent(`My Morocco Trip: ${tripTitle}`)}&body=${text}%0A%0A${url}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer');
  };

  const printTrip = () => {
    const totalCost = days.reduce((total, day) => total + day.costMad, 0);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!doctype html>
      <html>
        <head>
          <title>${escapeHtml(tripTitle)} - Morocco Trip</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #1e293b; }
            h1 { margin-bottom: 4px; }
            .stats { display: flex; flex-wrap: wrap; gap: 24px; margin: 16px 0 24px; }
            .day { margin: 16px 0; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; break-inside: avoid; }
            .place { margin: 6px 0; }
            .muted { color: #64748b; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(tripTitle)}</h1>
          <div class="muted">Morocco trip · ${tripDuration} ${tripDuration === 1 ? 'day' : 'days'} · printed ${new Date().toLocaleDateString()}</div>
          <div class="stats">
            <div><strong>Places:</strong> ${planItems.length}</div>
            <div><strong>Distance:</strong> ${escapeHtml(routeStats.totalDistance)}</div>
            <div><strong>Travel time:</strong> ${escapeHtml(routeStats.totalTime)}</div>
            <div><strong>Entry fees:</strong> ~${totalCost} MAD</div>
          </div>
          ${days
            .map(
              (day) => `<div class="day">
                <h3>Day ${day.dayNumber}</h3>
                ${
                  day.items.length
                    ? `<div class="muted">~${formatTime(day.totalMinutes)} · ~${day.costMad} MAD</div>` +
                      day.items
                        .map((item, i) => `<div class="place"><strong>${i + 1}. ${escapeHtml(item.name)}</strong> <span class="muted">· ${escapeHtml(item.category)} · ${escapeHtml(cityName(item.city))}</span></div>`)
                        .join('')
                    : '<div class="muted">Free day</div>'
                }
              </div>`
            )
            .join('')}
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => setIsOpen(true)} data-testid="share-trip">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[1300] bg-black/40 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
      <Card
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
        variant="elevated"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-pad">
          <div className="flex items-center justify-between mb-6">
            <h3 id="share-title" className="h3">Share Your Trip</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">{tripTitle}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div><strong>Duration:</strong> {tripDuration} days</div>
                <div><strong>Places:</strong> {planItems.length}</div>
                <div><strong>Distance:</strong> {routeStats.totalDistance}</div>
                <div><strong>Travel:</strong> {routeStats.totalTime}</div>
              </div>
            </div>

            <div>
              <label htmlFor="share-url" className="block text-sm font-medium text-slate-700 mb-2">
                Shareable link
              </label>
              <div className="flex gap-2">
                <input
                  id="share-url"
                  type="text"
                  value={shareUrl}
                  readOnly
                  onFocus={(e) => e.target.select()}
                  className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  data-testid="share-url"
                />
                <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Anyone with the link can view this itinerary. No sign-in needed.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => shareTo('whatsapp')}>
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button variant="secondary" onClick={() => shareTo('mail')}>
                <Mail className="h-4 w-4 text-slate-600" />
                Email
              </Button>
              <Button variant="secondary" onClick={() => shareTo('twitter')}>
                <Twitter className="h-4 w-4 text-sky-500" />
                X / Twitter
              </Button>
              <Button variant="secondary" onClick={() => shareTo('facebook')}>
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button variant="secondary" onClick={printTrip} className="col-span-2">
                <Printer className="h-4 w-4" />
                Print itinerary
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
