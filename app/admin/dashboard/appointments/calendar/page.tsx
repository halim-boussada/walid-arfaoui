'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  reason: string | null;
  status: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(weekStart: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function getAppointmentsForDay(date: Date): Appointment[] {
    const dateStr = formatDate(date);
    return appointments
      .filter((apt) => {
        // Extract just the date part from the appointment date (which might be a full ISO string)
        const aptDateStr = apt.date.split('T')[0];
        return aptDateStr === dateStr;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  function goToPreviousWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  }

  function goToNextWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  }

  function goToToday() {
    setCurrentWeekStart(getWeekStart(new Date()));
  }

  const fetchAppointments = async () => {
    try {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const startDate = formatDate(currentWeekStart);
      const endDate = formatDate(weekEnd);

      const response = await fetch(
        `/api/appointments?status=approved&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart]);

  // Refetch appointments when page becomes visible (e.g., returning from another tab/page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAppointments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const weekDays = getWeekDays(currentWeekStart);
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <Link
            href="/admin/dashboard/appointments"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour aux rendez-vous
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Calendrier Hebdomadaire
          </h1>
          <p className="text-sm sm:text-base text-white/60">
            Vue des rendez-vous approuvés de la semaine
          </p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 sm:p-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all touch-manipulation active:scale-95"
            aria-label="Semaine précédente"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-center min-w-[180px] sm:min-w-[200px]">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
              {monthNames[currentWeekStart.getMonth()]} {currentWeekStart.getFullYear()}
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5">
              {currentWeekStart.getDate()} - {weekEnd.getDate()} {monthNames[weekEnd.getMonth()]}
            </p>
          </div>
          <button
            onClick={goToNextWeek}
            className="p-2 sm:p-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all touch-manipulation active:scale-95"
            aria-label="Semaine suivante"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchAppointments();
            }}
            className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            aria-label="Actualiser"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Actualiser</span>
          </button>
          <button
            onClick={goToToday}
            className="flex-1 sm:flex-none px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium text-xs sm:text-sm touch-manipulation active:scale-95"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-3">
        {weekDays.map((day, index) => {
          const isToday = formatDate(day) === formatDate(new Date());
          const dayAppointments = getAppointmentsForDay(day);

          return (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                isToday
                  ? 'border-[var(--gold)] shadow-lg shadow-[var(--gold)]/10'
                  : 'border-[var(--orange-light)]/20 hover:border-[var(--orange-light)]/30'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 sm:p-4 border-b ${
                  isToday
                    ? 'bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/10 border-[var(--gold)]/30'
                    : 'border-white/10'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-white/60 mb-1 uppercase tracking-wide">
                    {dayNames[index]}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold ${isToday ? 'text-[var(--gold)]' : 'text-white'}`}>
                    {day.getDate()}
                  </p>
                </div>
              </div>

              {/* Appointments for the day */}
              <div className="p-2.5 sm:p-3 space-y-2 min-h-[180px] sm:min-h-[250px] lg:min-h-[300px]">
                {dayAppointments.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[120px]">
                    <p className="text-white/40 text-xs sm:text-sm">Aucun rendez-vous</p>
                  </div>
                ) : (
                  dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/5 border border-[var(--gold)]/20 rounded-lg p-3 hover:border-[var(--gold)]/40 hover:from-[var(--gold)]/15 hover:to-[var(--orange)]/10 transition-all cursor-pointer group touch-manipulation active:scale-[0.98]"
                      title={`${apt.name} - ${apt.email}${apt.reason ? '\n' + apt.reason : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <p className="text-sm font-semibold text-[var(--gold)] flex-shrink-0">
                          {apt.time}
                        </p>
                        {apt.created_by === 'admin' && (
                          <span className="text-[10px] px-2 py-0.5 bg-[var(--gold)]/20 text-[var(--gold)] rounded whitespace-nowrap">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-white mb-1 truncate">
                        {apt.name}
                      </p>
                      <p className="text-xs text-white/60 truncate mb-0.5">
                        {apt.email}
                      </p>
                      {apt.phone && (
                        <p className="text-xs text-white/60 truncate">
                          {apt.phone}
                        </p>
                      )}
                      {apt.reason && (
                        <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">
                          {apt.reason}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 sm:mt-8 bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Légende</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded flex-shrink-0"></div>
            <span className="text-white/60">Jour actuel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded flex-shrink-0"></div>
            <span className="text-white/60">Rendez-vous approuvés</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-[var(--gold)]/20 text-[var(--gold)] rounded whitespace-nowrap">
              Admin
            </span>
            <span className="text-white/60">Créé par l'admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
