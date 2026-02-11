import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { tauriFileSystemStorage } from '@/stores/middlewares/tauriFileSystemStorage'
import type { Base64 } from '@/types/base64'
import type { Vec2 } from '@/types/vec'

enableMapSet()

export type Weapon = {
	id: string
	name: string
	type: string | 'Rifle' | 'Pistol' | 'SMG' | 'Shotgun' | 'Sniper'
	active: boolean
	pattern: Vec2[]
	image: Base64
	rpm: number
	sensitivity: number
	steps: number
}

export type LibraryState = {
	weapons: Map<string, Weapon>
	activeWeaponId: string | null
}

export type LibraryActions = {
	add: (weapon: Weapon) => void
	remove: (id: string) => void
	update: (id: string, changes: Partial<Weapon>) => void
	get: (id: string) => Weapon | undefined
	getAll: () => Weapon[]
}

type PersistedState = {
	weapons: Weapon[]
	activeWeaponId: string | null
}

const initialState: LibraryState = {
	weapons: new Map<string, Weapon>(),
	activeWeaponId: null,
}

export const useLibraryStore = create<LibraryState & LibraryActions>()(
	persist(
		immer((set, get) => ({
			...initialState,
			add: (weapon: Weapon) =>
				set((state) => {
					state.weapons.set(weapon.id, weapon)
				}),
			remove: (id: string) =>
				set((state) => {
					state.weapons.delete(id)
				}),
			update: (id: string, changes: Partial<Weapon>) =>
				set((state) => {
					const weapon = state.weapons.get(id)
					if (!weapon) return

					Object.assign(weapon, changes)
				}),
			get: (id: string) => get().weapons.get(id),
			getAll: () => Array.from(get().weapons.values()),
		})),
		{
			name: 'library-storage',
			storage: createJSONStorage(() => tauriFileSystemStorage),
			partialize: (state) => ({
				weapons: Array.from(state.weapons.values()),
				activeWeaponId: state.activeWeaponId,
			}),
			merge: (persistedState, currentState) => {
				const saved = persistedState as PersistedState

				return {
					...currentState,
					activeWeaponId: saved.activeWeaponId,
					weapons: new Map(saved.weapons.map((w) => [w.id, w])),
				}
			},
		},
	),
)
