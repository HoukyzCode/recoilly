import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ipcService } from '@/services/ipcService'
import { tauriFileSystemStorage } from '@/stores/middlewares/tauriFileSystemStorage'

interface SettingsState {
	accentColor: string
	darkMode: boolean
	overlayEnabled: boolean
	streamerMode: boolean
	sensitivity: number

	setAccentColor: (color: string) => void
	toggleDarkMode: () => void
	toggleOverlay: () => void
	toggleStreamerMode: () => void
	setSensitivity: (sensitivity: number) => void
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			accentColor: '#a855f7',
			darkMode: true,
			overlayEnabled: true,
			streamerMode: false,
			sensitivity: 1.0,

			setAccentColor: (color) => {
				set({ accentColor: color })
				document.documentElement.style.setProperty(
					'--color-accent-primary',
					color,
				)
			},

			toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

			toggleOverlay: () => {
				set((state) => {
					const newState = !state.overlayEnabled

					if (newState) {
						ipcService.showWindow().catch(console.error)
					} else {
						ipcService.hideWindow().catch(console.error)
					}

					return { overlayEnabled: newState }
				})
			},

			toggleStreamerMode: () =>
				set((state) => ({ streamerMode: !state.streamerMode })),

			setSensitivity: (sensitivity) => set({ sensitivity }),
		}),
		{
			name: 'recoilly-settings',
			storage: createJSONStorage(() => tauriFileSystemStorage),
			onRehydrateStorage: () => (state) => {
				if (state) {
					document.documentElement.style.setProperty(
						'--color-accent-primary',
						state.accentColor,
					)
				}
			},
		},
	),
)
