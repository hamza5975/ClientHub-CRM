import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, LayoutGrid, List } from 'lucide-react';
import { Button, Card, Field, Input, Modal, Alert } from '@/components/ui';
import DataTable, { type Column } from '@/components/DataTable';
import StageBadge from '@/components/StageBadge';
import SearchBar from '@/components/SearchBar';
import KanbanBoard from '@/components/KanbanBoard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeals, createDeal, updateDeal, deleteDeal, setFilters } from '@/store/slices/dealsSlice';
import type { Deal, CreateDealInput, DealStage } from '@/types';

const STAGES: DealStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function Deals() {
  const dispatch = useAppDispatch();
  const { items, status, filters, error } = useAppSelector((state) => state.deals);

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateDealInput>({
    title: '',
    company: '',
    value: 0,
    stage: 'New',
    probability: 50,
    expectedCloseDate: '',
  });

  useEffect(() => {
    dispatch(fetchDeals(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleDealMove = async (dealId: string, newStage: DealStage) => {
    await dispatch(updateDeal({ id: dealId, input: { stage: newStage } }));
    dispatch(fetchDeals(filters));
  };

  const openCreateModal = () => {
    setEditingDeal(null);
    setFormData({ title: '', company: '', value: 0, stage: 'New', probability: 50, expectedCloseDate: '' });
    setModalOpen(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      company: deal.company,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      await dispatch(updateDeal({ id: editingDeal._id, input: formData }));
    } else {
      await dispatch(createDeal(formData));
    }
    setModalOpen(false);
    dispatch(fetchDeals(filters));
  };

  const handleDeleteClick = (id: string) => {
    setDealToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (dealToDelete) {
      await dispatch(deleteDeal(dealToDelete));
      setDeleteConfirmOpen(false);
      setDealToDelete(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const columns: Column<Deal>[] = [
    { key: 'title', header: 'Title' },
    { key: 'company', header: 'Company' },
    {
      key: 'stage',
      header: 'Stage',
      render: (row) => <StageBadge stage={row.stage} data-icod-id="src_pages_deals_tsx_16a1" />,
    },
    {
      key: 'value',
      header: 'Value',
      render: (row) => formatCurrency(row.value),
    },
    {
      key: 'probability',
      header: 'Probability',
      render: (row) => `${row.probability}%`,
    },
    {
      key: 'expectedCloseDate',
      header: 'Close Date',
      render: (row) => row.expectedCloseDate ? new Date(row.expectedCloseDate).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-1" data-icod-id="src_pages_deals_tsx_b33d">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            data-icod-id="src_pages_deals_tsx_a612">
            <Pencil className="h-4 w-4" data-icod-id="src_pages_deals_tsx_639e" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}
            data-icod-id="src_pages_deals_tsx_1e63">
            <Trash2
              className="h-4 w-4 text-destructive"
              data-icod-id="src_pages_deals_tsx_1091" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_deals_tsx_389b">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_deals_tsx_afe4">
        <div data-icod-id="src_pages_deals_tsx_bd30">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_deals_tsx_50c7">Deals</h1>
          <p className="text-muted-foreground" data-icod-id="src_pages_deals_tsx_c106">Manage your sales pipeline</p>
        </div>
        <div className="flex gap-2" data-icod-id="src_pages_deals_tsx_55df">
          <Button
            variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            data-icod-id="src_pages_deals_tsx_6d62">
            <LayoutGrid className="h-4 w-4" data-icod-id="src_pages_deals_tsx_e5d7" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
            data-icod-id="src_pages_deals_tsx_6113">
            <List className="h-4 w-4" data-icod-id="src_pages_deals_tsx_69f3" />
            List
          </Button>
          <Button onClick={openCreateModal} data-icod-id="src_pages_deals_tsx_aad7">
            <Plus className="h-4 w-4" data-icod-id="src_pages_deals_tsx_994e" />
            Add Deal
          </Button>
        </div>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_deals_tsx_092a">{error}</Alert>}
      <Card className="p-4" data-icod-id="src_pages_deals_tsx_296c">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search deals..."
          data-icod-id="src_pages_deals_tsx_1e58" />
      </Card>
      {viewMode === 'kanban' ? (
        <KanbanBoard
          deals={items}
          onDealMove={handleDealMove}
          onDealClick={openEditModal}
          data-icod-id="src_pages_deals_tsx_0b6c" />
      ) : (
        <DataTable
          data={items}
          columns={columns}
          loading={status === 'loading'}
          emptyMessage="No deals found. Create your first deal to get started."
          data-icod-id="src_pages_deals_tsx_8df5" />
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDeal ? 'Edit Deal' : 'Create Deal'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              data-icod-id="src_pages_deals_tsx_4701">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={status === 'loading'}
              data-icod-id="src_pages_deals_tsx_d895">
              {editingDeal ? 'Update' : 'Create'}
            </Button>
          </>
        }
        data-icod-id="src_pages_deals_tsx_14b1">
        <form className="flex flex-col gap-4" data-icod-id="src_pages_deals_tsx_16ad">
          <Field label="Title" required data-icod-id="src_pages_deals_tsx_b17f">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-icod-id="src_pages_deals_tsx_f764" />
          </Field>
          <Field label="Company" required data-icod-id="src_pages_deals_tsx_e69b">
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              data-icod-id="src_pages_deals_tsx_8277" />
          </Field>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_deals_tsx_e684">
            <Field label="Value" data-icod-id="src_pages_deals_tsx_306a">
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                data-icod-id="src_pages_deals_tsx_fa19" />
            </Field>
            <Field label="Probability (%)" data-icod-id="src_pages_deals_tsx_7e46">
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                data-icod-id="src_pages_deals_tsx_2b67" />
            </Field>
          </div>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_deals_tsx_5ef2">
            <Field label="Stage" data-icod-id="src_pages_deals_tsx_d778">
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                data-icod-id="src_pages_deals_tsx_50e8">
                {STAGES.map((s) => <option key={s} value={s} data-icod-id={`src_pages_deals_tsx_023d_${s}`}>{s}</option>)}
              </select>
            </Field>
            <Field label="Expected Close Date" data-icod-id="src_pages_deals_tsx_15b3">
              <Input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                data-icod-id="src_pages_deals_tsx_a9a1" />
            </Field>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Deal"
        message="Are you sure you want to delete this deal?"
        confirmLabel="Delete"
        data-icod-id="src_pages_deals_tsx_8c25" />
    </div>
  );
}
