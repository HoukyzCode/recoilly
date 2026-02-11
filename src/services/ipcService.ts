import { invoke } from '@tauri-apps/api/core'
import type { Weapon } from '@/stores/library'

export const ipcService = {
	async invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
		try {
			return await invoke<T>(cmd, args)
		} catch (error) {
			console.error(`IPC Error [${cmd}]:`, error)
			throw error
		}
	},

	async loadPayloads(weapons: Weapon[]): Promise<void> {
		const payloads = weapons.map((payload) => {
			return {
				id: payload.id,
				points: payload.pattern,
				sensitivity: payload.sensitivity,
				steps: payload.steps,
				rpm: payload.rpm,
				image: payload.image,
			}
		})

		await this.invoke('load_payloads', { payloads })
	},

	async setCurrentPayload(id: string): Promise<void> {
		await this.invoke('set_current', { id })
	},

	async hideWindow(): Promise<void> {
		return this.invoke('hidden_window')
	},

	async showWindow(): Promise<void> {
		return this.invoke('show_window')
	},

	async setIgnoreCursorEvents(ignore: boolean): Promise<void> {
		return this.invoke('set_ignore_cursor_events', { ignore })
	},
}
