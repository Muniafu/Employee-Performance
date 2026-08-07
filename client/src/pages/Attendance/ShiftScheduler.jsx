import { CalendarDays } from 'lucide-react';

export default function ShiftScheduler() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-content">
          <CalendarDays
            size={28}
            color="var(--color-primary)"
          />

          <h1 className="page-title">
            Shift Scheduler
          </h1>
        </div>
      </div>

      <div className="card card-body empty-state">
        <div className="empty-icon flex-center">
          <CalendarDays
            size={52}
            color="var(--color-primary)"
          />
        </div>

        <h3>Shift Scheduling</h3>

        <p>
          Shift scheduling module —
          configure team rosters and
          working patterns here.
        </p>
      </div>
    </div>
  );
}