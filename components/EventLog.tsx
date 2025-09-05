import React from 'react';

interface EventLogProps {
  events: string[];
}

const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="bg-stone/10 p-4 rounded-lg shadow-lg border-2 border-wood/20">
      <h3 className="text-xl font-bold mb-3 text-center border-b-2 border-wood/20 pb-2">Event Log</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 text-sm text-stone">
        {events.map((event, index) => (
          <li key={index}>
            <i className="fas fa-feather-alt w-5 mr-1"></i> {event}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
