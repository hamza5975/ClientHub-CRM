import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Card, Field, Input, Modal, Alert } from '@/components/ui';
import DataTable, { type Column } from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContacts, createContact, updateContact, deleteContact, setFilters } from '@/store/slices/contactsSlice';
import type { Contact, CreateContactInput } from '@/types';

export default function Contacts() {
  const dispatch = useAppDispatch();
  const { items, status, filters, error } = useAppSelector((state) => state.contacts);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateContactInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchContacts(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const openCreateModal = () => {
    setEditingContact(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', position: '', notes: '' });
    setModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      notes: contact.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      await dispatch(updateContact({ id: editingContact._id, input: formData }));
    } else {
      await dispatch(createContact(formData));
    }
    setModalOpen(false);
    dispatch(fetchContacts(filters));
  };

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (contactToDelete) {
      await dispatch(deleteContact(contactToDelete));
      setDeleteConfirmOpen(false);
      setContactToDelete(null);
    }
  };

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (row) => row.phone || '-' },
    { key: 'company', header: 'Company', render: (row) => row.company || '-' },
    { key: 'position', header: 'Position', render: (row) => row.position || '-' },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-1" data-icod-id="src_pages_contacts_tsx_660b">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
            data-icod-id="src_pages_contacts_tsx_a743">
            <Pencil className="h-4 w-4" data-icod-id="src_pages_contacts_tsx_2191" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id); }}
            data-icod-id="src_pages_contacts_tsx_2448">
            <Trash2
              className="h-4 w-4 text-destructive"
              data-icod-id="src_pages_contacts_tsx_92ab" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_contacts_tsx_b423">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_contacts_tsx_8f55">
        <div data-icod-id="src_pages_contacts_tsx_dcad">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_contacts_tsx_19b5">Contacts</h1>
          <p
            className="text-muted-foreground"
            data-icod-id="src_pages_contacts_tsx_2fcb">Manage your contacts</p>
        </div>
        <Button onClick={openCreateModal} data-icod-id="src_pages_contacts_tsx_b2ed">
          <Plus className="h-4 w-4" data-icod-id="src_pages_contacts_tsx_d7e7" />
          Add Contact
        </Button>
      </div>
      {error && <Alert variant="error" data-icod-id="src_pages_contacts_tsx_2755">{error}</Alert>}
      <Card className="p-4" data-icod-id="src_pages_contacts_tsx_555e">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search contacts..."
          data-icod-id="src_pages_contacts_tsx_205f" />
      </Card>
      <DataTable
        data={items}
        columns={columns}
        loading={status === 'loading'}
        emptyMessage="No contacts found. Create your first contact to get started."
        data-icod-id="src_pages_contacts_tsx_c0ef" />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Create Contact'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              data-icod-id="src_pages_contacts_tsx_3800">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={status === 'loading'}
              data-icod-id="src_pages_contacts_tsx_468e">
              {editingContact ? 'Update' : 'Create'}
            </Button>
          </>
        }
        data-icod-id="src_pages_contacts_tsx_9a17">
        <form
          className="flex flex-col gap-4"
          data-icod-id="src_pages_contacts_tsx_9249">
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_contacts_tsx_87b7">
            <Field label="First Name" required data-icod-id="src_pages_contacts_tsx_02c9">
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                data-icod-id="src_pages_contacts_tsx_45a1" />
            </Field>
            <Field label="Last Name" required data-icod-id="src_pages_contacts_tsx_e3bf">
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                data-icod-id="src_pages_contacts_tsx_2093" />
            </Field>
          </div>
          <Field label="Email" required data-icod-id="src_pages_contacts_tsx_e235">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-icod-id="src_pages_contacts_tsx_c35c" />
          </Field>
          <div
            className="grid gap-4 sm:grid-cols-2"
            data-icod-id="src_pages_contacts_tsx_a6fe">
            <Field label="Phone" data-icod-id="src_pages_contacts_tsx_c324">
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-icod-id="src_pages_contacts_tsx_4556" />
            </Field>
            <Field label="Company" data-icod-id="src_pages_contacts_tsx_1de2">
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                data-icod-id="src_pages_contacts_tsx_acf5" />
            </Field>
          </div>
          <Field label="Position" data-icod-id="src_pages_contacts_tsx_4b69">
            <Input
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              data-icod-id="src_pages_contacts_tsx_7734" />
          </Field>
          <Field label="Notes" data-icod-id="src_pages_contacts_tsx_7c7a">
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              data-icod-id="src_pages_contacts_tsx_9e18" />
          </Field>
        </form>
      </Modal>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message="Are you sure you want to delete this contact?"
        confirmLabel="Delete"
        data-icod-id="src_pages_contacts_tsx_4cdb" />
    </div>
  );
}
