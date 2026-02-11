interface LensProps {
	screenshot: string | null
	cursorPos: { x: number; y: number }
	showLens: boolean
	isZoomEnabled: boolean
	zoomLevel?: number
	size?: number
}

const ZOOM_LEVEL = 3
const LENS_SIZE = 180

export function Lens({
	screenshot,
	cursorPos,
	showLens,
	isZoomEnabled,
	zoomLevel = ZOOM_LEVEL,
	size = LENS_SIZE,
}: LensProps) {
	if (!screenshot || !showLens || !isZoomEnabled) return null

	return (
		<div
			className="fixed pointer-events-none rounded-full border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] z-40 overflow-hidden bg-no-repeat"
			style={{
				width: size,
				height: size,
				left: cursorPos.x - size / 2,
				top: cursorPos.y - size / 2,
				backgroundImage: `url(${screenshot})`,
				backgroundSize: `${window.innerWidth * zoomLevel}px ${window.innerHeight * zoomLevel}px`,
				backgroundPositionX: -cursorPos.x * zoomLevel + size / 2,
				backgroundPositionY: -cursorPos.y * zoomLevel + size / 2,
			}}
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="w-0.5 h-3 bg-purple-500/90 shadow-sm" />
				<div className="h-0.5 w-3 bg-purple-500/90 absolute shadow-sm" />
			</div>
		</div>
	)
}
