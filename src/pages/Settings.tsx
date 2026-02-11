import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Monitor, Moon, Mouse } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

function Toggle({
	label,
	checked,
	onChange,
}: {
	label: string
	checked: boolean
	onChange: (v: boolean) => void
}) {
	return (
		<div className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors bg-neutral-900/50">
			<span className="font-medium text-neutral-300 text-sm">{label}</span>
			<button
				type="button"
				onClick={() => onChange(!checked)}
				className={clsx(
					'w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none cursor-pointer',
					checked ? 'bg-accent-primary' : 'bg-neutral-700',
				)}
			>
				<motion.div
					layout
					className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-sm"
					animate={{ x: checked ? 20 : 0 }}
					transition={{ type: 'spring', stiffness: 500, damping: 30 }}
				/>
			</button>
		</div>
	)
}

function Section({
	title,
	icon: Icon,
	children,
}: {
	title: string
	icon: React.ComponentType<{ className?: string }>
	children: React.ReactNode
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-4"
		>
			<h3 className="text-sm font-medium flex items-center gap-2 text-neutral-400 uppercase tracking-widest pl-1">
				<Icon className="w-4 h-4" /> {title}
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
		</motion.div>
	)
}

export function Settings() {
	const {
		accentColor,
		setAccentColor,
		overlayEnabled,
		toggleOverlay,
		streamerMode,
		toggleStreamerMode,
		sensitivity,
		setSensitivity,
	} = useSettingsStore()

	const accentColors = [
		{ name: 'Electric Blue', value: '#3b82f6', bg: 'bg-blue-500' },
		{ name: 'Neon Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
		{ name: 'Soft Purple', value: '#a855f7', bg: 'bg-purple-500' },
		{ name: 'Emerald', value: '#10b981', bg: 'bg-emerald-500' },
		{ name: 'Crimson', value: '#ef4444', bg: 'bg-red-500' },
	]

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="max-w-3xl mx-auto space-y-10 pb-12 pt-4"
		>
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-light text-white tracking-tight">
						Configuration
					</h2>
				</div>
			</div>

			<div className="space-y-10">
				<Section title="General" icon={Monitor}>
					<Toggle
						label="Streamer Mode (Hide ID)"
						checked={streamerMode}
						onChange={() => toggleStreamerMode()}
					/>
					<Toggle
						label="Enable Overlay"
						checked={overlayEnabled}
						onChange={() => toggleOverlay()}
					/>
				</Section>

				<Section title="Input Handling" icon={Mouse}>
					<div className="md:col-span-2 p-6 rounded-xl border border-white/5 bg-neutral-900/50 space-y-6">
						<div className="flex justify-between items-center">
							<span className="text-neutral-300 font-medium text-sm">
								Sensitivity Compensation
							</span>
							<span className="text-accent-primary font-mono font-bold">
								{sensitivity}x
							</span>
						</div>
						<input
							type="range"
							min="0.1"
							max="5.0"
							step="0.05"
							value={sensitivity}
							onChange={(e) => setSensitivity(parseFloat(e.target.value))}
							className="w-full accent-accent-primary h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
						/>
						<p className="text-xs text-neutral-500 leading-relaxed max-w-lg">
							Adjusts the strength of recoil negation relative to your in-game
							sensitivity. Higher values may result in over-compensation.
						</p>
					</div>
				</Section>

				<Section title="Interface" icon={Moon}>
					<div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-neutral-900/50 w-full md:col-span-2">
						<span className="font-medium text-neutral-300 text-sm">
							Accent Color
						</span>
						<div className="flex gap-3">
							{accentColors.map((c) => (
								<motion.button
									key={c.value}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
									type="button"
									onClick={() => setAccentColor(c.value)}
									className={clsx(
										'w-6 h-6 rounded-full cursor-pointer transition-all',
										c.bg,
										accentColor === c.value
											? 'ring-2 ring-white scale-110'
											: 'ring-2 ring-transparent hover:ring-white/20',
									)}
								/>
							))}
						</div>
					</div>
				</Section>
			</div>
		</motion.div>
	)
}
