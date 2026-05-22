import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { ShadcnButton } from '@/components/ui/shadcn-button'
import { ShadcnInput } from '@/components/ui/shadcn-input'
import { ShadcnSelect } from '@/components/ui/shadcn-select'
import { getApiErrorMessage } from '@/services'
import { userApi, type CreateStaffResult } from '@/services/userApi'
import type { Interviewer } from '@/types/interview'

interface CreateInterviewerSectionProps {
  onCreated: (member: Interviewer, meta?: { temporaryPassword?: string }) => void
}

export function CreateInterviewerSection({ onCreated }: CreateInterviewerSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'interviewer' | 'recruiter' | 'hiring_manager'>('interviewer')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [lastTempPassword, setLastTempPassword] = useState<string | null>(null)

  const handleCreate = async () => {
    setError(null)
    setLastTempPassword(null)
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    setCreating(true)
    try {
      const created: CreateStaffResult = await userApi.createStaff({
        name: name.trim(),
        email: email.trim(),
        role,
        password: password.trim() || undefined,
      })
      onCreated(
        {
          id: created.id,
          name: created.name,
          email: created.email,
          role: created.role,
        },
        { temporaryPassword: created.temporaryPassword },
      )
      if (created.temporaryPassword) {
        setLastTempPassword(created.temporaryPassword)
      }
      setName('')
      setEmail('')
      setPassword('')
      setExpanded(false)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  if (!expanded) {
    return (
      <ShadcnButton
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={() => setExpanded(true)}
      >
        <UserPlus className="h-4 w-4" />
        Create new interviewer
      </ShadcnButton>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">New team member</p>
        <button
          type="button"
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          onClick={() => {
            setExpanded(false)
            setError(null)
          }}
        >
          Cancel
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Full name *
          </label>
          <ShadcnInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Sam Patel" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Email *
          </label>
          <ShadcnInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sam@company.com"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Role
          </label>
          <ShadcnSelect value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="interviewer">Interviewer</option>
            <option value="recruiter">Recruiter</option>
            <option value="hiring_manager">Hiring manager</option>
          </ShadcnSelect>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Login password (optional)
          </label>
          <ShadcnInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {lastTempPassword && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Temporary password (share securely): <strong>{lastTempPassword}</strong>
        </p>
      )}
      <ShadcnButton type="button" size="sm" onClick={() => void handleCreate()} disabled={creating}>
        {creating ? 'Creating…' : 'Save interviewer'}
      </ShadcnButton>
    </div>
  )
}
