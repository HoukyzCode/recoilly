import { listen } from '@tauri-apps/api/event'
import { useEffect } from 'react'
import { useLibraryStore } from '@/stores/library'

export const useStoreSync = () => {
	useEffect(() => {
		const unlistenPromise = listen('storage_sync_event', () => {
			useLibraryStore.persist.rehydrate()
		})

		return () => {
			unlistenPromise.then((unlisten) => unlisten())
		}
	}, [])
}
