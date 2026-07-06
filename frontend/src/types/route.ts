export type Route =
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'customers-list' }
  | { name: 'customer-add' }
  | { name: 'customer-view'; id: string }
  | { name: 'customer-edit'; id: string };
