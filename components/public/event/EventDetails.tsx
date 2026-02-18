'use client';

import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDetailsProps {
  event: {
    title: string;
    date: string;
    time: string;
    endTime?: string;
    location?: string;
    venue?: string;
    address?: string;
    category?: string;
    organizer?: string;
    capacity?: number;
    registeredCount?: number;
  };
}

export default function EventDetails({ event }: EventDetailsProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const spotsLeft = event.capacity && event.registeredCount !== undefined
    ? event.capacity - event.registeredCount
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Event Details</h3>
      
      <div className="space-y-4">
        {/* Date */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-medium">{eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
              <span className="text-xl font-bold">{eventDate.getDate()}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-gray-900 font-semibold">{formattedDate}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <span className="font-medium">Time</span>
            </div>
            <p className="text-gray-900 font-semibold">
              {event.time}
              {event.endTime && ` - ${event.endTime}`}
            </p>
          </div>
        </div>

        {/* Location */}
        {(event.location || event.venue) && (
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span className="font-medium">Location</span>
              </div>
              {event.venue && <p className="text-gray-900 font-semibold">{event.venue}</p>}
              {event.location && !event.venue && <p className="text-gray-900 font-semibold">{event.location}</p>}
              {event.address && <p className="text-gray-600 text-sm mt-1">{event.address}</p>}
            </div>
          </div>
        )}

        {/* Category */}
        {event.category && (
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Tag className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span className="font-medium">Category</span>
              </div>
              <p className="text-gray-900 font-semibold">{event.category}</p>
            </div>
          </div>
        )}

        {/* Capacity */}
        {spotsLeft !== null && (
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span className="font-medium">Availability</span>
              </div>
              <p className="text-gray-900 font-semibold">
                {spotsLeft > 0 ? (
                  <>
                    <span className="text-green-600">{spotsLeft}</span> spots left
                  </>
                ) : (
                  <span className="text-red-600">Event Full</span>
                )}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {event.registeredCount} / {event.capacity} registered
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-2xl font-bold text-indigo-600">
              {eventDate > new Date() ? 'Upcoming' : 'Live'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Status</div>
          </div>
          {event.registeredCount !== undefined && (
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-2xl font-bold text-green-600">{event.registeredCount}</div>
              <div className="text-xs text-gray-600 mt-1">Registered</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
