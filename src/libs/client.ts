import PocketBase from 'pocketbase';

export const client = new PocketBase(
  import.meta.env.PROD ? 'http://146.190.43.123' : 'http://127.0.0.1:8090'
);
