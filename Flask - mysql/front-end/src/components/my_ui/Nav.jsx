import { NavLink } from "react-router-dom"
import { NavItem } from "./NavItem"
import { ClipboardCheck,Users  } from 'lucide-react';

const Nav = () => {
  return (
    <nav className="flex flex-col gap-3">
      
        <NavItem item="Tasks" to="/" icon={ClipboardCheck} />
        <NavItem item="Users" to="/users" icon={Users } />
    </nav>
  )
}

export default Nav