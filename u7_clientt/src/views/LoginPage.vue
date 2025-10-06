<template>
  <div class="login-container">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Left Panel - Branding -->
    <div class="left-panel">
      <div class="branding-content">
        <div class="logo-section">
          <router-link to="/" class="logo-icon">
            <img src="../assets/img/logo.png" alt="" width="80" height="80" />
          </router-link>
    
        </div>
        <div class="feature-highlights">
          <div class="feature-item animate-slide-in" style="animation-delay: 0.2s;">
            <div class="feature-icon">
              <i class="fas fa-brain"></i>
            </div>
            <div class="feature-text">
              <h3>Học Tập Hiệu Quả</h3>
              <p>Hàng triệu câu hỏi cực hay được thu thập từ mọi nơi</p>
            </div>
          </div>
          <div class="feature-item animate-slide-in" style="animation-delay: 0.4s;">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="feature-text">
              <h3>Đa dạng các học tập</h3>
              <p>Làm trắc nghiệm với chế độ nhiều người hoặc một mình</p>
            </div>
          </div>
          <div class="feature-item animate-slide-in" style="animation-delay: 0.6s;">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="feature-text">
              <h3>Cộng Đồng Học Tập</h3>
              <p>Kết nối với hàng triệu học viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="right-panel">
      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">Chào Mừng Trở Lại!</h2>
          <p class="form-subtitle">Đăng nhập để tiếp tục hành trình học tập</p>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              Tên đăng nhập
            </label>
            <div class="input-wrapper">
              <input
                class="form-input"
                placeholder="Nhập tên đăng nhập của bạn"
                v-model="loginDTO.UserName"
                @focus="clearError"
                :class="{ error: usernameError }"
              />
              <div class="input-icon">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <div v-if="usernameError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Vui lòng nhập tên đăng nhập
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock"></i>
              Mật khẩu
            </label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Nhập mật khẩu của bạn"
                v-model="loginDTO.Password"
                @focus="clearError"
                :class="{ error: passwordError }"
              />
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <button type="button" class="password-toggle" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="passwordError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Vui lòng nhập mật khẩu
            </div>
          </div>

          <div class="form-options">
            <router-link to="/forgot-password" class="forgot-password">
              Quên mật khẩu?
            </router-link>
          </div>

          <div v-if="loginError" class="login-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ loginError }}
          </div>

          <button type="submit" class="login-button" :class="{ loading: isLoading }" :disabled="isLoading">
            <template v-if="isLoading">
              <div class="spinner"></div>
              <span>Đang đăng nhập...</span>
            </template>
            <template v-else>
              <i class="fas fa-arrow-right"></i>
              <span>Đăng Nhập</span>
            </template>
          </button>

          <div class="divider">
            <span>hoặc</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-button google" @click="loginWithGoogle">
              <i class="fab fa-google"></i>
              <span>Đăng nhập với Google</span>
            </button>
            <!-- <button type="button" class="social-button facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Đăng nhập với Facebook</span>
            </button> -->
          </div>

          <div class="signup-prompt">
            <p>Chưa có tài khoản?
              <router-link to="/register" class="signup-link">Đăng ký ngay</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

const router = useRouter()
const loginDTO = reactive({
  UserName: '',
  Password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const usernameError = ref(false)
const passwordError = ref(false)
const loginError = ref('')

function togglePassword() {
  showPassword.value = !showPassword.value
}

function clearError() {
  usernameError.value = false
  passwordError.value = false
  loginError.value = ''
}

function loginWithGoogle() {
  window.location.href = import.meta.env.VITE_API_BASE_URL + '/auth/google-login'
}

async function handleLogin() {
  usernameError.value = false
  passwordError.value = false
  loginError.value = ''

  if (!loginDTO.UserName) {
    usernameError.value = true
    return
  }
  if (!loginDTO.Password) {
    passwordError.value = true
    return
  }

  isLoading.value = true
  try {
    const res = await AuthService.login(loginDTO)
    isLoading.value = false
    if (!res.isSuccess) {
      loginError.value = res.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
    } else {
      router.push('/')
    }
  } catch (ex) {
    isLoading.value = false
    loginError.value = 'Đã xảy ra lỗi khi đăng nhập: ' + ex.message
  }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }

    body {
    font-family: 'Inter', sans-serif;
    background: #f8f9fa;
    overflow: hidden;
    }

    .login-container {
    display: flex;
    height: 100vh;
    position: relative;
    }

    /* Background Elements */
    .background-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    }

    .floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    }

    .shape {
    position: absolute;
    background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-radius: 50%;
    animation: float 20s infinite ease-in-out;
    }

    .shape-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
    }

    .shape-2 {
    width: 120px;
    height: 120px;
    top: 20%;
    right: 20%;
    animation-delay: 2s;
    }

    .shape-3 {
    width: 60px;
    height: 60px;
    bottom: 30%;
    left: 15%;
    animation-delay: 4s;
    }

    .shape-4 {
    width: 100px;
    height: 100px;
    bottom: 20%;
    right: 10%;
    animation-delay: 6s;
    }

    .shape-5 {
    width: 40px;
    height: 40px;
    top: 60%;
    left: 5%;
    animation-delay: 8s;
    }

    .shape-6 {
    width: 90px;
    height: 90px;
    top: 40%;
    right: 5%;
    animation-delay: 10s;
    }

    .gradient-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    }

    /* Left Panel */
    .left-panel {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center; /* Căn giữa theo chiều ngang */
    align-items: center;     /* Căn giữa theo chiều dọc */
    text-align: center;    
    }

    .branding-content {

    max-width: 500px;
    }

    .logo-section {
    text-align: center;
    margin-bottom: 60px;
    }



    .logo-icon i {
    font-size: 2.5rem;
    color: white;
    }

    .brand-title {

    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #ffffff, #f8f9fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    }

    .brand-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    }

    .feature-highlights {
    margin-bottom: 40px;
    }

    .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    }

    .feature-item:hover {
    transform: translateX(10px);
    background: rgba(255, 255, 255, 0.15);
    }

    .feature-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    flex-shrink: 0;
    }

    .feature-icon i {
    font-size: 1.5rem;
    }

    .feature-text h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 5px;
    }

    .feature-text p {
    opacity: 0.8;
    font-size: 0.95rem;
    }

    .testimonial {
    background: rgba(255, 255, 255, 0.1);
    padding: 25px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    }

    .testimonial-content p {
    font-style: italic;
    margin-bottom: 20px;
    font-size: 1.1rem;
    line-height: 1.6;
    }

    .testimonial-author {
    display: flex;
    align-items: center;
    }

    .author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    }

    .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }

    .author-name {
    font-weight: 600;
    display: block;
    }

    .author-title {
    font-size: 0.9rem;
    opacity: 0.8;
    }

    /* Right Panel */
    .right-panel {
    flex: 1;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    z-index: 1;
    }

    .form-container {
    width: 100%;
    max-width: 420px;
    }

    .form-header {
    text-align: center;
    margin-bottom: 40px;
    }

    .form-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
    }

    .form-subtitle {
    color: #7f8c8d;
    font-size: 1.1rem;
    }

    .login-form {
    width: 100%;
    }

    .form-group {
    margin-bottom: 25px;
    }

    .form-label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 0.95rem;
    }

    .form-label i {
    margin-right: 8px;
    color: #667eea;
    }

    .input-wrapper {
    position: relative;
    }

    .form-input {
    width: 100%;
    padding: 15px 20px 15px 50px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
    }

    .form-input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.error {
    border-color: #e74c3c;
    background: #fff5f5;
    }

    .input-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
    pointer-events: none;
    }

    .password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    padding: 5px;
    transition: color 0.3s ease;
    }

    .password-toggle:hover {
    color: #667eea;
    }

    .error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 5px;
    display: flex;
    align-items: center;
    }

    .error-message i {
    margin-right: 5px;
    }

    .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    }

    .remember-me {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    color: #2c3e50;
    }

    .remember-me input {
    display: none;
    }

    .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    transition: all 0.3s ease;
    }

    .remember-me input:checked + .checkmark {
    background: #667eea;
    border-color: #667eea;
    }

    .remember-me input:checked + .checkmark:before {
    content: '\f00c';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
    }

    .forgot-password {
    color: #667eea;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.3s ease;
    }

    .forgot-password:hover {
    color: #764ba2;
    }

    .login-error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    color: #e74c3c;
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    }

    .login-error i {
    margin-right: 8px;
    }

    .login-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 25px;
    }

    .login-button:hover:not(.loading) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .login-button.loading {
    opacity: 0.7;
    cursor: not-allowed;
    }

    .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
    }

    .divider {
    text-align: center;
    margin: 30px 0;
    position: relative;
    }

    .divider:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
    }

    .divider span {
    background: white;
    padding: 0 20px;
    color: #7f8c8d;
    font-size: 0.9rem;
    }

    .social-login {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
    }

    .social-button {
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: white;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: 500;
    }

    .social-button:hover {
    border-color: #667eea;
    transform: translateY(-1px);
    }

    .social-button.google:hover {
    background: #4285f4;
    color: white;
    border-color: #4285f4;
    }

    .social-button.facebook:hover {
    background: #1877f2;
    color: white;
    border-color: #1877f2;
    }

    .signup-prompt {
    text-align: center;
    color: #7f8c8d;
    }

    .signup-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
    }

    .signup-link:hover {
    color: #764ba2;
    }

    /* Animations */
@keyframes float {
    0%, 100% {
    transform: translateY(0px) rotate(0deg);
    }
    33% {
    transform: translateY(-30px) rotate(120deg);
    }
    66% {
    transform: translateY(-60px) rotate(240deg);
    }
    }

    @keyframes spin {
    to {
    transform: rotate(360deg);
    }
    }

    @keyframes slideIn {
    from {
    opacity: 0;
    transform: translateX(-30px);
    }
    to {
    opacity: 1;
    transform: translateX(0);
    }
    }

    @keyframes fadeIn {
    from {
    opacity: 0;
    transform: translateY(20px);
    }
    to {
    opacity: 1;
    transform: translateY(0);
    }
    }

    .animate-slide-in {
    animation: slideIn 0.8s ease-out forwards;
    }

    .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
    }

    /* Responsive */
    @media (max-width: 768px) {
    .login-container {
    flex-direction: column;
    overflow-y: auto;
    }

    .left-panel {
    padding: 40px 20px;
    min-height: 40vh;
    }

    .right-panel {
    padding: 40px 20px;
    min-height: 60vh;
    }

    .brand-title {
    font-size: 2.2rem;
    }

    .form-title {
    font-size: 1.8rem;
    }

    .feature-item {
    padding: 15px;
    }

    .social-login {
    flex-direction: column;
    }
    }

    @media (max-width: 480px) {
    .left-panel {
    padding: 30px 15px;
    }

    .right-panel {
    padding: 30px 15px;
    }

    .brand-title {
    font-size: 2rem;
    }

    .form-title {
    font-size: 1.6rem;
    }
    }   
</style>