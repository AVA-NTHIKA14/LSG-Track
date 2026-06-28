import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import type { SystemNotification } from '../types';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    const unsubscribe = dbService.subscribeToNotifications(setNotifications);
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await dbService.markNotificationAsRead(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gov-navy">Notifications & System Alerts</h2>
        <p className="text-xs text-slate-500">Official warnings, expiration notices, pending survey alerts, and workflow update feeds.</p>
      </div>

      <div className="bg-white border border-gov-border rounded p-4 shadow-sm max-w-3xl mx-auto space-y-4">
        
        <div className="border-b pb-2 flex justify-between items-center text-xs">
          <span className="font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1.5">
            <Bell size={15} />
            <span>Alert Tray ({notifications.filter(n => !n.read).length} Unread)</span>
          </span>
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-8 text-center">No notifications currently logged in portal.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              // Icon mapping
              let Icon = Info;
              let iconColor = 'text-blue-600 bg-blue-50';
              if (n.type === 'warning') {
                Icon = AlertTriangle;
                iconColor = 'text-amber-700 bg-amber-50';
              } else if (n.type === 'alert') {
                Icon = AlertCircle;
                iconColor = 'text-red-700 bg-red-50';
              } else if (n.type === 'success') {
                Icon = CheckCircle2;
                iconColor = 'text-green-700 bg-green-50';
              }

              return (
                <div 
                  key={n.id} 
                  className={`border rounded p-3 flex justify-between items-start transition ${
                    n.read ? 'bg-white border-slate-100 opacity-75' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex space-x-3 text-xs">
                    <div className={`p-2 rounded shrink-0 ${iconColor}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-800">{n.title}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">| {new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-normal font-medium">{n.message}</p>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-gov-green hover:bg-slate-100 p-1 rounded border shrink-0"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
