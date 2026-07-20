import { useState } from 'react';
import { Card, Button, Tag, Avatar, Typography, Badge, Space, message, Dropdown } from 'antd';
import { PlusOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons';
import PageHeader from '@/components/ui/PageHeader';
const { Text } = Typography;

const columns = [
  { id: 'todo', title: 'To Do', color: '#8c8c8c' },
  { id: 'in_progress', title: 'In Progress', color: '#1677ff' },
  { id: 'review', title: 'Review', color: '#faad14' },
  { id: 'done', title: 'Done', color: '#52c41a' },
];

interface TaskItem { id: string; title: string; priority: string; assignee: string; dueDate: string; }
const initialTasks: Record<string, TaskItem[]> = {
  todo: [
    { id: 't1', title: 'User research interviews', priority: 'Medium', assignee: 'Emily Davis', dueDate: '2025-02-01' },
    { id: 't2', title: 'Wireframe creation', priority: 'High', assignee: 'Emily Davis', dueDate: '2025-02-15' },
  ],
  in_progress: [
    { id: 't3', title: 'API endpoint development', priority: 'High', assignee: 'John Smith', dueDate: '2024-12-30' },
    { id: 't4', title: 'Frontend dashboard UI', priority: 'Medium', assignee: 'Emily Davis', dueDate: '2025-01-15' },
  ],
  review: [
    { id: 't5', title: 'Code review - auth module', priority: 'High', assignee: 'John Smith', dueDate: '2024-12-20' },
  ],
  done: [
    { id: 't6', title: 'Database schema design', priority: 'High', assignee: 'John Smith', dueDate: '2024-10-15' },
  ],
};

const priorityColors: Record<string, string> = { Low: 'default', Medium: 'blue', High: 'orange', Critical: 'red' };

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (task: TaskItem, targetCol: string) => {
    const newTasks = { ...tasks };
    for (const col of columns) { newTasks[col.id] = newTasks[col.id].filter((t) => t.id !== task.id); }
    newTasks[targetCol] = [...newTasks[targetCol], task];
    setTasks(newTasks);
    message.success('Task moved to ' + columns.find((c) => c.id === targetCol)?.title);
  };

  const taskActions = (task: TaskItem) => columns.filter((c) => !tasks[c.id].includes(task)).map((c) => ({
    key: c.id, label: 'Move to ' + c.title, onClick: () => moveTask(task, c.id),
  }));

  return (
    <div className="p-6">
      <PageHeader title="Task Board" subtitle="Kanban-style task management">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Opening new task form')}>Add Task</Button>
      </PageHeader>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[260px] flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Badge color={col.color} /><Text strong>{col.title}</Text><Tag>{tasks[col.id].length}</Tag></div>
            </div>
            <div className="space-y-3">
              {tasks[col.id].map((task) => (
                <Card key={task.id} size="small" className="cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <Text strong className="text-sm">{task.title}</Text>
                    <Dropdown menu={{ items: taskActions(task) }} trigger={['click']}>
                      <Button type="text" size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <Space><Avatar icon={<UserOutlined />} size={20} /><Text type="secondary" className="text-xs">{task.assignee}</Text></Space>
                    <Text type="secondary" className="text-xs">{task.dueDate}</Text>
                  </div>
                </Card>
              ))}
              {tasks[col.id].length === 0 && <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center"><Text type="secondary" className="text-sm">No tasks</Text></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TaskBoard;
