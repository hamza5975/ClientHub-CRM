import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Card, Field, Input, Modal, Alert } from '@/components/ui';
import DataTable, { type Column } from '@/components/DataTable';
import StageBadge from '@/components/StageBadge';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLeads, createLead, updateLead, deleteLead, setFilters } from '@/store/slices/leadsSlice';
import type { Lead, CreateLeadInput, LeadStage } from '@/types';

const STAGES: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function Leads() {
  const dispatch = useAppDispatch();
  const { items, status, filters, error } = useAppSelector((state) => state.leads);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateLeadInput>({
    title: '',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    stage: 'New',
    value: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchLeads(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleStageFilter = (value: string) => {
    dispatch(setFilters({ stage: value as LeadStage | '' }));
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setFormData({
      title: '',
      company: '',
      contactName: '',
      email: '',
      phone: '',
      stage: 'New',
      value: 0,
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      title: lead.title,
      company: lead.company,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone || '',
      stage: lead.stage,
      value: lead.value,
      notes: lead.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      await dispatch(updateLead({ id: editingLead._id, input: formData }));
    } else {
      await dispatch(createLead(formData));
    }
    setModalOpen(false);
    dispatch(fetchLeads(filters));
  };

  const handleDeleteClick = (id: string) => {
    setLeadToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (leadToDelete) {
      await dispatch(deleteLead(leadToDelete));
      setDeleteConfirmOpen(false);
      setLeadToDelete(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const columns: Column<Lead>[] = [
    { key: 'title', header: 'Title' },
    { key: 'company', header: 'Company' },
    { key: 'contactName', header: 'Contact' },
    {
      key: 'stage',
      header: 'Stage',
      render: (row) => <StageBadge stage={row.stage} data-icod-id="src_pages_leads_tsx_3d99" />,
    },
    {
      key: 'value',
      header: 'Value',
      render: (row) => formatCurrency(row.value),
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
        <div className="flex gap-1" data-icod-id="src_pages_leads_tsx_21ad">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            data-icod-id="src_pages_leads_tsx_03f5">
            <Pencil className="h-4 w-4" data-icod-id="src_pages_leads_tsx_4021" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}
            data-icod-id="src_pages_leads_tsx_01ac">
            <Trash2
              className="h-4 w-4 text-destructive"
              data-icod-id="src_pages_leads_tsx_2fbc" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_leads_tsx_9a60">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_leads_tsx_b4b5">
        <div data-icod-id="src_pages_leads_tsx_51e9">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_leads_tsx_1c92">Leads</h1>
          <p className="text-muted-foreground" data-icod-id="src_pages_leads_tsx_c5bb">Manage your sales leads</p>
        </div>
        <Button onClick={openCreateModal} data-icod-id="src_pages_leads_tsx_495f">
          <Plus className="h-4 w-4" data-icod-id="src_pages_leads_tsx_c815" />
          Add Lead
        </Button>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_leads_tsx_802b">{error}</Alert>}
      <Card
        className="flex flex-col gap-4 p-4 sm:flex-row"
        data-icod-id="src_pages_leads_tsx_c30d">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search leads..."
          className="flex-1"
          data-icod-id="src_pages_leads_tsx_0f18" />
        <FilterDropdown
          value={filters.stage}
          onChange={handleStageFilter}
          options={STAGES.map((s) => ({ label: s, value: s }))}
          placeholder="All Stages"
          className="w-full sm:w-48"
          data-icod-id="src_pages_leads_tsx_42c8" />
      </Card>
      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="No leads found. Create your first lead to get started."
        data-icod-id="src_pages_leads_tsx_56b1" />
      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLead ? 'Edit Lead' : 'Create Lead'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              data-icod-id="src_pages_leads_tsx_3797">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={status === 'loading'}
              data-icod-id="src_pages_leads_tsx_9a6f">
              {editingLead ? 'Update' : 'Create'}
            </Button>
          </>
        }
        data-icod-id="src_pages_leads_tsx_1b7e">
        <form className="flex flex-col gap-4" data-icod-id="src_pages_leads_tsx_cf50">
          <Field label="Title" required data-icod-id="src_pages_leads_tsx_5e54">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-icod-id="src_pages_leads_tsx_d8fb" />
          </Field>
          <Field label="Company" required data-icod-id="src_pages_leads_tsx_06df">
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              data-icod-id="src_pages_leads_tsx_edd2" />
          </Field>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_leads_tsx_3b15">
            <Field label="Contact Name" required data-icod-id="src_pages_leads_tsx_fac9">
              <Input
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
                data-icod-id="src_pages_leads_tsx_56f6" />
            </Field>
            <Field label="Email" required data-icod-id="src_pages_leads_tsx_d8f9">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-icod-id="src_pages_leads_tsx_414e" />
            </Field>
          </div>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_leads_tsx_c9f5">
            <Field label="Phone" data-icod-id="src_pages_leads_tsx_0309">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-icod-id="src_pages_leads_tsx_0a8d" />
            </Field>
            <Field label="Value" data-icod-id="src_pages_leads_tsx_a90d">
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                data-icod-id="src_pages_leads_tsx_7622" />
            </Field>
          </div>
          <Field label="Stage" data-icod-id="src_pages_leads_tsx_0fda">
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as LeadStage })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              data-icod-id="src_pages_leads_tsx_0d3f">
              {STAGES.map((s) => <option key={s} value={s} data-icod-id={`src_pages_leads_tsx_2318_${s}`}>{s}</option>)}
            </select>
          </Field>
          <Field label="Notes" data-icod-id="src_pages_leads_tsx_6488">
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              data-icod-id="src_pages_leads_tsx_2009" />
          </Field>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        data-icod-id="src_pages_leads_tsx_d00b" />
    </div>
  );
}
