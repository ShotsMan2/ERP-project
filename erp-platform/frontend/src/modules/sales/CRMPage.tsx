import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { KanbanBoard } from '@/components/data/KanbanBoard';

const initialColumns = [
  { id: 'new', title: 'New Leads', color: '#1677ff', cards: [
    { id: '1', title: 'ABC Corp', description: 'Interested in ERP solution', priority: 'high' as const, assignee: { name: 'John' }, dueDate: '2026-08-01' },
    { id: '2', title: 'XYZ Ltd', description: 'Requested demo', priority: 'medium' as const, tags: ['demo'] },
  ]},
  { id: 'contacted', title: 'Contacted', color: '#722ed1', cards: [
    { id: '3', title: 'TechStart Inc', description: 'Meeting scheduled', priority: 'high' as const, assignee: { name: 'Jane' }, tags: ['meeting'] },
  ]},
  { id: 'qualified', title: 'Qualified', color: '#13c2c2', cards: [
    { id: '4', title: 'GlobalTrade Co', description: 'Good fit, sent proposal', priority: 'medium' as const, assignee: { name: 'John' } },
  ]},
  { id: 'proposal', title: 'Proposal', color: '#faad14', cards: [
    { id: '5', title: 'MegaCorp', description: 'Proposal under review', priority: 'critical' as const, assignee: { name: 'Jane' }, dueDate: '2026-07-28' },
  ]},
  { id: 'negotiation', title: 'Negotiation', color: '#fa8c16', cards: [] },
  { id: 'closed', title: 'Closed Won', color: '#52c41a', cards: [] },
];

export default function CRMPage() {
  const [columns] = useState(initialColumns);

  return (
    <div>
      <PageHeader title="CRM Pipeline" subtitle="Manage leads and opportunities" onAdd={() => {}} addLabel="Add Lead" />
      <KanbanBoard columns={columns} onCardClick={(card) => console.log('Card clicked:', card)} />
    </div>
  );
}
