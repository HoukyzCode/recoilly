import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import {
	Camera,
	Crosshair,
	Footprints,
	Gauge,
	MousePointer2,
	Upload,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Weapon } from '@/stores/library'

interface CreateTemplateModalProps {
	onClose: () => void
	onCreate: (data: Weapon) => void
}

const WEAPON_CLASSES = ['Rifle', 'Pistol', 'SMG', 'Sniper', 'Shotgun']

export function CreateTemplateModal({
	onClose,
	onCreate,
}: CreateTemplateModalProps) {
	const [mounted, setMounted] = useState(false)
	const [formData, setFormData] = useState<{
		name: string
		weapon: Weapon['type']
		sensitivity: number
		rpm: number
		steps: number
	}>({
		name: '',
		weapon: 'Rifle',
		sensitivity: 1.0,
		rpm: 600,
		steps: 10,
	})

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onCreate({
			id: crypto.randomUUID(),
			name: formData.name,
			type: formData.weapon,
			active: false,
			pattern: [],
			image: '',
			rpm: formData.rpm,
			sensitivity: formData.sensitivity,
			steps: formData.steps,
		})
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
				className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
			>
				<div className="flex items-center justify-between p-6 border-b border-white/5">
					<div>
						<h2 className="text-xl font-bold text-white">New Template</h2>
						<p className="text-neutral-500 text-sm">
							Create a new recoil configuration.
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
						type="button"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-4">
							<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
								Input Source
							</h1>
							<div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-black/20 hover:border-accent-primary/50 hover:bg-accent-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
								<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-accent-primary transition-colors">
									<Upload className="w-8 h-8" />
								</div>
								<div className="text-center">
									<p className="text-neutral-300 font-medium">
										Drop image here
									</p>
									<p className="text-neutral-600 text-xs">or click to browse</p>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="h-px bg-white/5 flex-1" />
								<span className="text-xs text-neutral-600 uppercase font-bold">
									OR
								</span>
								<div className="h-px bg-white/5 flex-1" />
							</div>

							<button
								type="button"
								className="w-full py-3 rounded-xl bg-neutral-800 text-neutral-300 font-medium border border-white/5 hover:bg-neutral-700 hover:text-white transition-colors flex items-center justify-center gap-2"
							>
								<Camera className="w-4 h-4" /> Capture Screen
							</button>
						</div>

						<div className="space-y-6">
							<div className="space-y-2">
								<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
									Configuration Name
								</h1>
								<input
									type="text"
									placeholder="e.g. AK-47 Pro Script"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-accent-primary/50 transition-colors"
								/>
							</div>

							<div className="space-y-2">
								<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
									Weapon Class
								</h1>
								<div className="flex flex-wrap gap-2">
									{WEAPON_CLASSES.map((cls) => (
										<button
											key={cls}
											type="button"
											onClick={() => setFormData({ ...formData, weapon: cls })}
											className={clsx(
												'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
												formData.weapon === cls
													? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20'
													: 'bg-transparent text-neutral-500 border-white/10 hover:border-white/20 hover:text-neutral-300',
											)}
										>
											{cls}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between">
									<span>Sensitivity</span>
									<span className="text-accent-primary font-mono">
										{formData.sensitivity.toFixed(1)}
									</span>
								</h1>
								<div className="bg-neutral-950 rounded-xl p-2 border border-white/10 flex items-center gap-3 px-4">
									<MousePointer2 className="w-4 h-4 text-neutral-500" />
									<input
										type="range"
										min="0.1"
										max="5.0"
										step="0.1"
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

							<div className="space-y-2">
								<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between">
									<span>RPM</span>
									<span className="text-accent-primary font-mono">
										{formData.rpm}
									</span>
								</h1>
								<div className="bg-neutral-950 rounded-xl p-2 border border-white/10 flex items-center gap-3 px-4">
									<Gauge className="w-4 h-4 text-neutral-500" />
									<input
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

							<div className="space-y-2">
								<h1 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex justify-between">
									<span>Steps</span>
									<span className="text-accent-primary font-mono">
										{formData.steps}
									</span>
								</h1>
								<div className="bg-neutral-950 rounded-xl p-2 border border-white/10 flex items-center gap-3 px-4">
									<Footprints className="w-4 h-4 text-neutral-500" />
									<input
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
					</div>
				</div>

				<div className="p-6 bg-neutral-950/50 border-t border-white/5 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-3 rounded-xl text-neutral-400 font-bold text-sm hover:text-white transition-colors"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						className="px-8 py-3 rounded-xl bg-accent-primary text-white font-bold text-sm shadow-xl shadow-accent-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
					>
						<Crosshair className="w-4 h-4" /> Create Template
					</button>
				</div>
			</motion.div>
		</div>,
		document.body,
	)
}
