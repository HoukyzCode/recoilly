import { invoke } from '@tauri-apps/api/core'
import { ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router'

export function OverlayMode() {
	const navigate = useNavigate()

	const overlayMode = async () => {
		await invoke('overlay_mode')

		navigate('/overlay-mode', {
			flushSync: true,
			replace: true,
		})
	}

	return (
		<button
			type="button"
			onClick={overlayMode}
			className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 flex items-center gap-2 cursor-pointer"
		>
			<ShieldCheck className="w-3 h-3" /> Overlay Mode
		</button>
	)
}
