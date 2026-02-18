'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Share2, Download, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import EventDetails from './EventDetails';

interface Speaker {
  id: string;
  name: string;
  title: string;
  bio?: string;
  image?: string;
}

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  banner?: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  venue?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  registrationEnabled?: boolean;
  capacity?: number;
  registeredCount?: number;
  organizer?: string;
  category?: string;
}

interface EventPreviewProps {
  event: EventData;
}

export default function EventPreview({ event }: EventPreviewProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const eventDate = new Date(`${event.date} ${event.time}`);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event.date, event.time]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const addToCalendar = (type: 'google' | 'apple' | 'outlook') => {
    const eventDate = new Date(`${event.date} ${event.time}`);
    const endDate = event.endTime 
      ? new Date(`${event.date} ${event.endTime}`)
      : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return (date.toISOString().replace(/[-:]/g, '').split('.')[0] ?? '') + 'Z';
    };

    if (type === 'google') {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(eventDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.address || event.location || '')}`;
      window.open(url, '_blank');
    } else if (type === 'apple' || type === 'outlook') {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(eventDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.address || event.location || ''}
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.slug}.ics`;
      a.click();
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsRegistered(true);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Banner Section */}
      {event.banner && (
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {event.category && (
                <span className="inline-block px-4 py-1 bg-indigo-600 rounded-full text-sm font-medium mb-4">
                  {event.category}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{event.time} {event.endTime && `- ${event.endTime}`}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Countdown Timer */}
            {timeLeft && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">Event Starts In</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
                      <div className="text-4xl md:text-5xl font-bold">{item.value}</div>
                      <div className="text-sm md:text-base mt-2 opacity-90">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">About This Event</h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {/* Agenda/Schedule */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Event Agenda</h2>
                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-indigo-600 font-semibold mb-1">{item.time}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        {item.description && <p className="text-gray-600">{item.description}</p>}
                        {item.speaker && <p className="text-sm text-indigo-600 mt-2">Speaker: {item.speaker}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Speakers & Hosts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <motion.div
                      key={speaker.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      {speaker.image ? (
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{speaker.name}</h3>
                        <p className="text-indigo-600 mb-2">{speaker.title}</p>
                        {speaker.bio && <p className="text-sm text-gray-600 line-clamp-2">{speaker.bio}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {event.coordinates && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Venue Location</h2>
                {event.venue && <p className="text-lg font-semibold text-gray-900 mb-2">{event.venue}</p>}
                {event.address && <p className="text-gray-600 mb-4">{event.address}</p>}
                <div className="rounded-xl overflow-hidden h-[400px] border border-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${event.coordinates.lat},${event.coordinates.lng}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Details Card */}
            <EventDetails event={event} />

            {/* Registration/RSVP Form */}
            {event.registrationEnabled && !isRegistered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Register Now</h3>
                {event.capacity && event.registeredCount !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Spots Available</span>
                      <span className="font-semibold text-indigo-600">
                        {event.capacity - event.registeredCount} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Register for Event'}
                  </button>
                </form>
              </motion.div>
            )}

            {isRegistered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">You're Registered!</h3>
                <p className="text-green-700">Check your email for confirmation details.</p>
              </motion.div>
            )}

            {/* Add to Calendar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Add to Calendar
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => addToCalendar('google')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left font-medium"
                >
                  Google Calendar
                </button>
                <button
                  onClick={() => addToCalendar('apple')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left font-medium"
                >
                  Apple Calendar
                </button>
                <button
                  onClick={() => addToCalendar('outlook')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left font-medium"
                >
                  Outlook
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Event
              </h3>
              <button
                onClick={handleShare}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Share with Friends
              </button>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold mb-2 text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Organized By
                </h3>
                <p className="text-gray-700 font-medium">{event.organizer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
