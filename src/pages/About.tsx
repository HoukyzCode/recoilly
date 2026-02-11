import { motion } from 'framer-motion'
import { ArrowLeft, Github, Globe, Twitter } from 'lucide-react'
import { NavLink } from 'react-router'

export function About() {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.05 }}
			className="max-w-2xl mx-auto pt-10 text-center"
		>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="mb-8"
			>
				<div className="w-20 h-20 mx-auto bg-white text-black rounded-3xl flex items-center justify-center text-4xl font-bold mb-6 shadow-2xl shadow-accent-primary/20">
					R
				</div>
				<h1 className="text-4xl font-bold text-white mb-2">Recoilly Pro</h1>
				<p className="text-neutral-500">Version 2.5.0 (Stable)</p>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="bg-neutral-900 border border-white/5 rounded-2xl p-8 mb-8"
			>
				<p className="text-neutral-400 leading-relaxed mb-6">
					Recoilly is a next-generation input management system designed for
					precision and performance. Built with <strong>Rust</strong> and{' '}
					<strong>React</strong>, utilizing kernel-level drivers for
					undetectable latency.
				</p>

				<div className="flex justify-center gap-6">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
					>
						<Github className="w-5 h-5" />
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noreferrer"
						className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
					>
						<Twitter className="w-5 h-5" />
					</a>
					<a
						href="https://example.com"
						target="_blank"
						rel="noreferrer"
						className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
					>
						<Globe className="w-5 h-5" />
					</a>
				</div>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3 }}
			>
				<NavLink
					to="/"
					className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-white transition-colors"
				>
					<ArrowLeft className="w-4 h-4" /> Back to Dashboard
				</NavLink>
			</motion.div>
		</motion.div>
	)
}
