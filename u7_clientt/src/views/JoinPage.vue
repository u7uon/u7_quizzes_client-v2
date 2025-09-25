<template>
  <div class="join-container">
    <!-- Background Animation -->
    <div class="bg-animation">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-circle circle-4"></div>
      <div class="floating-circle circle-5"></div>
    </div>

    <div class="join-card">
      <!-- Header -->
      <div class="card-header">
        <div class="title-container">
          <h1 class="title">Tham Gia Phòng</h1>
        </div>
        <div class="subtitle-container">
          <p class="subtitle">Nhập mã phòng và tên hiển thị để tham gia</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width:100%"></div>
        </div>
      </div>

      <!-- Single Step Form -->
      <div class="form-container">
        <form class="join-form" @submit.prevent="handleJoin">
          <div class="input-group">
            <label class="input-label">
              <svg class="label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2"/>
              </svg>
              Mã phòng
            </label>
            <div class="input-wrapper">
              <input
                v-model="roomCode"
                class="styled-input"
                placeholder="Nhập mã phòng..."
                @input="formatRoomCode"
                required
              />
              <div class="input-focus-border"></div>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">
              <svg class="label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
              Tên hiển thị
            </label>
            <div class="input-wrapper">
              <input
                v-model="displayName"
                class="styled-input"
                placeholder="Nhập tên hiển thị..."
                required
              />
              <div class="input-focus-border"></div>
            </div>
          </div>
          <button type="submit" class="join-btn">
            <span class="btn-text">Tham Gia Ngay</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="btn-ripple"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted } from 'vue'
import { useRoute ,useRouter} from 'vue-router'
import AxiosClient from '../utils/AxiosClient';

const route = useRoute()
const router = useRouter()
const roomCode = ref(route.query.roomCode || '')
const displayName = ref('')
const participant = reactive({ ParticipantId: '', DisplayName: '' })
const participants = ref([])




onMounted( () => {
})
// Room code formatting
function formatRoomCode(e) {
  roomCode.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

// Single step join
async function handleJoin() {
    AxiosClient.post(`session/join`, {
      AccessCode: roomCode.value,
      DisplayName: displayName.value
    }).then(res => {
        const participantId = res.participantId
        // signalR.invoke("JoinSession", parseInt(roomCode.value), participantId)
        // You can redirect to the game page here if needed
       router.push({ 
                name: 'multiplayer',
                params: { participantId },
                query: { accesscode: roomCode.value }
                })
    }).catch(err => {
        console.error('Join failed:', err)
        alert('Tham gia phòng thất bại. Vui lòng kiểm tra mã phòng và thử lại.')
    })
  
}
// Ripple effect for buttons
onMounted(() => {
  document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span')
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('ripple-effect')
      this.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    })
  })
})
</script>

<style>
/* Main Container */
.join-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background Animation */
.bg-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
}

.floating-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
}

.circle-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.circle-2 {
    width: 120px;
    height: 120px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.circle-3 {
    width: 60px;
    height: 60px;
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
}

.circle-4 {
    width: 100px;
    height: 100px;
    top: 10%;
    right: 30%;
    animation-delay: 1s;
}

.circle-5 {
    width: 90px;
    height: 90px;
    bottom: 20%;
    right: 10%;
    animation-delay: 3s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.1;
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.2;
    }
}

/* Main Card */
.join-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.15),
        0 16px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 440px;
    width: 100%;
    position: relative;
    z-index: 1;
    animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Header Transitions */
.card-header {
    text-align: center;
    margin-bottom: 2rem;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-success {
    transform: scale(1.02);
}

/* Icon Container */
.icon-container {
    margin-bottom: 1.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
}

.join-icon, .success-icon, .user-icon {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    color: #667eea;
}

.success-icon, .user-icon {
    opacity: 0;
    transform: scale(0.8) rotate(-90deg);
}

.fade-out {
    opacity: 0;
    transform: scale(0.8) rotate(90deg);
}

.fade-in {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    color: #10b981;
    animation: successPulse 0.6s ease-out;
}

.fade-in-delayed {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    animation: fadeInDelayed 0.8s ease-out 0.3s both;
}

@keyframes successPulse {
    0% { transform: scale(0.8); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

@keyframes fadeInDelayed {
    from {
        opacity: 0;
        transform: scale(0.8) rotate(-90deg);
    }
    to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
}

/* Title Transitions */
.title-container, .subtitle-container {
    position: relative;
    height: auto;
    overflow: hidden;
}

.title, .subtitle {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0;
}

.success-title, .success-subtitle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.slide-out-up {
    transform: translateY(-30px);
    opacity: 0;
}

.slide-in-up {
    transform: translateY(0);
    opacity: 1;
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.slide-out-down {
    transform: translateY(30px);
    opacity: 0;
}

.slide-in {
    transform: translateY(0);
    opacity: 1;
}

@keyframes slideInUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #1a1a2e 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.success-title {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    color: #6b7280;
    font-size: 1rem;
    font-weight: 400;
}

.success-subtitle {
    color: #059669;
    font-weight: 500;
}

/* Progress Indicator */
.progress-container {
    margin-bottom: 2rem;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    width: 50%;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
}

.progress-complete {
    width: 100%;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.4s ease;
}

.step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.4s ease;
    border: 2px solid #d1d5db;
    color: #6b7280;
    background: white;
}

.step-label {
    font-size: 0.75rem;
    color: #6b7280;
    transition: all 0.4s ease;
}

.step.active .step-number {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
    transform: scale(1.1);
}

.step.active .step-label {
    color: #667eea;
    font-weight: 600;
}

.step.completed .step-number {
    background: #10b981;
    color: white;
    border-color: #10b981;
}

.step.completed .step-label {
    color: #10b981;
    font-weight: 600;
}

/* Form Container */
.form-container {
    position: relative;
    overflow: hidden;
}

.form-step {
    width: 100%;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-out-left {
    transform: translateX(-100%);
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.slide-in-left {
    transform: translateX(0);
    opacity: 1;
}

.slide-in-right {
    transform: translateX(0);
    opacity: 1;
    animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.slide-out-right {
    transform: translateX(100%);
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Form Styles */
.join-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.label-icon {
    color: #667eea;
}

.input-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
}

.styled-input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    background: #ffffff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
}

.styled-input:disabled {
    background: #f9fafb;
    color: #6b7280;
    border-color: #10b981;
    padding-right: 3rem;
}

.styled-input::placeholder {
    color: #9ca3af;
    font-weight: 400;
}

.styled-input:focus {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 
        0 12px 24px rgba(102, 126, 234, 0.15),
        0 4px 8px rgba(102, 126, 234, 0.1);
}

.focus-auto {
    animation: autoFocus 0.1s ease-out 0.8s;
}

@keyframes autoFocus {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

.input-focus-border {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
}

.styled-input:focus + .input-focus-border {
    width: 100%;
}

.input-success-check {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #10b981;
    animation: checkmark 0.5s ease-out 0.3s both;
}

@keyframes checkmark {
    from {
        opacity: 0;
        transform: translateY(-50%) scale(0.5);
    }
    to {
        opacity: 1;
        transform: translateY(-50%) scale(1);
    }
}

/* Submit Button */
.join-btn {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 16px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
}

.join-btn:hover {
    transform: translateY(-3px);
    box-shadow: 
        0 20px 40px rgba(102, 126, 234, 0.3),
        0 8px 16px rgba(102, 126, 234, 0.2);
}

.join-btn:active {
    transform: translateY(-1px);
}

.btn-text {
    position: relative;
    z-index: 2;
}

.btn-icon {
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
}

.join-btn:hover .btn-icon {
    transform: translateX(4px);
}

.btn-ripple {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.join-btn:hover .btn-ripple {
    left: 100%;
}

.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Responsive Design */
@media (max-width: 480px) {
    .join-card {
        padding: 2rem 1.5rem;
        margin: 1rem;
    }
    
    .title {
        font-size: 1.875rem;
    }
    
    .styled-input {
        padding: 0.875rem 1rem;
    }
    
    .join-btn {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
    }
    
    .progress-steps {
        gap: 1rem;
    }
    
    .step-label {
        font-size: 0.7rem;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .join-card {
        background: rgba(17, 24, 39, 0.95);
        color: #f9fafb;
    }
    
    .title {
        background: linear-gradient(135deg, #f9fafb 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .input-label {
        color: #d1d5db;
    }
    
    .styled-input {
        background: rgba(31, 41, 55, 0.8);
        border-color: #374151;
        color: #f9fafb;
    }
    
    .styled-input::placeholder {
        color: #6b7280;
    }
    
    .styled-input:disabled {
        background: rgba(31, 41, 55, 0.5);
    }
}
</style>