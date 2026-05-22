import { Bell, Shield, User } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Card, Input, Select } from '@/components/ui'
import { useAuth, useTheme } from '@/hooks'

export function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Profile</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" defaultValue={user?.name} readOnly />
          <Input label="Email" type="email" defaultValue={user?.email} readOnly />
          <Input label="Department" defaultValue={user?.department} readOnly />
          <Input label="Role" defaultValue={user?.role} readOnly className="capitalize" />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h3>
        </div>
        <Select
          label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          className="max-w-xs"
        />
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Security</h3>
        </div>
        <p className="text-sm text-zinc-500">
          Password and two-factor authentication settings will be available when connected to your
          backend API.
        </p>
      </Card>
    </div>
  )
}
