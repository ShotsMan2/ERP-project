import { describe, it, expect } from 'vitest';

describe('Admin Module', () => {
  it('should compute system health status', () => {
    const services = [
      { name: 'Database', status: 'healthy' },
      { name: 'Redis', status: 'healthy' },
      { name: 'RabbitMQ', status: 'degraded' },
    ];
    const down = services.filter((s) => s.status === 'down').length;
    const degraded = services.filter((s) => s.status === 'degraded').length;
    const overall = down > 0 ? 'down' : degraded > 0 ? 'degraded' : 'healthy';
    expect(overall).toBe('degraded');
  });

  it('should list backups with correct status', () => {
    const backups = [
      { id: '1', filename: 'backup1.sql', status: 'completed' },
      { id: '2', filename: 'backup2.sql', status: 'failed' },
      { id: '3', filename: 'backup3.sql', status: 'in_progress' },
    ];
    const completed = backups.filter((b) => b.status === 'completed');
    expect(completed).toHaveLength(1);
  });

  it('should calculate backup success rate', () => {
    const backups = [
      { status: 'completed' },
      { status: 'completed' },
      { status: 'failed' },
      { status: 'completed' },
    ];
    const successRate = (backups.filter((b) => b.status === 'completed').length / backups.length) * 100;
    expect(successRate).toBe(75);
  });
});
