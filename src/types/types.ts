export type SidebarContextType = {
  active: boolean,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  triggerSidebar: () => void;
}