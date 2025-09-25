<template>
  <div class="register-container">
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

    <!-- Left Panel - Register Form -->
    <div class="left-panel">
      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">Tạo Tài Khoản Mới!</h2>
        </div>
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- Display Name -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-id-card"></i>
              Tên hiển thị
            </label>
            <div class="input-wrapper">
              <input
                class="form-input"
                :class="{ error: displayNameError }"
                placeholder="Nhập tên hiển thị của bạn"
                v-model="registerModel.DisplayName"
                @focus="clearError"
              />
              <div class="input-icon">
                <i class="fas fa-id-card"></i>
              </div>
            </div>
            <div v-if="displayNameError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Vui lòng nhập tên hiển thị
            </div>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              Tên đăng nhập
            </label>
            <div class="input-wrapper">
              <input
                class="form-input"
                :class="{ error: usernameError }"
                placeholder="Chọn tên đăng nhập"
                v-model="registerModel.UserName"
                @focus="clearError"
              />
              <div class="input-icon">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <div v-if="usernameError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ usernameErrorMsg }}
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-envelope"></i>
              Email
            </label>
            <div class="input-wrapper">
              <input
                type="email"
                class="form-input"
                :class="{ error: emailError }"
                placeholder="example@email.com"
                v-model="registerModel.Email"
                @focus="clearError"
              />
              <div class="input-icon">
                <i class="fas fa-envelope"></i>
              </div>
            </div>
            <div v-if="emailError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Vui lòng nhập email hợp lệ
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock"></i>
              Mật khẩu
            </label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: passwordError }"
                placeholder="Tạo mật khẩu mạnh"
                v-model="registerModel.Password"
                @focus="clearError"
              />
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <button type="button" class="password-toggle" @click="togglePassword">
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
            <div v-if="passwordError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ passwordErrorMsg }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock"></i>
              Xác nhận mật khẩu
            </label>
            <div class="input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: confirmPasswordError }"
                placeholder="Nhập lại mật khẩu"
                v-model="registerModel.ConfirmPassword"
                @focus="clearError"
              />
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <button type="button" class="password-toggle" @click="toggleConfirmPassword">
                <i :class="['fas', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
            <div v-if="confirmPasswordError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Mật khẩu xác nhận không khớp
            </div>
          </div>

          <!-- Terms checkbox -->
          <div class="form-options">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="acceptTerms" />
              <span class="checkmark"></span>
              <span class="terms-text">
                Tôi đồng ý với
                <a href="/terms" class="terms-link">Điều khoản sử dụng</a>
                và
                <a href="/privacy" class="terms-link">Chính sách bảo mật</a>
              </span>
            </label>
          </div>

          <div v-if="registerError" class="register-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ registerError }}
          </div>

          <button
            type="submit"
            class="register-button"
            :class="{ loading: isLoading }"
            :disabled="!acceptTerms || isLoading"
          >
            <span v-if="isLoading" class="spinner"></span>
            <template v-if="isLoading">
              <span>Đang tạo tài khoản...</span>
            </template>
            <template v-else>
              <i class="fas fa-user-plus"></i>
              <span>Tạo Tài Khoản</span>
            </template>
          </button>

          <div class="divider">
            <span>hoặc</span>
          </div>

          <div class="login-prompt">
            <p>
              Đã có tài khoản?
              <a href="/login" class="login-link">Đăng nhập ngay</a>
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Right Panel - Branding -->
    <div class="right-panel">
      <div class="branding-content">
        <div class="logo-section">
          <a href="/" class="logo-icon">
            <img src="../assets/img/logo.png" alt="" width="150" height="150" />
          </a>
        </div>
        <div class="feature-highlights">
          <div class="feature-item animate-slide-in" style="animation-delay: 0.2s;">
            <div class="feature-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="feature-text">
              <h3>Bắt Đầu Hành Trình</h3>
              <p>Tham gia cộng đồng học tập với hàng triệu người dùng</p>
            </div>
          </div>
          <div class="feature-item animate-slide-in" style="animation-delay: 0.4s;">
            <div class="feature-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <div class="feature-text">
              <h3>Học Tập Hiệu Quả</h3>
              <p>Phương pháp học tương tác với công nghệ AI tiên tiến</p>
            </div>
          </div>
          <div class="feature-item animate-slide-in" style="animation-delay: 0.6s;">
            <div class="feature-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="feature-text">
              <h3>Thành Tích Ấn Tượng</h3>
              <p>Theo dõi tiến độ và đạt được những thành tựu mới</p>
            </div>
          </div>
          <div class="feature-item animate-slide-in" style="animation-delay: 0.8s;">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="feature-text">
              <h3>Cộng Đồng Sôi Động</h3>
              <p>Kết nối, cạnh tranh và học hỏi cùng bạn bè</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'
const router = useRouter()

const registerModel = ref({
  DisplayName: '',
  UserName: '',
  Email: '',
  Password: '',
  ConfirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)

const displayNameError = ref(false)
const usernameError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const confirmPasswordError = ref(false)
const registerError = ref('')
const usernameErrorMsg = ref('Vui lòng nhập tên đăng nhập')
const passwordErrorMsg = ref('Vui lòng nhập mật khẩu')

function togglePassword() {
  showPassword.value = !showPassword.value
}
function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}
function clearError() {
  displayNameError.value = false
  usernameError.value = false
  emailError.value = false
  passwordError.value = false
  confirmPasswordError.value = false
  registerError.value = ''
  usernameErrorMsg.value = 'Vui lòng nhập tên đăng nhập'
  passwordErrorMsg.value = 'Vui lòng nhập mật khẩu'
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateForm() {
  let isValid = true
  clearError()

  if (!registerModel.value.DisplayName.trim()) {
    displayNameError.value = true
    isValid = false
  }
  if (!registerModel.value.UserName.trim()) {
    usernameError.value = true
    isValid = false
  } else if (registerModel.value.UserName.length < 3) {
    usernameError.value = true
    usernameErrorMsg.value = 'Tên đăng nhập phải có ít nhất 3 ký tự'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(registerModel.value.UserName)) {
    usernameError.value = true
    usernameErrorMsg.value = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
    isValid = false
  }
  if (!registerModel.value.Email.trim()) {
    emailError.value = true
    isValid = false
  } else if (!isValidEmail(registerModel.value.Email)) {
    emailError.value = true
    registerError.value = 'Vui lòng nhập email hợp lệ'
    isValid = false
  }
  if (!registerModel.value.Password) {
    passwordError.value = true
    isValid = false
  } else if (registerModel.value.Password.length < 6) {
    passwordError.value = true
    passwordErrorMsg.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }
  if (!registerModel.value.ConfirmPassword) {
    confirmPasswordError.value = true
    isValid = false
  } else if (registerModel.value.Password !== registerModel.value.ConfirmPassword) {
    confirmPasswordError.value = true
    registerError.value = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }
  if (!acceptTerms.value) {
    registerError.value = 'Vui lòng đồng ý với điều khoản sử dụng'
    isValid = false
  }
  return isValid
}

async function handleRegister() {
  if (!validateForm()) return
  isLoading.value = true
  registerError.value = ''
  try {
    await AuthService.register(registerModel.value)
    router.push('/login')
  }
  catch (error){
    registerError.value = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'  
  }
}
</script>

<style scoped>
/* Copy toàn bộ CSS từ Register.razor, đổi @keyframes thành @keyframes, @media thành @media */
body {
        height: 100%;
        font-family: 'Inter', sans-serif;
        background: #f8f9fa;
        overflow: hidden;
    }

    .register-container {
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
        background: linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
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
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
    }

    /* Left Panel - Register Form */
    .left-panel {
        height: 100vh;
        width: 100%;
        flex: 1;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 35px;
        position: relative;
        z-index: 1;
        overflow-y: auto;
        max-height: 100vh;
    }

    .form-container {
        height: 100%;
        width: 100%;
        max-width: 420px;
    }

    .form-header {
        text-align: center;
        margin-bottom: 30px;
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

    .register-form {
        width: 100%;
    }

    .form-group {
        margin-bottom: 20px;
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
        color: #22c55e;
    }

    .input-wrapper {
        position: relative;
    }

    .form-input {
        width: 100%;
        padding: 12px 20px 12px 50px;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #f8f9fa;
    }

    .form-input:focus {
        outline: none;
        border-color: #22c55e;
        background: white;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
        color: #22c55e;
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
        margin-bottom: 25px;
    }

    .terms-checkbox {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        font-size: 0.9rem;
        color: #2c3e50;
        line-height: 1.5;
    }

    .terms-checkbox input {
        display: none;
    }

    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #e9ecef;
        border-radius: 4px;
        margin-right: 12px;
        margin-top: 2px;
        position: relative;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }

    .terms-checkbox input:checked + .checkmark {
        background: #22c55e;
        border-color: #22c55e;
    }

    .terms-checkbox input:checked + .checkmark:before {
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

    .terms-text {
        flex: 1;
    }

    .terms-link {
        color: #22c55e;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .terms-link:hover {
        color: #16a34a;
    }

    .register-error {
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

    .register-error i {
        margin-right: 8px;
    }

    .register-button {
        width: 100%;
        padding: 14px;
        background: linear-gradient(45deg, #22c55e, #16a34a);
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

    .register-button:hover:not(.loading):not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
    }

    .register-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .register-button.loading {
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
        margin: 25px 0;
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
        margin-bottom: 25px;
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
        border-color: #22c55e;
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

    .login-prompt {
        text-align: center;
        color: #7f8c8d;
        margin-top: 20px;
    }

    .login-link {
        color: #22c55e;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
    }

    .login-link:hover {
        color: #16a34a;
    }

    /* Right Panel - Branding */
    .right-panel {
        flex: 1;
        background: linear-gradient(135deg, #667eea 0%, #47eb7d 100%);
        color: white;
        padding: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        z-index: 1;
        text-align: center;
    }

    .branding-content {
        height: 100vh;
        max-width: 500px;
        margin: 0 auto;
    }

    .logo-section {
        text-align: center;
        margin-bottom: 50px;
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
        margin-bottom: 25px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }

    .feature-item:hover {
        transform: translateX(-10px);
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
        justify-content: center;
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
            transform: translateX(30px);
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
        .register-container {
            flex-direction: column;
            overflow-y: auto;
        }

        .left-panel {
            padding: 30px 20px;
            min-height: 60vh;
            order: 2;
        }

        .right-panel {
            padding: 40px 20px;
            min-height: 40vh;
            order: 1;
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
    }

    @media (max-width: 480px) {
        .left-panel {
            padding: 20px 15px;
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

        .form-group {
            margin-bottom: 18px;
        }

        .form-input {
            padding: 10px 15px 10px 45px;
        }
    }
</style>