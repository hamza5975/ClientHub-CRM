import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Card, Field, Input, Modal, Alert } from '@/components/ui';
import DataTable, { type Column } from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCompanies, createCompany, updateCompany, deleteCompany, setFilters } from '@/store/slices/companiesSlice';
import type { Company, CreateCompanyInput } from '@/types';

const INDUSTRIES = ['Technology', 'Manufacturing', 'Software', 'Healthcare', 'Financial Services', 'Retail', 'Education', 'Energy', 'Marketing', 'Logistics'];

export default function Companies() {
  const dispatch = useAppDispatch();
  const { items, status, filters, error } = useAppSelector((state) => state.companies);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCompanyInput>({
    name: '',
    industry: '',
    size: '',
    website: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchCompanies(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleIndustryFilter = (value: string) => {
    dispatch(setFilters({ industry: value }));
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({ name: '', industry: '', size: '', website: '', phone: '', address: '', notes: '' });
    setModalOpen(true);
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry || '',
      size: company.size || '',
      website: company.website || '',
      phone: company.phone || '',
      address: company.address || '',
      notes: company.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      await dispatch(updateCompany({ id: editingCompany._id, input: formData }));
    } else {
      await dispatch(createCompany(formData));
    }
    setModalOpen(false);
    dispatch(fetchCompanies(filters));
  };

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      await dispatch(deleteCompany(companyToDelete));
      setDeleteConfirmOpen(false);
      setCompanyToDelete(null);
    }
  };

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Name' },
    { key: 'industry', header: 'Industry', render: (row) => row.industry || '-' },
    { key: 'size', header: 'Size', render: (row) => row.size || '-' },
    {
      key: 'website',
      header: 'Website',
      render: (row) => row.website ? <a
        href={row.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
        data-icod-id="src_pages_companies_tsx_1bfe">{row.website}</a> : '-',
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-1" data-icod-id="src_pages_companies_tsx_48fd">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            data-icod-id="src_pages_companies_tsx_a9fe">
            <Pencil className="h-4 w-4" data-icod-id="src_pages_companies_tsx_4b44" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}
            data-icod-id="src_pages_companies_tsx_0114">
            <Trash2
              className="h-4 w-4 text-destructive"
              data-icod-id="src_pages_companies_tsx_cfa3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_companies_tsx_ac50">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_companies_tsx_7766">
        <div data-icod-id="src_pages_companies_tsx_8f84">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_companies_tsx_c564">Companies</h1>
          <p
            className="text-muted-foreground"
            data-icod-id="src_pages_companies_tsx_17b1">Manage your company database</p>
        </div>
        <Button onClick={openCreateModal} data-icod-id="src_pages_companies_tsx_5bb9">
          <Plus className="h-4 w-4" data-icod-id="src_pages_companies_tsx_24e3" />
          Add Company
        </Button>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_companies_tsx_4070">{error}</Alert>}
      <Card
        className="flex flex-col gap-4 p-4 sm:flex-row"
        data-icod-id="src_pages_companies_tsx_291f">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search companies..."
          className="flex-1"
          data-icod-id="src_pages_companies_tsx_b5d9" />
        <FilterDropdown
          value={filters.industry}
          onChange={handleIndustryFilter}
          options={INDUSTRIES.map((i) => ({ label: i, value: i }))}
          placeholder="All Industries"
          className="w-full sm:w-48"
          data-icod-id="src_pages_companies_tsx_b5ae" />
      </Card>
      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="No companies found. Create your first company to get started."
        data-icod-id="src_pages_companies_tsx_d773" />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCompany ? 'Edit Company' : 'Create Company'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              data-icod-id="src_pages_companies_tsx_6577">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={status === 'loading'}
              data-icod-id="src_pages_companies_tsx_3dd4">
              {editingCompany ? 'Update' : 'Create'}
            </Button>
          </>
        }
        data-icod-id="src_pages_companies_tsx_1ec7">
        <form
          className="flex flex-col gap-4"
          data-icod-id="src_pages_companies_tsx_a149">
          <Field label="Company Name" required data-icod-id="src_pages_companies_tsx_86f2">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-icod-id="src_pages_companies_tsx_fe14" />
          </Field>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_companies_tsx_f426">
            <Field label="Industry" data-icod-id="src_pages_companies_tsx_6759">
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                data-icod-id="src_pages_companies_tsx_9584">
                <option value="" data-icod-id="src_pages_companies_tsx_b50b">Select Industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i} data-icod-id={`src_pages_companies_tsx_ef4d_${i}`}>{i}</option>)}
              </select>
            </Field>
            <Field label="Size" data-icod-id="src_pages_companies_tsx_10db">
              <Input
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 50-200"
                data-icod-id="src_pages_companies_tsx_5f99" />
            </Field>
          </div>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_companies_tsx_0751">
            <Field label="Website" data-icod-id="src_pages_companies_tsx_e49f">
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
                data-icod-id="src_pages_companies_tsx_6ac1" />
            </Field>
            <Field label="Phone" data-icod-id="src_pages_companies_tsx_7b56">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-icod-id="src_pages_companies_tsx_b73f" />
            </Field>
          </div>
          <Field label="Address" data-icod-id="src_pages_companies_tsx_4d98">
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              data-icod-id="src_pages_companies_tsx_11d1" />
          </Field>
          <Field label="Notes" data-icod-id="src_pages_companies_tsx_4a2e">
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              data-icod-id="src_pages_companies_tsx_1675" />
          </Field>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Company"
        message="Are you sure you want to delete this company?"
        confirmLabel="Delete"
        data-icod-id="src_pages_companies_tsx_9c41" />
    </div>
  );
}
