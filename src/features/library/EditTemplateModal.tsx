import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Footprints, Gauge, MousePointer2, Save, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SprayPattern } from '@/features/visualization/SprayPattern'
import type { Weapon } from '@/stores/library'

interface EditTemplateModalProps {
	weapon: Weapon
	onClose: () => void
	onSave: (id: string, updates: Partial<Weapon>) => void
	onDelete: (id: string) => void
}

const WEAPON_CLASSES = ['Rifle', 'Pistol', 'SMG', 'Sniper', 'Shotgun']

export function EditTemplateModal({
	weapon,
	onClose,
	onSave,
	onDelete,
}: EditTemplateModalProps) {
	const [mounted, setMounted] = useState(false)
	const [formData, setFormData] = useState<{
		name: string
		weaponClass: Weapon['type']
		sensitivity: number
		rpm: number
		steps: number
	}>({
		name: weapon.name,
		weaponClass: weapon.type,
		sensitivity: weapon.sensitivity,
		rpm: weapon.rpm,
		steps: weapon.steps,
	})

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	const handleSave = () => {
		onSave(weapon.id, {
			name: formData.name,
			type: formData.weaponClass,
			rpm: formData.rpm,
			sensitivity: formData.sensitivity,
			steps: formData.steps,
		})
		onClose()
	}

	const handleDelete = () => {
		onDelete(weapon.id)
		onClose()
	}

	if (!mounted) return null

	return createPortal(
		<div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				className="absolute inset-0 bg-black/80 backdrop-blur-md"
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]"
			>
				<div className="w-full md:w-1/2 bg-black/40 p-6 flex flex-col border-r border-white/5 relative group">
					<h3 className="text-white font-bold mb-4 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{' '}
						Pattern Preview
					</h3>
					<SprayPattern
						className="flex-1 border border-white/5"
						points={weapon.pattern}
					/>
				</div>

				<div className="w-full md:w-1/2 flex flex-col">
					<div className="flex items-center justify-between p-6 border-b border-white/5">
						<div>
							<h2 className="text-xl font-bold text-white">Edit Template</h2>
							<p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
								ID: <span className="font-bold text-xs">{weapon.id}</span>
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						<div className="space-y-4">
							<label
								htmlFor="template-name"
								className="text-xs font-bold uppercase tracking-widest text-neutral-500"
							>
								Template Name
							</label>
							<input
								id="template-name"
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary/50 transition-colors text-lg"
							/>
						</div>

						<div className="space-y-4">
							<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
								Weapon Class
							</h1>
							<div className="flex flex-wrap gap-2">
								{WEAPON_CLASSES.map((cls) => (
									<button
										key={cls}
										type="button"
										onClick={() =>
											setFormData({
												...formData,
												weaponClass: cls as Weapon['type'],
											})
										}
										className={clsx(
											'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
											formData.weaponClass === cls
												? 'bg-accent-primary text-white border-accent-primary'
												: 'bg-transparent text-neutral-500 border-white/10 hover:border-white/20 hover:text-neutral-300',
										)}
									>
										{cls}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<label
								htmlFor="sensitivity-input"
								className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between"
							>
								<span>Sensitivity</span>
								<span className="text-accent-primary font-mono">
									{formData.sensitivity.toFixed(1)}
								</span>
							</label>
							<div className="bg-neutral-950 rounded-xl p-3 border border-white/10 flex items-center gap-4 px-4">
								<MousePointer2 className="w-5 h-5 text-neutral-500" />
								<input
									id="sensitivity-input"
									type="range"
									min="0.1"
									max="5.0"
									step="0.05"
									value={formData.sensitivity}
									onChange={(e) =>
										setFormData({
											...formData,
											sensitivity: parseFloat(e.target.value),
										})
									}
									className="flex-1 accent-accent-primary h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<label
								htmlFor="sensitivity-input"
								className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between"
							>
								<span>RPM</span>
								<span className="text-accent-primary font-mono">
									{formData.rpm}
								</span>
							</label>
							<div className="bg-neutral-950 rounded-xl p-3 border border-white/10 flex items-center gap-4 px-4">
								<Gauge className="w-5 h-5 text-neutral-500" />
								<input
									id="sensitivity-input"
									type="range"
									min="100"
									max="1000"
									step="100"
									value={formData.rpm}
									onChange={(e) =>
										setFormData({
											...formData,
											rpm: parseInt(e.target.value, 10),
										})
									}
									className="flex-1 accent-accent-primary h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<label
								htmlFor="sensitivity-input"
								className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between"
							>
								<span>Steps</span>
								<span className="text-accent-primary font-mono">
									{formData.steps}
								</span>
							</label>
							<div className="bg-neutral-950 rounded-xl p-3 border border-white/10 flex items-center gap-4 px-4">
								<Footprints className="w-5 h-5 text-neutral-500" />
								<input
									id="sensitivity-input"
									type="range"
									min="10"
									max="100"
									step="1"
									value={formData.steps}
									onChange={(e) =>
										setFormData({
											...formData,
											steps: parseInt(e.target.value, 10),
										})
									}
									className="flex-1 accent-accent-primary h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>
					</div>

					<div className="p-6 bg-neutral-950/30 border-t border-white/5 flex justify-between items-center">
						<button
							type="button"
							onClick={handleDelete}
							className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 font-medium text-sm flex items-center gap-2 transition-colors"
						>
							<Trash2 className="w-4 h-4" /> Delete
						</button>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-6 py-2.5 rounded-xl text-neutral-400 font-bold text-sm hover:text-white transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSave}
								className="px-8 py-2.5 rounded-xl bg-accent-primary text-white font-bold text-sm shadow-lg shadow-accent-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
							>
								<Save className="w-4 h-4" /> Save Changes
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>,
		document.body,
	)
}
