import { useEffect, useRef } from 'react'
import type { Vec2 } from '@/types/vec'

interface OverlayCanvasProps {
	points: Vec2[]
	className?: string
	width?: number
	height?: number
	isRecording?: boolean
	onAddPoint?: (p: Vec2) => void
	onCursorMove?: (p: Vec2) => void
	onScreenshot?: (dataUrl: string) => void
}

export function OverlayCanvas({
	points,
	className,
	width,
	height,
}: OverlayCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		if (width) canvas.width = width
		if (height) canvas.height = height

		if (canvas.width === 0 || canvas.height === 0) {
		}

		const ctx = canvas.getContext('2d')
		if (!ctx) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		if (points.length === 0) return

		ctx.beginPath()
		ctx.lineWidth = 3
		ctx.strokeStyle = '#a855f7'
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'

		const mapX = (x: number) => (x / window.innerWidth) * canvas.width
		const mapY = (y: number) => (y / window.innerHeight) * canvas.height

		ctx.moveTo(mapX(points[0].x), mapY(points[0].y))
		points.forEach((p) => {
			ctx.lineTo(mapX(p.x), mapY(p.y))
		})
		ctx.stroke()

		points.forEach((p) => {
			const px = mapX(p.x)
			const py = mapY(p.y)

			ctx.fillStyle = '#09090b'
			ctx.strokeStyle = '#a855f7'
			ctx.lineWidth = 2
			ctx.beginPath()
			ctx.arc(px, py, 3, 0, Math.PI * 2)
			ctx.fill()
			ctx.stroke()
		})

		if (points.length > 0) {
			const last = points[points.length - 1]
			const lx = mapX(last.x)
			const ly = mapY(last.y)
			ctx.fillStyle = '#fff'
			ctx.beginPath()
			ctx.arc(lx, ly, 2, 0, Math.PI * 2)
			ctx.fill()
		}
	}, [points, width, height])

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			className={className || 'fixed inset-0 pointer-events-none z-10'}
		/>
	)
}
