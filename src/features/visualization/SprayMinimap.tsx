/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import clsx from 'clsx'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'

interface Point {
	x: number
	y: number
}

interface Props {
	points: Point[]
	accentColor: string
	isFiring: boolean
	rpm: number
	zoom?: number
}

export const SprayMinimap = ({
	points,
	accentColor,
	isFiring,
	rpm,
	zoom = 1.0,
}: Props) => {
	const [sprayId, setSprayId] = useState(0)
	const VIEW_RANGE = 400

	useEffect(() => {
		if (isFiring) {
			setSprayId((prev) => prev + 1)
		}
	}, [isFiring])

	const relativePoints = useMemo(() => {
		if (points.length === 0) return []
		const startPoint = points[0]
		return points.map((p) => ({
			x: (p.x - startPoint.x) * zoom,
			y: (p.y - startPoint.y) * zoom,
		}))
	}, [points, zoom])

	if (points.length === 0) return null

	const timePerShot = 60 / rpm

	const pathData = relativePoints.reduce(
		(acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
		'',
	)

	const viewBoxOffset = VIEW_RANGE / 2
	const viewBox = `-${viewBoxOffset} -${viewBoxOffset} ${VIEW_RANGE} ${VIEW_RANGE}`

	return (
		<div
			className={clsx(
				'fixed bottom-6 right-6 w-[260px] h-[260px]',
				'bg-[#050505]/95 rounded-2xl border transition-all duration-300 overflow-hidden',
				'flex items-center justify-center shadow-2xl backdrop-blur-xl',
				isFiring
					? 'border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.2)] scale-105'
					: 'border-white/5 scale-100',
			)}
		>
			<div
				className="absolute inset-0 opacity-20 pointer-events-none"
				style={{
					backgroundImage:
						'radial-gradient(circle, #52525b 1px, transparent 1px)',
					backgroundSize: '20px 20px',
				}}
			/>

			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
				<div className="h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent absolute" />
			</div>

			<div className="absolute top-4 left-4 flex items-center gap-2 bg-[#0a0a0a]/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md shadow-lg pointer-events-none z-20">
				<div
					className={clsx(
						'w-1.5 h-1.5 rounded-full transition-colors duration-300',
						isFiring
							? 'bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,1)]'
							: 'bg-zinc-600',
					)}
				/>
				<span
					className={clsx(
						'text-[10px] font-bold tracking-widest font-mono transition-colors duration-300',
						isFiring ? 'text-purple-400' : 'text-zinc-500',
					)}
				>
					{isFiring ? 'LIVE RECOIL' : 'PREVIEW'}
				</span>
			</div>

			{isFiring && (
				<div className="absolute bottom-4 right-4 pointer-events-none z-20 bg-[#0a0a0a]/50 px-2 py-1 rounded border border-white/5">
					<span className="text-[10px] font-mono text-purple-300/80 tracking-wider">
						{rpm} RPM
					</span>
				</div>
			)}

			<svg
				key={sprayId}
				viewBox={viewBox}
				className="w-full h-full p-6 relative z-10 overflow-visible"
			>
				{relativePoints.length > 0 && (
					<>
						<path
							d={pathData}
							fill="none"
							stroke={accentColor}
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							className={isFiring ? 'path-animation' : 'opacity-40'}
							style={
								isFiring
									? ({
											animationDuration: `${timePerShot * points.length}s`,
										} as React.CSSProperties)
									: { strokeDasharray: 'none', strokeDashoffset: 0 }
							}
						/>

						{relativePoints.map((p, i) => (
							<circle
								key={`${p.x}-${p.y}-dot`}
								cx={p.x}
								cy={p.y}
								r="3.5"
								fill="#09090b"
								stroke={accentColor}
								strokeWidth="1.5"
								className={isFiring ? 'bullet-impact' : ''}
								style={
									isFiring
										? ({
												animationDelay: `${i * timePerShot}s`,
											} as React.CSSProperties)
										: { opacity: 1 }
								}
							/>
						))}

						<circle
							cx={0}
							cy={0}
							r="4.5"
							fill="white"
							stroke={accentColor}
							strokeWidth="1"
							className="shadow-sm"
						/>
					</>
				)}
			</svg>

			<style>{`
        .path-animation {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawPath linear forwards;
          filter: drop-shadow(0 0 6px ${accentColor});
          opacity: 1;
        }

        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }

        .bullet-impact {
          opacity: 0;
          animation: bloom 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes bloom {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.8);
            fill: ${accentColor};
            stroke-width: 0;
          }
          100% {
            opacity: 1;
            transform: scale(1);
            fill: #09090b;
            stroke-width: 1.5px;
          }
        }
      `}</style>
		</div>
	)
}
