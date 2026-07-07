export type Route =
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'customers-list'; success?: string }
  | { name: 'customer-add' }
  | { name: 'customer-view'; id: string; success?: string }
  | { name: 'customer-edit'; id: string };
