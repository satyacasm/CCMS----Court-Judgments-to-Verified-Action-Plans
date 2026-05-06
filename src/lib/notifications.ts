import { DEMO_ACTIONS, DEMO_JUDGMENTS } from './demo-data';

export type NotificationType = 'overdue' | 'due_soon' | 'pending_review' | 'completed' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  actionId?: string;
  judgmentId?: string;
  caseNumber?: string;
  department?: string;
  createdAt: string;
  read: boolean;
}

function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateNotifications(): AppNotification[] {
  const notifs: AppNotification[] = [];

  // Overdue actions
  DEMO_ACTIONS.filter((a) => a.status === 'overdue').forEach((a) => {
    notifs.push({
      id: `notif-overdue-${a.id}`,
      type: 'overdue',
      title: 'Directive Overdue',
      body: `${a.department}: "${a.directive_text.slice(0, 90)}…" passed its deadline of ${a.deadline_raw}.`,
      actionId: a.id,
      judgmentId: a.judgment_id,
      caseNumber: a.judgment?.case_number,
      department: a.department,
      createdAt: a.deadline_iso + 'T00:00:00Z',
      read: false,
    });
  });

  // Due within 60 days and not completed/overdue
  DEMO_ACTIONS.filter((a) => {
    if (!a.deadline_iso) return false;
    if (['completed', 'overdue'].includes(a.status)) return false;
    const days = daysUntil(a.deadline_iso);
    return days >= 0 && days <= 60;
  }).forEach((a) => {
    const days = daysUntil(a.deadline_iso!);
    notifs.push({
      id: `notif-soon-${a.id}`,
      type: 'due_soon',
      title: days <= 7 ? 'Deadline in Under 1 Week' : `Deadline in ${days} days`,
      body: `${a.department}: "${a.directive_text.slice(0, 90)}…" due ${a.deadline_raw}.`,
      actionId: a.id,
      judgmentId: a.judgment_id,
      caseNumber: a.judgment?.case_number,
      department: a.department,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
    });
  });

  // Pending verification actions
  DEMO_ACTIONS.filter((a) => a.status === 'pending_verification').forEach((a) => {
    notifs.push({
      id: `notif-verify-${a.id}`,
      type: 'pending_review',
      title: 'Verification Required',
      body: `${a.department}: "${a.directive_text.slice(0, 90)}…" is awaiting human verification.`,
      actionId: a.id,
      judgmentId: a.judgment_id,
      caseNumber: a.judgment?.case_number,
      department: a.department,
      createdAt: a.created_at,
      read: false,
    });
  });

  // Extracting judgments
  DEMO_JUDGMENTS.filter((j) => j.status === 'extracting').forEach((j) => {
    notifs.push({
      id: `notif-extract-${j.id}`,
      type: 'system',
      title: 'Extraction in Progress',
      body: `${j.case_number}: "${j.case_title}" is being processed by the AI extraction pipeline.`,
      judgmentId: j.id,
      caseNumber: j.case_number,
      createdAt: j.created_at,
      read: false,
    });
  });

  // Recently completed (last 5)
  const recent = DEMO_ACTIONS
    .filter((a) => a.status === 'completed' && a.verified_at)
    .slice(0, 3);
  recent.forEach((a) => {
    notifs.push({
      id: `notif-done-${a.id}`,
      type: 'completed',
      title: 'Directive Completed',
      body: `${a.department}: "${a.directive_text.slice(0, 90)}…" marked as completed.`,
      actionId: a.id,
      judgmentId: a.judgment_id,
      caseNumber: a.judgment?.case_number,
      department: a.department,
      createdAt: a.verified_at!,
      read: true,
    });
  });

  // Sort: unread first, then by date desc
  return notifs.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export const INITIAL_NOTIFICATIONS = generateNotifications();
export const INITIAL_UNREAD_COUNT = INITIAL_NOTIFICATIONS.filter((n) => !n.read).length;
