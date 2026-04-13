import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavItem = ({ item, to, icon: Icon }) => {
  return (
      <NavLink to={to} className={({ isActive }) => `flex flex-row gap-2 items-center text-xl font-medium p-3 ${isActive ? ' bg-sidebar-primary ' : ' hover:bg-sidebar-primary-foreground'} transition-colors duration-400`}>
      {Icon ? <Icon className="w-8 h-8" /> : <span className="inline-block w-6 h-6 rounded bg-gray-400" />}
      {item}
    </NavLink>
  )
}
