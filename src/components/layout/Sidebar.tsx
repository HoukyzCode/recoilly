import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Home, Info, Layers, Settings } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'

export function Sidebar() {
	const location = useLocation()
	const navItems = [
		{ icon: Home, label: 'Home', path: '/' },
		{ icon: Layers, label: 'Lib', path: '/scripts' },
		{ icon: Settings, label: 'Cfg', path: '/settings' },
		{ icon: Info, label: 'Info', path: '/about' },
	]

	return (
		<aside className="w-[72px] h-full flex flex-col items-center py-6 bg-neutral-950 border-r border-white/5 z-20">
			<div className="mb-8">
				<div className="w-10 h-10 rounded-xl bg-accent-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-accent-primary/20">
					R
				</div>
			</div>

			<nav className="flex flex-col gap-3 w-full px-3">
				{navItems.map((item) => {
					const isActive = location.pathname === item.path

					return (
						<NavLink
							key={item.path}
							to={item.path}
							className={clsx(
								'relative w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-colors duration-200 group',
								isActive
									? 'text-white'
									: 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5',
							)}
						>
							{isActive && (
								<motion.div
									layoutId="v4ActiveTab"
									className="absolute inset-0 bg-neutral-800 rounded-xl -z-10 border border-white/5"
									transition={{ type: 'spring', stiffness: 400, damping: 30 }}
								/>
							)}

							<item.icon
								className="w-5 h-5 mb-1 relative z-10"
								strokeWidth={2}
							/>
							<span className="text-[9px] uppercase font-bold tracking-wider opacity-60 group-hover:opacity-100 relative z-10">
								{item.label}
							</span>
						</NavLink>
					)
				})}
			</nav>
		</aside>
	)
}
