import { motion, type Variants } from 'framer-motion'
import { Activity, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react'
import { NavLink } from 'react-router'

// Animation variants
const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
}

export function Home() {
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
			className="space-y-12 max-w-5xl mx-auto pt-8"
		>
			{/* Minimal Hero */}
			<motion.div variants={item as Variants} className="space-y-6">
				<h1 className="text-5xl font-light text-white tracking-tight">
					Control.{' '}
					<span className="font-bold text-accent-primary">Perfected.</span>
				</h1>
				<p className="text-xl text-neutral-400 max-w-lg font-light leading-relaxed">
					Advanced recoil algorithms with zero-latency injection. Designed for
					the modern competitor.
				</p>

				<div className="flex gap-4 pt-4">
					<NavLink to="/scripts">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="px-8 py-3 rounded-lg bg-neutral-100 text-neutral-950 font-bold flex items-center gap-2 hover:bg-white transition-colors"
						>
							<Zap className="w-4 h-4" /> Initialize
						</motion.button>
					</NavLink>
					<motion.button
						whileHover={{
							scale: 1.02,
							backgroundColor: 'rgba(255,255,255,0.05)',
						}}
						whileTap={{ scale: 0.98 }}
						className="px-8 py-3 rounded-lg border border-white/10 text-white font-medium flex items-center gap-2"
					>
						Documentation
					</motion.button>
				</div>
			</motion.div>

			{/* Feature Grid */}
			<motion.div
				variants={item as Variants}
				className="grid grid-cols-1 md:grid-cols-3 gap-8"
			>
				<div className="space-y-2">
					<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 text-accent-primary mb-4">
						<Shield className="w-5 h-5" />
					</div>
					<h3 className="text-lg font-medium text-white">Undetected</h3>
					<p className="text-sm text-neutral-500 leading-relaxed">
						Kernel-level interaction prevents anti-cheat detection mechanisms
						from flagging input.
					</p>
				</div>

				<div className="space-y-2">
					<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 text-accent-primary mb-4">
						<Activity className="w-5 h-5" />
					</div>
					<h3 className="text-lg font-medium text-white">Performance</h3>
					<p className="text-sm text-neutral-500 leading-relaxed">
						Optimized Rust backend ensures less than 1ms overhead on system
						resources.
					</p>
				</div>

				<div className="space-y-2">
					<div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-white/5 text-accent-primary mb-4">
						<CheckCircle2 className="w-5 h-5" />
					</div>
					<h3 className="text-lg font-medium text-white">Cloud Sync</h3>
					<p className="text-sm text-neutral-500 leading-relaxed">
						Your configurations are automatically backed up and synced across
						devices.
					</p>
				</div>
			</motion.div>

			{/* Footer Note */}
			<motion.div
				variants={item as Variants}
				className="pt-12 border-t border-white/5 flex justify-between items-center text-sm text-neutral-600"
			>
				<span>&copy; 2026 Recoilly Labs</span>
				<button
					type="button"
					className="hover:text-neutral-400 transition-colors flex items-center gap-1 cursor-pointer"
				>
					Read Changelog <ArrowRight className="w-3 h-3" />
				</button>
			</motion.div>
		</motion.div>
	)
}
