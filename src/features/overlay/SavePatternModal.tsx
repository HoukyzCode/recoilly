import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Check, Plus, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { useLibraryStore } from '@/stores/library'
import type { Vec2 } from '@/types/vec'
import { PatternDiff } from './PatternDiff'

interface SavePatternModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (targetId: string | null) => void // null = new
	currentPoints: Vec2[]
}

export function SavePatternModal({
	isOpen,
	onClose,
	onSave,
	currentPoints,
}: SavePatternModalProps) {
	const { getAll, update, add } = useLibraryStore()

	const [searchTerm, setSearchTerm] = useState('')
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const templates = getAll()

	const filteredTemplates = templates.filter((t) =>
		t.name.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const selectedTemplate = templates.find((t) => t.id === selectedId)

	const oldPoints: Vec2[] = selectedTemplate?.pattern || []

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				className="bg-[#050505] w-full max-w-5xl h-[700px] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
					<div>
						<h2 className="text-2xl font-bold text-white tracking-tight">
							Save Configuration
						</h2>
						<p className="text-sm text-zinc-500 mt-1">
							Select a slot to overwrite or create a new profile.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
					>
						✕
					</button>
				</div>

				<div className="flex-1 flex overflow-hidden">
					<div className="w-[380px] border-r border-white/5 bg-[#0a0a0a] flex flex-col">
						<div className="p-4 border-b border-white/5">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
								<input
									type="text"
									placeholder="Search library..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full bg-[#111] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all"
								/>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
							<button
								type="button"
								onClick={() => setSelectedId(null)}
								className={clsx(
									'w-full text-left p-4 rounded-xl transition-all border relative overflow-hidden group',
									selectedId === null
										? 'bg-purple-500/10 border-purple-500'
										: 'bg-[#111] border-white/5 hover:border-white/10 hover:bg-[#161616]',
								)}
							>
								<div className="flex items-center justify-between relative z-10">
									<div className="flex items-center gap-4">
										<div
											className={clsx(
												'w-10 h-10 rounded-lg flex items-center justify-center transition-all font-bold',
												selectedId === null
													? 'bg-purple-600 text-white shadow-lg'
													: 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white',
											)}
										>
											<Plus size={20} />
										</div>
										<div>
											<span
												className={clsx(
													'font-bold block text-sm',
													selectedId === null ? 'text-white' : 'text-zinc-300',
												)}
											>
												Create New Profile
											</span>
											<span className="text-xs text-zinc-500">
												Save as new entry
											</span>
										</div>
									</div>
									{selectedId === null && (
										<div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
											<Check size={12} className="text-white" strokeWidth={3} />
										</div>
									)}
								</div>
							</button>

							<div className="py-2">
								<span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-1">
									Library
								</span>
							</div>

							{filteredTemplates.map((template) => {
								const isSelected = selectedId === template.id
								return (
									<button
										key={template.id}
										type="button"
										onClick={() => setSelectedId(template.id)}
										className={clsx(
											'w-full text-left p-4 rounded-xl text-sm transition-all border group',
											isSelected
												? 'bg-[#111] border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
												: 'bg-[#111] border-white/5 hover:border-white/10 hover:bg-[#161616]',
										)}
									>
										<div className="flex justify-between items-start mb-2">
											<span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-white/5 uppercase">
												{template.type}
											</span>
											{isSelected && (
												<div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
													<Check
														size={10}
														className="text-white"
														strokeWidth={3}
													/>
												</div>
											)}
										</div>
										<div className="mb-1">
											<span
												className={clsx(
													'font-bold text-base',
													isSelected ? 'text-white' : 'text-zinc-300',
												)}
											>
												{template.name}
											</span>
										</div>
										<p
											className={clsx(
												'text-xs transition-colors',
												isSelected ? 'text-purple-400' : 'text-zinc-600',
											)}
										>
											{isSelected
												? 'Active Selection'
												: `${template.active ? 'Active' : 'Inactive'}`}
										</p>
									</button>
								)
							})}
						</div>
					</div>

					<div className="flex-1 p-8 bg-[#050505] flex flex-col relative">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
								Pattern Analysis
							</h3>

							<div className="text-right flex items-center gap-3">
								<span className="text-xs text-zinc-500">Comparison Mode</span>
								<div className="bg-[#111] px-3 py-1.5 rounded-lg border border-white/10">
									<span className="text-xs font-bold text-white">
										{selectedTemplate ? selectedTemplate.name : 'New Entry'}
									</span>
								</div>
							</div>
						</div>

						<div className="flex-1 relative min-h-0 bg-[#0a0a0a] rounded-2xl border border-white/5 p-1">
							<PatternDiff newPoints={currentPoints} oldPoints={oldPoints} />
						</div>

						<div className="mt-8 flex justify-end gap-3 items-center pt-6 border-t border-white/5">
							<button
								type="button"
								onClick={onClose}
								className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									if (selectedId) {
										update(selectedId, {
											pattern: currentPoints,
										})
									} else {
										add({
											id: crypto.randomUUID(),
											name: `New Recording ${new Date().toLocaleTimeString()}`,
											active: false,
											pattern: currentPoints,
											image: '',
											rpm: 600,
											type: 'Rifle',
											sensitivity: 1.0,
											steps: 10,
										})
									}

									onSave(selectedId)
								}}
								className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
							>
								<Save size={16} />
								{selectedId ? 'UPDATE CONFIGURATION' : 'SAVE TO LIBRARY'}
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
