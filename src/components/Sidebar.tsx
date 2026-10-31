import {
  Activity, Box, ChevronDown, Cloud, Columns3, GitBranch,
  LayoutDashboard, Settings2, ShieldCheck,
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brandIcon"><Cloud size={19} fill="currentColor" strokeWidth={2.5} /></span>
        <span>runforge<span className="brandPeriod">.</span></span>
      </div>

      <div className="sidebarGroupLabel">WORKSPACE</div>
      <div className="workspacePicker">
        <span className="workspaceAvatar">W</span>
        <span>Workspace</span>
        <ChevronDown size={15} />
      </div>

      <div className="sidebarGroupLabel sidebarGroupLabel--nav">PLATFORM</div>
      <nav aria-label="Main navigation">
        <div className="navItem navItem--active"><Activity size={18} /> Runs <span className="navCount">10</span></div>
        <div className="navItem"><LayoutDashboard size={18} /> Projects</div>
        <div className="navItem"><Box size={18} /> Devboxes</div>
        <div className="navItem"><Columns3 size={18} /> Previews</div>
        <div className="navItem"><GitBranch size={18} /> Snapshots</div>
      </nav>

      <div className="sidebarBottom">
        <div className="sidebarDivider" />
        <div className="navItem"><Settings2 size={18} /> Settings</div>
        <div className="navItem"><ShieldCheck size={18} /> Documentation</div>
        <div className="sidebarUser">
          <span className="userAvatar">JD</span>
          <span className="sidebarUserInfo">
            <b>John Developer</b>
            <small>Free workspace</small>
          </span>
          <ChevronDown size={15} />
        </div>
      </div>
    </aside>
  );
}
