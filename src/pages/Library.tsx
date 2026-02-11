import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { CreateTemplateModal } from '@/features/library/CreateTemplateModal'
import { EditTemplateModal } from '@/features/library/EditTemplateModal'
import { TemplateCard } from '@/features/library/TemplateCard'
import { ipcService } from '@/services/ipcService'
import { useLibraryStore, type Weapon } from '@/stores/library'

const FILTER_OPTIONS = ['All', 'Rifle', 'Pistol', 'SMG']

export function Scripts() {
	const { add, remove, update, get, getAll } = useLibraryStore()

	const [filter, setFilter] = useState('All')
	const [searchQuery, setSearchQuery] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState<Weapon | null>(null)

	const activeIds = getAll()
		.filter((w) => w.active)
		.map((w) => w.id)

	const handleCreateWeapon = (data: Weapon) => add(data)

	const handleEditSave = (id: string, data: Partial<Weapon>) => {
		setEditingTemplate(null)
		update(id, data)
	}

	const handleEditDelete = (id: string) => {
		setEditingTemplate(null)
		remove(id)
	}

	const toggleActive = async (id: string) => {
		const weapon = get(id)
		if (!weapon) return

		update(id, { active: !weapon.active })

		if (!weapon.active) {
			await ipcService.setCurrentPayload(id)
		}
	}

	const filtered = getAll().filter((weapon) => {
		if (filter === 'All') return true
		return weapon.type === filter
	})

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="space-y-6 pb-12 max-w-full"
			>
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
					<div className="flex items-center gap-4">
						<h2 className="text-2xl font-bold text-white tracking-tight">
							Library
						</h2>
						<div className="h-6 w-px bg-white/10" />
						<div className="flex gap-1">
							{FILTER_OPTIONS.map((opt) => (
								<button
									type="button"
									key={opt}
									onClick={() => setFilter(opt)}
									className={clsx(
										'px-3 py-1 rounded-md text-xs font-medium transition-colors border border-transparent',
										filter === opt
											? 'bg-white text-black border-white'
											: 'text-neutral-500 hover:text-white hover:bg-white/5',
									)}
								>
									{opt}
								</button>
							))}
						</div>
					</div>

					<div className="flex gap-3">
						<div className="relative group">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 group-focus-within:text-white transition-colors" />
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-neutral-900 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-white/20 transition-all w-48 text-white placeholder:text-neutral-600"
							/>
						</div>
						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-primary text-white hover:brightness-110 transition-all font-bold text-xs shadow-lg shadow-accent-primary/20"
						>
							<Plus className="w-3.5 h-3.5" /> New
						</button>
					</div>
				</div>

				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
				>
					<AnimatePresence mode="popLayout">
						{filtered.map((weapon) => (
							<TemplateCard
								key={weapon.id}
								weapon={weapon}
								active={activeIds.includes(weapon.id)}
								onToggle={toggleActive}
								onRightClick={(t: Weapon) => setEditingTemplate(t)}
							/>
						))}
					</AnimatePresence>
				</motion.div>
			</motion.div>

			<AnimatePresence>
				{isModalOpen && (
					<CreateTemplateModal
						onClose={() => setIsModalOpen(false)}
						onCreate={handleCreateWeapon}
					/>
				)}
				{editingTemplate && (
					<EditTemplateModal
						weapon={editingTemplate}
						onClose={() => setEditingTemplate(null)}
						onSave={handleEditSave}
						onDelete={handleEditDelete}
					/>
				)}
			</AnimatePresence>
		</>
	)
}
