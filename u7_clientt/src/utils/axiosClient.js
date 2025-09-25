import axios from 'axios'
import router from '../router' // Adjust path as needed
import _auth   from '../services/AuthService' // Adjust import as needed

// Tạo một instance dùng chung cho toàn bộ app
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Request interceptor - không cần gắn token vì đã dùng cookie
axiosClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - xử lý refresh token
axiosClient.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Kiểm tra nếu đã thử refresh token rồi
          if (originalRequest._retry) {
            router.push('/login?return_url=' + router.currentRoute.value.fullPath)
            return Promise.reject(error)
          }

          // Kiểm tra nếu request này là refresh-token
          if (originalRequest.url.includes('/auth/refresh-token')) {
            router.push('/login?return_url=' + router.currentRoute.value.fullPath)
            return Promise.reject(error)
          }

          originalRequest._retry = true

          if (isRefreshing) {
            // Nếu đang refresh, đợi kết quả
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            }).then(() => {
              return axiosClient(originalRequest) // ✅ Fixed: consistent client usage
            }).catch(err => {
              return Promise.reject(err)
            })
          }

          isRefreshing = true

          try {
            const refreshResult = await _auth.refreshToken()
            if (refreshResult) {
              processQueue(null) // ✅ Queue thành công
              return axiosClient(originalRequest) // ✅ Retry request
            } else {
              throw new Error('Refresh token failed')
            }
          } catch (refreshError) {
            // Refresh token thất bại -> logout
            processQueue(refreshError) // ✅ Fixed: correct parameters
            
            // Không cần clear localStorage vì dùng cookie
            router.push('/login?return_url=' + router.currentRoute.value.fullPath)
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }

        case 403:
          console.error('Không có quyền truy cập')
          break
        case 404:
          console.error('API không tồn tại')
          break
        case 500:
          console.error('Lỗi server')
          break
        default:
          console.error('Lỗi không xác định:', data?.message || error.message)
      }

      return Promise.reject(data || error.response)
    } else if (error.request) {
      // Network error
      console.error('Lỗi kết nối mạng')
      return Promise.reject({ message: 'Lỗi kết nối mạng' })
    } else {
      console.error('Lỗi:', error.message)
      return Promise.reject(error)
    }
  }
)

export default axiosClient