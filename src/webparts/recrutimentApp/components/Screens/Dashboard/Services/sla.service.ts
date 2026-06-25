import { SLAStats } from "../Types";

const MOCK_SLA_STATS: SLAStats = {
  overallSla: 78,
  onTrack: 25,
  dueSoon: 47,
  overdue: 20,
  avgCompletionTime: 42, // Average hiring/contract completion time in days
  avgDaysRemaining: 38
};

export class SlaService {
  public static async getSlaStats(): Promise<SLAStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_SLA_STATS);
      }, 300);
    });
  }
}
