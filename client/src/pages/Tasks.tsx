import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button, Card, Field, Input, Modal, Alert } from '@/components/ui';
import DataTable, { type Column } from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, setFilters } from '@/store/slices/tasksSlice';
import type { Task, CreateTaskInput, TaskStatus, TaskPriority } from '@/types';

const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const priorityColors: Record<TaskPriority, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Urgent: 'bg-red-100 text-red-800',
};

const statusIcons: Record<TaskStatus, typeof CheckCircle> = {
  Pending: Clock,
  'In Progress': AlertCircle,
  Completed: CheckCircle,
  Cancelled: AlertCircle,
};

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { items, status, filters, error } = useAppSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
  });

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleStatusFilter = (value: string) => {
    dispatch(setFilters({ status: value as TaskStatus | '' }));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' });
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority,
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, input: formData }));
    } else {
      await dispatch(createTask(formData));
    }
    setModalOpen(false);
    dispatch(fetchTasks(filters));
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const columns: Column<Task>[] = [
    { key: 'title', header: 'Title' },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '-',
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[row.priority]}`}
          data-icod-id="src_pages_tasks_tsx_b395">
          {row.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const Icon = statusIcons[row.status];
        return (
          <div
            className="flex items-center gap-1.5"
            data-icod-id="src_pages_tasks_tsx_6229">
            <Icon
              className={`h-4 w-4 ${row.status === 'Completed' ? 'text-green-600' : 'text-muted-foreground'}`}
              data-icod-id="src_pages_tasks_tsx_745a" />
            <span data-icod-id="src_pages_tasks_tsx_97fa">{row.status}</span>
          </div>
        );
      },
    },
    {
      key: 'assignedTo',
      header: 'Assigned',
      render: (row) => row.assignedTo?.name || '-',
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-1" data-icod-id="src_pages_tasks_tsx_c89c">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            data-icod-id="src_pages_tasks_tsx_577e">
            <Pencil className="h-4 w-4" data-icod-id="src_pages_tasks_tsx_0167" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}
            data-icod-id="src_pages_tasks_tsx_622f">
            <Trash2
              className="h-4 w-4 text-destructive"
              data-icod-id="src_pages_tasks_tsx_5d81" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_tasks_tsx_b89b">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_tasks_tsx_2a42">
        <div data-icod-id="src_pages_tasks_tsx_018f">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_tasks_tsx_1694">Tasks</h1>
          <p className="text-muted-foreground" data-icod-id="src_pages_tasks_tsx_4407">Manage your tasks and activities</p>
        </div>
        <Button onClick={openCreateModal} data-icod-id="src_pages_tasks_tsx_bfad">
          <Plus className="h-4 w-4" data-icod-id="src_pages_tasks_tsx_90d7" />
          Add Task
        </Button>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_tasks_tsx_e04e">{error}</Alert>}
      <Card
        className="flex flex-col gap-4 p-4 sm:flex-row"
        data-icod-id="src_pages_tasks_tsx_bdd5">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search tasks..."
          className="flex-1"
          data-icod-id="src_pages_tasks_tsx_605c" />
        <FilterDropdown
          value={filters.status}
          onChange={handleStatusFilter}
          options={STATUSES.map((s) => ({ label: s, value: s }))}
          placeholder="All Statuses"
          className="w-full sm:w-48"
          data-icod-id="src_pages_tasks_tsx_d960" />
      </Card>
      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="No tasks found. Create your first task to get started."
        data-icod-id="src_pages_tasks_tsx_b07a" />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              data-icod-id="src_pages_tasks_tsx_7f89">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={status === 'loading'}
              data-icod-id="src_pages_tasks_tsx_545f">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </>
        }
        data-icod-id="src_pages_tasks_tsx_4e15">
        <form className="flex flex-col gap-4" data-icod-id="src_pages_tasks_tsx_469f">
          <Field label="Title" required data-icod-id="src_pages_tasks_tsx_88a4">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-icod-id="src_pages_tasks_tsx_c902" />
          </Field>
          <Field label="Description" data-icod-id="src_pages_tasks_tsx_047b">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              data-icod-id="src_pages_tasks_tsx_7465" />
          </Field>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_tasks_tsx_c6cf">
            <Field label="Due Date" data-icod-id="src_pages_tasks_tsx_6d61">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                data-icod-id="src_pages_tasks_tsx_e949" />
            </Field>
            <Field label="Priority" data-icod-id="src_pages_tasks_tsx_7db4">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                data-icod-id="src_pages_tasks_tsx_6697">
                {PRIORITIES.map((p) => <option key={p} value={p} data-icod-id={`src_pages_tasks_tsx_1e86_${p}`}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Status" data-icod-id="src_pages_tasks_tsx_d96e">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              data-icod-id="src_pages_tasks_tsx_3d96">
              {STATUSES.map((s) => <option key={s} value={s} data-icod-id={`src_pages_tasks_tsx_b35d_${s}`}>{s}</option>)}
            </select>
          </Field>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmLabel="Delete"
        data-icod-id="src_pages_tasks_tsx_2acb" />
    </div>
  );
}
