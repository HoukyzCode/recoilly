import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Minus, X } from 'lucide-react'
import { OverlayMode } from '../OverlayMode'

export function TopBar() {
	const appWindow = getCurrentWindow()

	const closeWindow = async () => {
		await invoke('hidden_window')
	}

	return (
		<header
			data-tauri-drag-region
			className="h-[60px] w-full flex items-center justify-between px-8 bg-transparent select-none z-50 pt-4"
		>
			<div className="flex items-center gap-4 pointer-events-none">
				<h1 className="text-sm font-medium tracking-widest uppercase text-neutral-500">
					Recoilly <span className="text-white font-bold">Pro</span>
				</h1>
			</div>

			<div className="flex items-center gap-6">
				<OverlayMode />

				<div className="h-6 w-px bg-white/10 mx-2" />

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => appWindow.minimize()}
						className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
					>
						<Minus className="w-5 h-5" />
					</button>
					<button
						type="button"
						onClick={() => closeWindow()}
						className="p-2 rounded-full text-neutral-400 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>
		</header>
	)
}
