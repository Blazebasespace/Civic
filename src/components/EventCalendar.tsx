import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'governance' | 'community' | 'education' | 'social';
  attendees: number;
  maxAttendees?: number;
  isAttending: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Weekly Governance Assembly',
    description: 'Discuss active proposals and community decisions',
    date: new Date(2024, 11, 25),
    time: '18:00',
    location: 'Community Center',
    type: 'governance',
    attendees: 45,
    maxAttendees: 100,
    isAttending: true
  },
  {
    id: '2',
    title: 'Civic Tech Workshop',
    description: 'Learn about blockchain governance and ZK proofs',
    date: new Date(2024, 11, 27),
    time: '14:00',
    location: 'Tech Hub',
    type: 'education',
    attendees: 23,
    maxAttendees: 30,
    isAttending: false
  },
  {
    id: '3',
    title: 'Community Garden Project',
    description: 'Help build our sustainable food system',
    date: new Date(2024, 11, 28),
    time: '10:00',
    location: 'Central Park',
    type: 'community',
    attendees: 67,
    isAttending: false
  }
];

const EventCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredEvents = mockEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'governance':
        return 'bg-governance-100 text-governance-700 border-governance-200';
      case 'community':
        return 'bg-civic-100 text-civic-700 border-civic-200';
      case 'education':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'social':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Community Events</h2>
          <button className="flex items-center px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ←
            </button>
            <h3 className="text-lg font-medium text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              →
            </button>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-civic-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="governance">Governance</option>
            <option value="community">Community</option>
            <option value="education">Education</option>
            <option value="social">Social</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[80px] p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-civic-50 border-civic-200' : ''
                } ${isToday ? 'bg-governance-50' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-governance-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border ${getTypeColor(event.type)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-4">
            {getEventsForDate(selectedDate).map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendees}
                          {event.maxAttendees && `/${event.maxAttendees}`} attending
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      event.isAttending
                        ? 'bg-governance-100 text-governance-700 hover:bg-governance-200'
                        : 'bg-civic-500 text-white hover:bg-civic-600'
                    }`}
                  >
                    {event.isAttending ? 'Attending' : 'Join Event'}
                  </button>
                </div>
              </div>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <p className="text-gray-500 text-center py-4">No events scheduled for this day</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;