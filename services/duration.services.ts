import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function formatDuration(seconds: number): string {
    const d = dayjs.duration(seconds, 'seconds')
  
    if (seconds >= 3600) {
      return d.format('H[h] m[m]') // e.g., 2h 5m
    } else if (seconds >= 60) {
      return d.format('m[m] s[s]') // e.g., 45m 30s
    } else {
      return d.format('s[s]') // e.g., 50s
    }
  }
