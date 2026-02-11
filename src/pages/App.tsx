import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { useShallow } from 'zustand/shallow'
import { Layout } from '@/components/layout/Layout'
import { useStoreSync } from '@/hooks/useStoreSync'
import { About } from '@/pages/About'
import { Home } from '@/pages/Home'
import { Scripts } from '@/pages/Library'
import { Overlay } from '@/pages/Overlay'
import { Settings } from '@/pages/Settings'
import { ipcService } from '@/services/ipcService'
import { useLibraryStore } from '@/stores/library'

export function App() {
	useStoreSync()

	const weapons = useLibraryStore(
		useShallow((state) => Array.from(state.weapons.values())),
	)

	useEffect(() => {
		ipcService.loadPayloads(weapons)
	}, [weapons])

	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/scripts" element={<Scripts />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/about" element={<About />} />
				{/* Catch-all redirect to home */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>

			<Route path="/overlay" element={<Overlay />} />
		</Routes>
	)
}
