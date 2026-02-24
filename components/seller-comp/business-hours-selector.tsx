"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  dayShort: string;
  closed: boolean;
  slots: TimeSlot[];
}

interface BusinessHoursSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function BusinessHoursSelector({
  value,
  onChange,
}: BusinessHoursSelectorProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      dayShort: "Mo",
      closed: false,
      slots: [{ open: "09:00", close: "17:00" }],
    },
    {
      day: "Tuesday",
      dayShort: "Tu",
      closed: false,
      slots: [{ open: "09:00", close: "17:00" }],
    },
    {
      day: "Wednesday",
      dayShort: "We",
      closed: false,
      slots: [{ open: "09:00", close: "17:00" }],
    },
    {
      day: "Thursday",
      dayShort: "Th",
      closed: false,
      slots: [{ open: "09:00", close: "17:00" }],
    },
    {
      day: "Friday",
      dayShort: "Fr",
      closed: false,
      slots: [{ open: "09:00", close: "17:00" }],
    },
    { day: "Saturday", dayShort: "Sa", closed: true, slots: [] },
    { day: "Sunday", dayShort: "Su", closed: true, slots: [] },
  ]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate time options (24-hour format)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  // Parse incoming value on mount
  useEffect(() => {
    if (value && value.trim() !== "") {
      try {
        // Parse the WordPress format: ["Mo 09:00-17:00","Tu 09:00-17:00",...]
        const match = value.match(/\["([^"]+)"\]/);
        if (match) {
          const hoursString = match[1];
          const dayHours = hoursString.split('","');

          const newSchedule = [...schedule];

          dayHours.forEach((dayHour) => {
            const parts = dayHour.split(" ");
            if (parts.length === 2) {
              const dayShort = parts[0];
              const times = parts[1].split("-");

              const dayIndex = newSchedule.findIndex(
                (d) => d.dayShort === dayShort,
              );
              if (dayIndex !== -1 && times.length === 2) {
                newSchedule[dayIndex] = {
                  ...newSchedule[dayIndex],
                  closed: false,
                  slots: [{ open: times[0], close: times[1] }],
                };
              }
            }
          });

          setSchedule(newSchedule);
        }
      } catch (error) {
        console.error("Error parsing business hours:", error);
      }
    }
  }, []); // Only run on mount

  // Format schedule to WordPress format
  const formatScheduleForWordPress = (scheduleData: DaySchedule[]): string => {
    const hoursArray: string[] = [];

    scheduleData.forEach((day) => {
      if (!day.closed && day.slots.length > 0) {
        day.slots.forEach((slot) => {
          if (slot.open && slot.close) {
            hoursArray.push(`${day.dayShort} ${slot.open}-${slot.close}`);
          }
        });
      }
    });

    if (hoursArray.length === 0) {
      return "";
    }

    // Format: ["Mo 09:00-17:00","Tu 09:00-17:00",...],[\"UTC\":\"+0\",\"Timezone\":\"UTC\"]
    const hoursString = `[\"${hoursArray.join('\",\"')}\"],[\"UTC\":\"+0\",\"Timezone\":\"UTC\"]`;
    return hoursString;
  };

  // Update schedule and notify parent
  const updateSchedule = (newSchedule: DaySchedule[]) => {
    setSchedule(newSchedule);
    const formatted = formatScheduleForWordPress(newSchedule);
    onChange(formatted);
  };

  // Toggle day closed/open
  const toggleDayClosed = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].closed = !newSchedule[dayIndex].closed;

    if (newSchedule[dayIndex].closed) {
      newSchedule[dayIndex].slots = [];
    } else if (newSchedule[dayIndex].slots.length === 0) {
      newSchedule[dayIndex].slots = [{ open: "09:00", close: "17:00" }];
    }

    updateSchedule(newSchedule);
  };

  // Update time slot
  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "open" | "close",
    value: string,
  ) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    updateSchedule(newSchedule);
  };

  // Add time slot to a day
  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.push({ open: "09:00", close: "17:00" });
    updateSchedule(newSchedule);
  };

  // Remove time slot from a day
  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    updateSchedule(newSchedule);
  };

  // Copy hours to all weekdays
  const copyToWeekdays = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const sourceDay = schedule[dayIndex];

    // Copy to Monday-Friday (indices 0-4)
    for (let i = 0; i <= 4; i++) {
      if (i !== dayIndex) {
        newSchedule[i] = {
          ...newSchedule[i],
          closed: sourceDay.closed,
          slots: sourceDay.slots.map((slot) => ({ ...slot })),
        };
      }
    }

    updateSchedule(newSchedule);
  };

  // Get summary text
  const getSummaryText = () => {
    const openDays = schedule.filter((d) => !d.closed);
    if (openDays.length === 0) return "All days closed";
    if (openDays.length === 7) return "Open 7 days a week";
    if (openDays.length === 5 && schedule.slice(0, 5).every((d) => !d.closed)) {
      const firstSlot = openDays[0].slots[0];
      return `Mon-Fri: ${firstSlot.open}-${firstSlot.close}`;
    }
    return `${openDays.length} days open`;
  };

  return (
    <div className="space-y-2">
      {/* Header with expand/collapse button */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <Label className="text-gray-900 cursor-pointer">Business Hours</Label>
          <span className="text-sm text-gray-500">({getSummaryText()})</span>
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-white">
          {schedule.map((day, dayIndex) => (
            <div
              key={day.day}
              className="border border-gray-200 rounded-md p-2 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`closed-${day.day}`}
                    checked={day.closed}
                    onCheckedChange={() => toggleDayClosed(dayIndex)}
                  />
                  <Label
                    htmlFor={`closed-${day.day}`}
                    className="text-gray-900 cursor-pointer text-sm min-w-[80px]"
                  >
                    {day.day}
                  </Label>
                  {day.closed && (
                    <span className="text-xs text-gray-500 italic">Closed</span>
                  )}
                </div>

                {!day.closed && dayIndex <= 4 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToWeekdays(dayIndex)}
                    className="text-xs h-7 px-2 text-sky-600 hover:text-sky-700"
                  >
                    Copy to weekdays
                  </Button>
                )}
              </div>

              {!day.closed && (
                <div className="space-y-1.5 pl-6">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      {/* Open Time */}
                      <Select
                        value={slot.open}
                        onValueChange={(value) =>
                          updateTimeSlot(dayIndex, slotIndex, "open", value)
                        }
                      >
                        <SelectTrigger className="w-[110px] h-8 bg-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-gray-500 text-xs">to</span>

                      {/* Close Time */}
                      <Select
                        value={slot.close}
                        onValueChange={(value) =>
                          updateTimeSlot(dayIndex, slotIndex, "close", value)
                        }
                      >
                        <SelectTrigger className="w-[110px] h-8 bg-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Remove Slot Button */}
                      {day.slots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Add Time Slot Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="h-7 px-2 text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add hours
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-3">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Set your regular business hours. You can
              add multiple time slots per day (e.g., for lunch breaks).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
