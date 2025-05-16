export interface MenuItem {
  name: string;
  icon: string;
  route: string;
  isCollapsed: boolean;
  permission?: string;
  subItems?: MenuItem[];
}