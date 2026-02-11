/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Vec2 } from '@/types/vec'

const normalizePoints = (pts: Vec2[]) => {
	if (pts.length === 0) return []
	const start = pts[0]
	return pts.map((p) => ({
		x: p.x - start.x,
		y: p.y - start.y,
	}))
}

const getBounds = (pts: Vec2[]) => {
	if (pts.length === 0)
		return { width: 100, height: 100, centerX: 0, centerY: 0 }

	const xs = pts.map((p) => p.x)
	const ys = pts.map((p) => p.y)
	const minX = Math.min(...xs)
	const maxX = Math.max(...xs)
	const minY = Math.min(...ys)
	const maxY = Math.max(...ys)

	const width = maxX - minX
	const height = maxY - minY

	return {
		width: Math.max(width, 20),
		height: Math.max(height, 20),
		centerX: minX + width / 2,
		centerY: minY + height / 2,
	}
}

export const PatternDiff = ({
	newPoints,
	oldPoints,
}: {
	newPoints: Vec2[]
	oldPoints: Vec2[] | null
}) => {
	const normalizedNew = useMemo(() => normalizePoints(newPoints), [newPoints])
	const normalizedOld = useMemo(
		() => (oldPoints ? normalizePoints(oldPoints) : []),
		[oldPoints],
	)

	const bounds = useMemo(() => {
		const allPoints = [...normalizedNew, ...normalizedOld]
		return getBounds(allPoints)
	}, [normalizedNew, normalizedOld])

	const padding = Math.max(bounds.width, bounds.height) * 0.4
	const size = Math.max(bounds.width, bounds.height) + padding

	const viewBox = `${bounds.centerX - size / 2} ${bounds.centerY - size / 2} ${size} ${size}`

	const createPathData = (pts: Vec2[]) =>
		pts.reduce(
			(acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
			'',
		)

	const renderPattern = (pts: Vec2[], color: string, isGhost = false) => {
		if (pts.length === 0) return null

		const strokeWidth = size * 0.008
		const dotSize = size * 0.02

		return (
			<motion.g
				initial={{ opacity: 0 }}
				animate={{ opacity: isGhost ? 0.3 : 1 }}
				transition={{ duration: 0.5 }}
			>
				<motion.path
					d={createPathData(pts)}
					fill="none"
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.5, ease: 'easeInOut' }}
				/>

				{pts.map((p, i) => (
					<motion.circle
						key={`${i}-${p.x}`}
						cx={p.x}
						cy={p.y}
						r={dotSize}
						fill={isGhost ? color : '#09090b'}
						stroke={color}
						strokeWidth={strokeWidth}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: i * 0.05, duration: 0.2 }}
					/>
				))}

				<circle
					cx={pts[0]?.x || 0}
					cy={pts[0]?.y || 0}
					r={dotSize * 1.5}
					fill="white"
				/>
			</motion.g>
		)
	}

	return (
		<div className="w-full h-full bg-[#050505] rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center shadow-inner group">
			<div
				className="absolute inset-0 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
				style={{
					backgroundImage:
						'radial-gradient(circle, #52525b 1px, transparent 1px)',
					backgroundSize: '20px 20px',
				}}
			/>

			<svg
				viewBox={viewBox}
				className="w-full h-full p-4 overflow-visible z-10"
			>
				{oldPoints && renderPattern(normalizedOld, '#52525b', true)}
				{renderPattern(normalizedNew, '#a855f7')}
			</svg>

			<div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none">
				<span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-900/50 px-2 py-0.5 rounded border border-white/5">
					Auto-Scale: ON
				</span>
			</div>

			<div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md shadow-lg pointer-events-none">
				<div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
				<span className="text-[10px] font-bold text-purple-500 tracking-widest">
					PREVIEW
				</span>
			</div>
		</div>
	)
}
