import { useState, useCallback } from 'react';
import { Card, Typography, Badge, Avatar, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: { name: string; avatar?: string };
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard) => void;
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
}

const priorityColors: Record<string, string> = {
  low: 'default',
  medium: 'blue',
  high: 'orange',
  critical: 'red',
};

export function KanbanBoard({ columns, onCardClick, onCardMove }: KanbanBoardProps) {
  const [boardColumns, setBoardColumns] = useState(columns);

  const handleDragStart = (e: React.DragEvent, cardId: string, fromColumn: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('fromColumn', fromColumn);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, toColumn: string) => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('cardId');
      const fromColumn = e.dataTransfer.getData('fromColumn');
      if (fromColumn === toColumn) return;

      setBoardColumns((prev) => {
        const newColumns = prev.map((col) => ({ ...col, cards: [...col.cards] }));
        const fromCol = newColumns.find((c) => c.id === fromColumn);
        const toCol = newColumns.find((c) => c.id === toColumn);
        if (!fromCol || !toCol) return prev;
        const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;
        const [movedCard] = fromCol.cards.splice(cardIndex, 1);
        toCol.cards.push(movedCard);
        return newColumns;
      });
      onCardMove?.(cardId, fromColumn, toColumn);
    },
    [onCardMove]
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {boardColumns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
              <Text strong>{column.title}</Text>
            </div>
            <Badge count={column.cards.length} style={{ backgroundColor: column.color }} />
          </div>
          <div className="space-y-2 min-h-[100px]">
            {column.cards.map((card) => (
              <Card
                key={card.id}
                size="small"
                className="shadow-sm cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                onClick={() => onCardClick?.(card)}
                actions={[
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="delete" />,
                ]}
              >
                {card.priority && (
                  <Badge status={priorityColors[card.priority] as any} className="mb-1" />
                )}
                <Text strong className="text-sm block mb-1">{card.title}</Text>
                {card.description && (
                  <Text type="secondary" className="text-xs block mb-2 line-clamp-2">
                    {card.description}
                  </Text>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {card.tags?.map((tag) => (
                      <Text key={tag} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {tag}
                      </Text>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {card.dueDate && (
                      <Tooltip title={card.dueDate}>
                        <ClockCircleOutlined className="text-xs text-gray-400" />
                      </Tooltip>
                    )}
                    {card.assignee && (
                      <Avatar size={20} icon={<UserOutlined />} src={card.assignee.avatar}>
                        {card.assignee.name.charAt(0)}
                      </Avatar>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
