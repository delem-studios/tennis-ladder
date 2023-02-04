import PocketBase from 'pocketbase';

console.log('Is prod:', import.meta.env.PROD);
console.log(
  'Client URL:',
  import.meta.env.PROD ? 'http://146.190.43.123' : 'http://127.0.0.1:8090'
);
export const client = new PocketBase(
  import.meta.env.PROD ? 'http://146.190.43.123' : 'http://127.0.0.1:8090'
);
