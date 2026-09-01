import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ChevronDown, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useNavigation } from '../../context/NavigationContext';
import { DynamicNavigationNode } from '../../types';
import { DynamicIcon } from './DynamicIcon';

export type ActiveTab = string;

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { currentTenant } = useTenant();
  const { 
    navigationTree, 
    pinnedItems, 
    isCollapsed, 
    togglePinItem 
  } = useNavigation();

  // Track expanded parent nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    nav_dashboard: true,
    sec_main: true,
    sec_academics: true,
    sec_layout: true,
    sec_forms: true,
    sec_extra: true
  });

  // Helper to check precise node matching without multi-highlighting items sharing same route
  const isNodeMatchingActive = (n: DynamicNavigationNode): boolean => {
    if (n.id === activeTab) return true;
    if (n.route === activeTab) {
      // Check if activeTab specifically matches a node ID in the navigation tree
      const isNodeIdInTree = (items: DynamicNavigationNode[]): boolean => {
        return items.some(item => item.id === activeTab || (item.children && isNodeIdInTree(item.children)));
      };
      // If activeTab is an explicit node ID, do not match other sibling nodes just because they share route
      if (isNodeIdInTree(navigationTree)) {
        return false;
      }
      return true;
    }
    return false;
  };

  // Auto-expand parents when activeTab matches child
  useEffect(() => {
    navigationTree.forEach(node => {
      if (node.children && node.children.some(c => isNodeMatchingActive(c) || (c.children && c.children.some(isNodeMatchingActive)))) {
        setExpandedNodes(prev => ({ ...prev, [node.id]: true }));
      }
    });
  }, [activeTab, navigationTree]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'pink':
        return 'bg-[#ff4081] text-white';
      case 'emerald':
        return 'bg-emerald-500 text-white';
      case 'amber':
        return 'bg-amber-500 text-white';
      case 'sky':
        return 'bg-sky-500 text-white';
      default:
        return 'bg-indigo-500 text-white';
    }
  };

  // Recursive menu item renderer
  const renderNavNode = (node: DynamicNavigationNode, depth = 0) => {
    // 1. Section Header (e.g. "-- Main", "-- Academic Modules")
    if (node.isSectionHeader) {
      if (isCollapsed) {
        return (
          <div key={node.id} className="my-2 border-t border-[#1e2738]/60" />
        );
      }
      return (
        <div 
          key={node.id} 
          className="px-3 pt-3 pb-1 text-[11px] font-semibold text-slate-400 tracking-wide uppercase select-none"
        >
          {node.label}
        </div>
      );
    }

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] ?? false;
    const isItemActive = isNodeMatchingActive(node) || (hasChildren && node.children?.some(c => isNodeMatchingActive(c)));

    // Collapsed mode item (Icon-rail with tooltip)
    if (isCollapsed) {
      const targetTab = node.id || node.route;
      return (
        <div key={node.id} className="relative group flex justify-center py-1">
          <button
            onClick={() => {
              if (targetTab) {
                onSelectTab(targetTab);
              } else if (hasChildren && node.children && ((node.children[0] || {}).id || (node.children[0] || {}).route)) {
                onSelectTab((node.children[0] || {}).id || (node.children[0] || {}).route!);
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isItemActive
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-[#20293a]'
            }`}
            title={node.label}
          >
            <DynamicIcon name={node.icon} className="w-5 h-5" />
          </button>

          {/* Collapsed Tooltip */}
          <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#18202e] text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap hidden group-hover:block z-50 pointer-events-none">
            {node.label}
            {node.badge && (
              <span className={`ml-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full uppercase ${getBadgeStyle(node.badge.variant)}`}>
                {node.badge.text}
              </span>
            )}
          </div>
        </div>
      );
    }

    const isThisDirectlyActive = isNodeMatchingActive(node);
    const targetTab = node.id || node.route;

    // Expanded Multi-Level Tree Item
    return (
      <div key={node.id} className="space-y-0.5">
        <div
          className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
            isThisDirectlyActive
              ? 'bg-[#1c2433] text-white font-semibold'
              : 'text-slate-300 hover:bg-[#20293a] hover:text-white'
          }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
              if (targetTab) onSelectTab(targetTab);
            } else if (targetTab) {
              onSelectTab(targetTab);
            }
          }}
        >
          <div className="flex items-center gap-3 truncate min-w-0">
            <DynamicIcon 
              name={node.icon} 
              className={`w-4 h-4 shrink-0 ${isThisDirectlyActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`} 
            />
            <span className="truncate">{node.label}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {node.badge && (
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-tight ${getBadgeStyle(node.badge.variant)}`}>
                {node.badge.text}
              </span>
            )}

            {hasChildren && (
              <span className="text-slate-400 group-hover:text-slate-200">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}

            {!hasChildren && node.route && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinItem(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-amber-400 transition-opacity"
                title="Pin / Favorite"
              >
                <Star className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Render Child Hierarchy */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 border-l border-slate-700/50 ml-4 pl-1">
            {node.children!.map(child => renderNavNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`shrink-0 bg-[#273246] text-slate-300 flex flex-col justify-between select-none border-r border-[#1e2738] min-h-screen z-20 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header: Spice Theme Flame Logo */}
        <div className={`h-16 flex items-center bg-[#20293a] border-b border-[#1c2433] transition-all ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#ff5252] flex items-center justify-center text-white shadow-md shrink-0">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-white text-lg tracking-wider font-sans leading-tight">
                  Spice
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5 truncate max-w-[130px]">
                  {currentTenant?.name || 'School EMS'}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 shrink-0" title="System Active" />
          )}
        </div>

        {/* Pinned Favorites Quick Section (When available) */}
        {!isCollapsed && pinnedItems.length > 0 && (
          <div className="px-3 pt-2.5 pb-1.5 bg-[#202838]/70 border-b border-[#1c2433]">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 px-1">
              <span className="flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-400" />
                Pinned Favorites
              </span>
              <span className="text-slate-500 font-normal">({pinnedItems.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pinnedItems.slice(0, 4).map(pin => (
                <button
                  key={`pin_${pin.id}`}
                  onClick={() => pin.route && onSelectTab(pin.route)}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                    activeTab === pin.route
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-transparent'
                  }`}
                >
                  <DynamicIcon name={pin.icon} className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[80px]">{pin.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Scrollable Navigation Tree */}
        <div className="py-3 px-2.5 space-y-1 overflow-y-auto flex-1 text-xs custom-scrollbar">
          {navigationTree.map(node => renderNavNode(node))}
        </div>

        {/* Footer Info */}
        <div className={`p-3 bg-[#1e2738] border-t border-[#18202e] text-slate-400 flex items-center justify-between text-xs ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="truncate">
              <p className="font-semibold text-slate-200 truncate">{currentTenant?.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">Dynamic Navigation Engine • v4.0</p>
            </div>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Engine Online" />
          )}
        </div>
      </div>
    </aside>
  );
};
