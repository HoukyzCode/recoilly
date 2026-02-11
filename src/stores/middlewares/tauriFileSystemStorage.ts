import { invoke } from '@tauri-apps/api/core'
import { emit } from '@tauri-apps/api/event'
import type { StateStorage } from 'zustand/middleware'

const resolveFileName = (name: string): string => {
	return `${name.replace(/-/g, '.')}.json`
}

let saveTimeout: ReturnType<typeof setTimeout>

export const tauriFileSystemStorage: StateStorage = {
	getItem: async (name: string): Promise<string | null> => {
		const filename = resolveFileName(name)

		try {
			return await invoke<string>('read_config_file', { filename })
		} catch {
			return null
		}
	},

	setItem: async (name: string, value: string): Promise<void> => {
		const filename = resolveFileName(name)

		clearTimeout(saveTimeout)

		saveTimeout = setTimeout(async () => {
			await invoke('write_config_file', { filename, content: value })
			await emit('storage_sync_event', { key: name })
		}, 1000)
	},

	removeItem: async (name: string): Promise<void> => {
		const filename = resolveFileName(name)
		await invoke('delete_config_file', { filename })
	},
}
