"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/database.types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function MonthGrid({
  month,
  events,
  onDayClick,
  onEventClick,
}: {
  month: Date;
  events: CalendarEvent[];
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  function eventsForDay(day: Date) {
    return events.filter((e) => isSameDay(parseISO(e.start_time), day));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-surface">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = eventsForDay(day);
          const inMonth = isSameMonth(day, month);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "focus-ring flex min-h-[92px] flex-col items-start gap-1 border-b border-r border-border p-1.5 text-left transition-colors hover:bg-surface-elevated/60",
                !inMonth && "bg-surface/40 text-muted-foreground/50"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isToday(day) && "bg-primary font-semibold text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex w-full flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                    style={{ backgroundColor: event.color }}
                    title={event.title}
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} mais</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
