import axios from 'axios';

const baseURL = typeof window !== 'undefined'
  ? ''
  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
