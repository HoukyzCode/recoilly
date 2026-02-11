import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router'
import { useSettingsStore } from '@/stores/settingsStore'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function Layout() {
	const location = useLocation()
	const accentColor = useSettingsStore((s) => s.accentColor)

	return (
		<main
			className="w-screen h-screen bg-neutral-950 flex overflow-hidden text-neutral-200 font-sans selection:bg-accent-primary/30"
			style={{
				['--color-accent-primary' as any]: accentColor,
				['--color-accent-glow' as any]: `${accentColor}80`, // 50% opacity
			}}
		>
			<Sidebar />

			<div className="flex-1 flex flex-col h-full relative">
				<TopBar />

				{/* AnimatePresence for smooth route transitions */}
				<div className="flex-1 overflow-y-auto relative z-10 p-6 scrollbar-hide">
					<AnimatePresence mode="wait">
						<Outlet key={location.pathname} />
					</AnimatePresence>
				</div>
			</div>
		</main>
	)
}
