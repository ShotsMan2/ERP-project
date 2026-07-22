import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { KanbanBoard } from '@/components/data/KanbanBoard';

export default function TaskBoard() {
  const { t } = useTranslation();

  const initialColumns = [
    { id: 'todo', title: t('projects.taskBoardPage.todo'), color: '#1677ff', cards: [
      { id: '1', title: 'Design database schema', priority: 'high' as const, assignee: { name: 'John' }, dueDate: '2026-07-25', tags: ['backend'] },
      { id: '2', title: 'Create API endpoints', priority: 'high' as const, assignee: { name: 'John' }, tags: ['backend'] },
      { id: '3', title: 'Setup CI/CD pipeline', priority: 'medium' as const, assignee: { name: 'Jane' }, tags: ['devops'] },
    ]},
    { id: 'in_progress', title: t('projects.taskBoardPage.inProgress'), color: '#faad14', cards: [
      { id: '4', title: 'Implement authentication', priority: 'critical' as const, assignee: { name: 'Jane' }, dueDate: '2026-07-22', tags: ['security'] },
    ]},
    { id: 'review', title: t('projects.taskBoardPage.review'), color: '#722ed1', cards: [] },
    { id: 'done', title: t('projects.taskBoardPage.done'), color: '#52c41a', cards: [
      { id: '5', title: 'Project setup', priority: 'low' as const, assignee: { name: 'John' }, tags: ['setup'] },
    ]},
  ];

  const [columns] = useState(initialColumns);

  return (
    <div>
      <PageHeader title={t('projects.taskBoardPage.title')} subtitle={t('projects.taskBoardPage.subtitle')} onAdd={() => {}} addLabel={t('projects.taskBoardPage.addTask')} />
      <KanbanBoard columns={columns} />
    </div>
  );
}
