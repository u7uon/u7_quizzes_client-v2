import axios from 'axios'

// Tạo một instance dùng chung cho toàn bộ app
const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Nếu cần gửi cookie cùng request
})

// Thêm interceptor cho request để tự động gắn token nếu có
AxiosClient.interceptors.request.use(
)

// Thêm interceptor cho response để xử lý lỗi chung
AxiosClient.interceptors.response.use(
  response => response,
  error => {
    // Có thể xử lý lỗi toàn cục ở đây (ví dụ: thông báo, chuyển hướng...)
    return Promise.reject(error)
  }
)

export default AxiosClient