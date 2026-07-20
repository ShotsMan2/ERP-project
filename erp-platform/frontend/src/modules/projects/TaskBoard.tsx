import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KanbanBoard } from '@/components/data/KanbanBoard';

const initialColumns = [
  { id: 'todo', title: 'To Do', color: '#1677ff', cards: [
    { id: '1', title: 'Design database schema', priority: 'high' as const, assignee: { name: 'John' }, dueDate: '2026-07-25', tags: ['backend'] },
    { id: '2', title: 'Create API endpoints', priority: 'high' as const, assignee: { name: 'John' }, tags: ['backend'] },
    { id: '3', title: 'Setup CI/CD pipeline', priority: 'medium' as const, assignee: { name: 'Jane' }, tags: ['devops'] },
  ]},
  { id: 'in_progress', title: 'In Progress', color: '#faad14', cards: [
    { id: '4', title: 'Implement authentication', priority: 'critical' as const, assignee: { name: 'Jane' }, dueDate: '2026-07-22', tags: ['security'] },
  ]},
  { id: 'review', title: 'Review', color: '#722ed1', cards: [] },
  { id: 'done', title: 'Done', color: '#52c41a', cards: [
    { id: '5', title: 'Project setup', priority: 'low' as const, assignee: { name: 'John' }, tags: ['setup'] },
  ]},
];

export default function TaskBoard() {
  const [columns] = useState(initialColumns);

  return (
    <div>
      <PageHeader title="Task Board" subtitle="Kanban task management" onAdd={() => {}} addLabel="Add Task" />
      <KanbanBoard columns={columns} />
    </div>
  );
}
