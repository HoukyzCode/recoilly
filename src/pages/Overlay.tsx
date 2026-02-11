import { listen } from '@tauri-apps/api/event'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Lens } from '@/features/overlay/Lens'
import { OverlayControls } from '@/features/overlay/OverlayControls'
import { SavePatternModal } from '@/features/overlay/SavePatternModal'
import { SprayMinimap } from '@/features/visualization/SprayMinimap'
import type { Vec2 } from '@/types/vec'

export function Overlay() {
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
	const [screenshot, setScreenshot] = useState<string | null>(null)
	const [isRecording, setIsRecording] = useState(false)
	const [showLens, setShowLens] = useState(true)
	const [points, setPoints] = useState<Vec2[]>([])

	const mainRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const unlisten = listen<string>('screenshot-captured', (event) => {
			setScreenshot(event.payload)
		})
		return () => {
			unlisten.then((f) => f())
		}
	}, [])

	const handleScreenClick = (event: React.MouseEvent) => {
		if (!isRecording || isSaveModalOpen) return
		if (event.target !== mainRef.current) return
		setPoints((prev) => [...prev, { x: event.clientX, y: event.clientY }])
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (showLens) setCursorPos({ x: e.clientX, y: e.clientY })
	}

	return (
		<motion.main
			ref={mainRef}
			onClick={handleScreenClick}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setShowLens(true)}
			onMouseLeave={() => setShowLens(false)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="w-screen h-screen relative cursor-crosshair bg-cover bg-center bg-no-repeat overflow-hidden selection:bg-none font-sans"
			style={{
				backgroundImage: screenshot ? `url(${screenshot})` : 'none',
			}}
		>
			<Lens
				screenshot={screenshot}
				cursorPos={cursorPos}
				showLens={showLens && !isSaveModalOpen}
				isZoomEnabled={showLens}
			/>

			{points.map((p, i) => (
				<div
					key={`${i}-${p.x}`}
					className="absolute w-2 h-2 bg-purple-500 rounded-full border border-white/80 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
					style={{ left: p.x, top: p.y }}
				/>
			))}

			<motion.div
				className="absolute top-8 left-8 z-50 pointer-events-auto"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				drag
				dragConstraints={mainRef}
			>
				{points.length > 5 && (
					<SprayMinimap
						points={points}
						accentColor="#a855f7"
						isFiring={isRecording}
						rpm={600}
					/>
				)}
			</motion.div>

			<OverlayControls
				pointsLength={points.length}
				isRecording={isRecording}
				points={points}
				onToggleRecording={() => setIsRecording(!isRecording)}
				onClearClick={() => setPoints([])}
				onSaveClick={() => setIsSaveModalOpen(true)}
				onToggleZoom={() => setShowLens((prev) => !prev)}
				isZoomEnabled={showLens}
				dragConstraints={mainRef}
			/>

			<AnimatePresence>
				{isSaveModalOpen && (
					<SavePatternModal
						isOpen={isSaveModalOpen}
						onClose={() => setIsSaveModalOpen(false)}
						onSave={() => {
							setIsSaveModalOpen(false)
							setPoints([])
						}}
						currentPoints={points}
					/>
				)}
			</AnimatePresence>
		</motion.main>
	)
}
