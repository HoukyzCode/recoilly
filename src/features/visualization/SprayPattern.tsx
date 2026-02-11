/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Point {
	x: number
	y: number
}

interface SprayPatternProps {
	className?: string
	points?: Point[]
}

export function SprayPattern({ className, points = [] }: SprayPatternProps) {
	const { pathData, circles } = useMemo(() => {
		if (!points || points.length === 0) return { pathData: '', circles: [] }

		const xs = points.map((p) => p.x)
		const ys = points.map((p) => p.y)
		const minX = Math.min(...xs)
		const maxX = Math.max(...xs)
		const minY = Math.min(...ys)
		const maxY = Math.max(...ys)

		const width = Math.max(maxX - minX, 1)
		const height = Math.max(maxY - minY, 1)

		const scale = Math.min(160 / width, 200 / height)
		const offsetX = (200 - width * scale) / 2
		const offsetY = (250 - height * scale) / 2

		const normalized = points.map((p) => ({
			x: (p.x - minX) * scale + offsetX,
			y: (p.y - minY) * scale + offsetY,
		}))

		const path = normalized.reduce(
			(acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
			'',
		)

		return { pathData: path, circles: normalized }
	}, [points])

	return (
		<div
			className={`relative w-full h-full bg-neutral-900 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
		>
			<div
				className="absolute inset-0 z-0 opacity-20"
				style={{
					backgroundImage:
						'linear-gradient(#ffffff35 1px, transparent 1px), linear-gradient(90deg, #ffffff35 1px, transparent 1px)',
					backgroundSize: '33.8px 33.8px',
				}}
			/>

			<svg
				viewBox="0 0 200 250"
				className="w-full h-full max-w-[200px] relative z-10 overflow-visible"
			>
				{points.length > 0 ? (
					<>
						<motion.path
							d={pathData}
							fill="none"
							stroke="var(--color-accent-primary)"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
							style={{ stroke: '#a855f7' }}
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
								repeatDelay: 1,
							}}
						/>
						<circle cx={circles[0]?.x} cy={circles[0]?.y} r="4" fill="#fff" />
					</>
				) : (
					<text x="100" y="125" textAnchor="middle" fill="#555" fontSize="12">
						No Pattern Data
					</text>
				)}
			</svg>

			{points.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-neutral-400"
				>
					Playing Preview...
				</motion.div>
			)}
		</div>
	)
}
