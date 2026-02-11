import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import {
	Crosshair,
	Disc,
	Maximize2,
	Minimize2,
	Play,
	Save,
	Square,
	Trash2,
} from 'lucide-react'
import type { RefObject } from 'react'
import type { Vec2 } from '@/types/vec'
import { OverlayCanvas } from './OverlayCanvas'

interface OverlayControlsProps {
	pointsLength: number
	isRecording: boolean
	isZoomEnabled: boolean
	points: Vec2[]
	onToggleRecording: () => void
	onSaveClick: () => void
	onClearClick: () => void
	onToggleZoom: () => void
	dragConstraints: RefObject<HTMLDivElement | null>
}

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 384

export function OverlayControls({
	pointsLength,
	isRecording,
	isZoomEnabled,
	points,
	onToggleRecording,
	onSaveClick,
	onClearClick,
	onToggleZoom,
	dragConstraints,
}: OverlayControlsProps) {
	return (
		<motion.div
			className="absolute top-8 right-8 w-[340px] bg-[#050505]/95 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col z-50 pointer-events-auto"
			drag
			dragMomentum={false}
			dragConstraints={dragConstraints}
			onPointerDown={(e) => e.stopPropagation()}
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
		>
			<div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(147,51,234,0.4)]">
						R
					</div>
					<h1 className="text-sm font-bold tracking-tight text-white">
						RECOILLY <span className="text-purple-400">PRO</span>
					</h1>
				</div>

				<button
					type="button"
					onClick={onToggleZoom}
					className={clsx(
						'p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-medium border',
						isZoomEnabled
							? 'bg-white text-black border-white shadow-sm'
							: 'bg-transparent border-white/10 text-zinc-500 hover:text-zinc-300',
					)}
					title="Toggle Zoom Lens"
				>
					{isZoomEnabled ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
				</button>
			</div>

			<div className="relative w-full aspect-4/3 bg-[#050505] group">
				<div
					className="absolute inset-0 opacity-10 pointer-events-none"
					style={{
						backgroundImage:
							'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
						backgroundSize: '20px 20px',
					}}
				/>

				<OverlayCanvas
					points={points}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					className="w-full h-full block relative z-10"
				/>

				{pointsLength === 0 && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col gap-2">
						<Crosshair className="text-zinc-800" size={32} />
						<span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
							Waiting for input
						</span>
					</div>
				)}
			</div>

			<div className="p-4 space-y-4 bg-gradient-to-b from-[#0c0c0e] to-[#050505] border-t border-white/5">
				<div className="flex justify-between items-center text-[10px] font-mono">
					<div className="flex items-center gap-2">
						<span className="text-zinc-500 uppercase tracking-wider">
							Status
						</span>
						{isRecording ? (
							<span className="flex items-center gap-1.5 text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 animate-pulse font-bold">
								<Disc size={8} className="fill-current" /> RECORDING
							</span>
						) : (
							<span className="flex items-center gap-1.5 text-zinc-500 bg-zinc-800/30 px-2 py-1 rounded border border-white/5">
								<Square size={8} className="fill-current" /> IDLE
							</span>
						)}
					</div>
					<div className="flex items-center gap-2">
						<span className="text-zinc-500 uppercase tracking-wider">
							Captures
						</span>
						<span className="text-zinc-200 font-bold bg-zinc-800/30 px-2 py-1 rounded min-w-[32px] text-center border border-white/5">
							{pointsLength}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-4 gap-2">
					<button
						type="button"
						className={clsx(
							'col-span-2 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg',
							isRecording
								? 'bg-red-500 text-white hover:bg-red-600'
								: 'bg-white text-black hover:bg-zinc-200',
						)}
						onClick={onToggleRecording}
					>
						{isRecording ? (
							<Square size={14} fill="currentColor" />
						) : (
							<Play size={14} fill="currentColor" />
						)}
						{isRecording ? 'STOP' : 'RECORD'}
					</button>

					<button
						type="button"
						disabled={pointsLength === 0 || isRecording}
						className="col-span-1 rounded-xl font-medium text-xs bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
						onClick={onSaveClick}
						title="Save Pattern"
					>
						<Save size={16} />
					</button>

					<button
						type="button"
						className="col-span-1 rounded-xl font-medium text-xs bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 transition-all flex items-center justify-center"
						onClick={onClearClick}
						title="Clear All"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>
		</motion.div>
	)
}
