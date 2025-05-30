export interface PermissionNode {
  name: string;
  key: string;
  isGroup: boolean;
  children?: PermissionNode[];
  checked?: boolean;
  expanded?: boolean;
  indeterminate?: boolean;
}