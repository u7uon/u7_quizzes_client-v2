import AxiosClient from '../utils/AxiosClient'

export default {
  async login(loginDto) {
    if (!loginDto.UserName || !loginDto.Password) {
      return { isSuccess: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' }
    }
    try {
      const response = await AxiosClient.post('auth/login', loginDto)
      const accessToken = response.data?.accessToken
      if (accessToken) {
        localStorage.setItem('AccessToken', accessToken)
      }
      return { isSuccess: true, message: 'Đăng nhập thành công' }
    } catch (error) {
      const msg = getErrorMessage(error)
      console.error('Login error:', msg)
      return { isSuccess: false, message: msg }
    }
  },

  async register(registerDto) {
    if (
      !registerDto.UserName ||
      !registerDto.Email ||
      !registerDto.Password ||
      !registerDto.ConfirmPassword
    ) {
      return { isSuccess: false, message: 'Vui lòng điền đầy đủ thông tin đăng ký.' }
    }
    if (registerDto.Password !== registerDto.ConfirmPassword) {
      return { isSuccess: false, message: 'Mật khẩu và xác nhận mật khẩu không khớp.' }
    }
    try {
      await AxiosClient.post('auth/register', registerDto)
      return { isSuccess: true, message: 'Đăng ký thành công' }
    } catch (error) {
      return { isSuccess: false, message: getErrorMessage(error) }
    }
  }
}

// Hàm xử lý lỗi trả về từ server
function getErrorMessage(error) {
  if (error.response && error.response.data) {
    if (typeof error.response.data === 'string') return error.response.data
    if (error.response.data.message) return error.response.data.message
  }
  return `Error: ${error.response?.status || error.message}`
}