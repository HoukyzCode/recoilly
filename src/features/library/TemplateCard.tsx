import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import type { Weapon } from '@/stores/library'

interface TemplateCardProps {
	weapon: Weapon
	active: boolean
	onToggle: (id: string) => void
	onRightClick?: (weapon: Weapon) => void
}

export function TemplateCard({
	weapon,
	active,
	onToggle,
	onRightClick,
}: TemplateCardProps) {
	const [_, setHovered] = useState(false)

	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={() => onToggle(weapon.id)}
			onContextMenu={(e) => {
				e.preventDefault()
				onRightClick?.(weapon)
			}}
			className={clsx(
				'relative rounded-xl p-4 flex flex-col justify-between transition-all duration-200 border cursor-pointer h-32 select-none',
				active
					? 'bg-neutral-900 border-accent-primary shadow-[0_0_0_1px_var(--color-accent-primary)]'
					: 'bg-neutral-900 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800',
			)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			whileTap={{ scale: 0.98 }}
		>
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					<span
						className={clsx(
							'text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-md border transition-colors font-semibold',
							active
								? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
								: 'bg-neutral-950 text-neutral-500 border-white/5',
						)}
					>
						{weapon.type}
					</span>
				</div>

				{active ? (
					<div className="text-accent-primary">
						<CheckCircle2 className="w-4 h-4" />
					</div>
				) : (
					<div className="w-4 h-4 rounded-full border border-neutral-700" />
				)}
			</div>

			<div>
				<h3
					className={clsx(
						'text-sm font-bold truncate pr-2 transition-colors',
						active ? 'text-white' : 'text-neutral-300',
					)}
				>
					{weapon.name}
				</h3>
				<p
					className={clsx(
						'text-[10px] transition-colors',
						active ? 'text-accent-primary' : 'text-neutral-500',
					)}
				>
					{active ? 'Active' : 'Click to activate'}
				</p>
			</div>
		</motion.div>
	)
}
