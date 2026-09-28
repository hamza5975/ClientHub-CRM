import { useState } from 'react';
import { User, Lock, Bell, Users, Save } from 'lucide-react';
import { Card, Button, Field, Input, Alert } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';

export default function Settings() {
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'team'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile updated successfully' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setMessage({ type: 'success', text: 'Password changed successfully' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(user?.role === 'Admin' ? [{ id: 'team', label: 'Team', icon: Users }] : []),
  ] as const;

  return (
    <div className="space-y-6" data-icod-id="src_pages_settings_tsx_13f4">
      <div data-icod-id="src_pages_settings_tsx_25cc">
        <h1
          className="text-2xl font-bold text-foreground"
          data-icod-id="src_pages_settings_tsx_8dc7">Settings</h1>
        <p
          className="text-muted-foreground"
          data-icod-id="src_pages_settings_tsx_39de">Manage your account preferences</p>
      </div>
      {message && (
        <Alert variant={message.type} data-icod-id="src_pages_settings_tsx_1cd2">
          {message.text}
        </Alert>
      )}
      <div
        className="grid gap-6 lg:grid-cols-4"
        data-icod-id="src_pages_settings_tsx_1f01">
        {/* Sidebar */}
        <Card className="lg:col-span-1" data-icod-id="src_pages_settings_tsx_c4a8">
          <nav
            className="flex flex-col gap-1 p-2"
            data-icod-id="src_pages_settings_tsx_681f">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                data-icod-id={`src_pages_settings_tsx_8e63_${tab.id}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <Card className="p-6 lg:col-span-3" data-icod-id="src_pages_settings_tsx_3650">
          {activeTab === 'profile' && (
            <div className="space-y-6" data-icod-id="src_pages_settings_tsx_aa76">
              <div data-icod-id="src_pages_settings_tsx_24f0">
                <h2
                  className="text-lg font-semibold text-foreground"
                  data-icod-id="src_pages_settings_tsx_23e8">Profile Settings</h2>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id="src_pages_settings_tsx_b16f">Update your personal information</p>
              </div>

              <form
                onSubmit={handleProfileSave}
                className="max-w-md space-y-4"
                data-icod-id="src_pages_settings_tsx_9c61">
                <Field label="Full Name" data-icod-id="src_pages_settings_tsx_a55c">
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    data-icod-id="src_pages_settings_tsx_5259" />
                </Field>
                <Field label="Email" data-icod-id="src_pages_settings_tsx_cd6e">
                  <Input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="opacity-60"
                    data-icod-id="src_pages_settings_tsx_3cea" />
                </Field>
                <Field label="Role" data-icod-id="src_pages_settings_tsx_b317">
                  <Input
                    value={user?.role || ''}
                    disabled
                    className="opacity-60"
                    data-icod-id="src_pages_settings_tsx_96b9" />
                </Field>
                <Button type="submit" data-icod-id="src_pages_settings_tsx_a4b3">
                  <Save className="h-4 w-4" data-icod-id="src_pages_settings_tsx_0689" />
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6" data-icod-id="src_pages_settings_tsx_549d">
              <div data-icod-id="src_pages_settings_tsx_c508">
                <h2
                  className="text-lg font-semibold text-foreground"
                  data-icod-id="src_pages_settings_tsx_8333">Change Password</h2>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id="src_pages_settings_tsx_2b5c">Update your password to keep your account secure</p>
              </div>

              <form
                onSubmit={handlePasswordSave}
                className="max-w-md space-y-4"
                data-icod-id="src_pages_settings_tsx_5209">
                <Field
                  label="Current Password"
                  required
                  data-icod-id="src_pages_settings_tsx_0b8c">
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    data-icod-id="src_pages_settings_tsx_d579" />
                </Field>
                <Field label="New Password" required data-icod-id="src_pages_settings_tsx_faae">
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    data-icod-id="src_pages_settings_tsx_2139" />
                </Field>
                <Field
                  label="Confirm New Password"
                  required
                  data-icod-id="src_pages_settings_tsx_4441">
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    data-icod-id="src_pages_settings_tsx_84d0" />
                </Field>
                <Button type="submit" data-icod-id="src_pages_settings_tsx_1b6d">
                  <Lock className="h-4 w-4" data-icod-id="src_pages_settings_tsx_3f06" />
                  Change Password
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6" data-icod-id="src_pages_settings_tsx_75ef">
              <div data-icod-id="src_pages_settings_tsx_2c82">
                <h2
                  className="text-lg font-semibold text-foreground"
                  data-icod-id="src_pages_settings_tsx_24b5">Notification Preferences</h2>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id="src_pages_settings_tsx_ed27">Choose what notifications you want to receive</p>
              </div>

              <div className="space-y-4" data-icod-id="src_pages_settings_tsx_ff15">
                {[
                  { label: 'Email notifications for new leads', checked: true },
                  { label: 'Email notifications for deal updates', checked: true },
                  { label: 'Email notifications for task assignments', checked: true },
                  { label: 'Daily digest email', checked: false },
                  { label: 'Weekly summary report', checked: true },
                ].map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3"
                    data-icod-id={`src_pages_settings_tsx_aaff_${index}`}>
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      data-icod-id={`src_pages_settings_tsx_0a20_${index}`} />
                    <span
                      className="text-sm text-foreground"
                      data-icod-id={`src_pages_settings_tsx_305b_${index}`}>{item.label}</span>
                  </label>
                ))}
              </div>

              <Button data-icod-id="src_pages_settings_tsx_c7a9">
                <Save className="h-4 w-4" data-icod-id="src_pages_settings_tsx_3c18" />
                Save Preferences
              </Button>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6" data-icod-id="src_pages_settings_tsx_bbbf">
              <div data-icod-id="src_pages_settings_tsx_ec46">
                <h2
                  className="text-lg font-semibold text-foreground"
                  data-icod-id="src_pages_settings_tsx_f996">Team Management</h2>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id="src_pages_settings_tsx_85ee">Manage team members and their roles</p>
              </div>

              <div className="overflow-x-auto" data-icod-id="src_pages_settings_tsx_d059">
                <table className="w-full text-sm" data-icod-id="src_pages_settings_tsx_880c">
                  <thead
                    className="border-b border-border bg-muted/50"
                    data-icod-id="src_pages_settings_tsx_4b24">
                    <tr data-icod-id="src_pages_settings_tsx_5873">
                      <th
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_4601">Name</th>
                      <th
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_3508">Email</th>
                      <th
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_416a">Role</th>
                      <th
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_3d51">Status</th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y divide-border"
                    data-icod-id="src_pages_settings_tsx_c954">
                    <tr data-icod-id="src_pages_settings_tsx_d84a">
                      <td
                        className="px-4 py-3 font-medium text-foreground"
                        data-icod-id="src_pages_settings_tsx_a36e">Admin User</td>
                      <td
                        className="px-4 py-3 text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_8300">admin@clienthub.com</td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_2df1">
                        <span
                          className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
                          data-icod-id="src_pages_settings_tsx_8b10">Admin</span>
                      </td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_bd77">
                        <span
                          className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                          data-icod-id="src_pages_settings_tsx_cd8f">Active</span>
                      </td>
                    </tr>
                    <tr data-icod-id="src_pages_settings_tsx_bb3f">
                      <td
                        className="px-4 py-3 font-medium text-foreground"
                        data-icod-id="src_pages_settings_tsx_d8d1">Manager User</td>
                      <td
                        className="px-4 py-3 text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_7003">manager@clienthub.com</td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_8df7">
                        <span
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                          data-icod-id="src_pages_settings_tsx_ba62">Manager</span>
                      </td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_70dd">
                        <span
                          className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                          data-icod-id="src_pages_settings_tsx_2045">Active</span>
                      </td>
                    </tr>
                    <tr data-icod-id="src_pages_settings_tsx_9518">
                      <td
                        className="px-4 py-3 font-medium text-foreground"
                        data-icod-id="src_pages_settings_tsx_ce2f">Sales Rep User</td>
                      <td
                        className="px-4 py-3 text-muted-foreground"
                        data-icod-id="src_pages_settings_tsx_7b18">sales@clienthub.com</td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_4eaf">
                        <span
                          className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800"
                          data-icod-id="src_pages_settings_tsx_27ca">SalesRep</span>
                      </td>
                      <td className="px-4 py-3" data-icod-id="src_pages_settings_tsx_ad0e">
                        <span
                          className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                          data-icod-id="src_pages_settings_tsx_030b">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
