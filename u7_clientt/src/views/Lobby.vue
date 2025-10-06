<template>
  <div class="lobby-container">

    <button class="close-btn" @click="closeLobby" title="Đóng phòng chờ">
      <i class="fas fa-times"></i>
    </button> 
    <div class="lobby-header">
      <h1 class="lobby-title">
        <i class="fas fa-users"></i>
        Phòng Chờ
      </h1>
      <div class="participant-count">
        <span class="count-badge">{{ participants.length }} người tham gia</span>
      </div>
    </div>

    <!-- Game Code Entry Section -->
    <div class="game-code-section" v-if="sessionReady">
  <div class="code-entry-card">
    <h2 class="section-title">
      <i class="fas fa-key"></i>
      Tham gia trò chơi
    </h2>
    <div class="code-display">
      <div class="code-info">
        <div class="info-item">
          <label>Mã phòng:</label>
          <div class="room-code">{{ roomCode }}</div>
          <button class="btn-copy" @click="copyRoomCode" title="Sao chép mã">
            <i class="fas fa-copy"></i>
          </button>
        </div>
        <div class="info-item">
          <label>Liên kết tham gia:</label>
          <a :href="roomLink" class="room-link" target="_blank">{{ roomLink }}</a>
          <button class="btn-copy" @click="copyRoomLink" style="position: relative; bottom : 13px;" title="Sao chép liên kết">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
      <div class="qr-section">
        <div class="qr-code">
          <img :src="qrCodeUrl" alt="QR Code" v-if="qrCodeUrl" />
        </div>
        <p class="qr-instruction">Quét mã QR để tham gia</p>
      </div>
    </div>
  </div>
</div>
    <div class="game-code-section" v-else>
      <div class="code-entry-card">
        <h2 class="section-title">
          <i class="fas fa-key"></i>
          Đang tạo phiên chơi...
        </h2>
        <div style="text-align:center; color:#888; padding:2rem;">
          <i class="fas fa-spinner fa-spin fa-2x"></i>
          <div>Vui lòng chờ, hệ thống đang khởi tạo phòng...</div>
        </div>
      </div>
    </div>

    <div class="participants-grid">
      <template v-if="participants.length">
        <div v-for="participant in participants" :key="participant.ParticipantId" class="participant-card">
          <!-- Remove Button -->
          <button 
            class="remove-btn" 
            @click="showRemoveConfirm(participant)"
            title="Loại bỏ người chơi"
          >
            <i class="fas fa-times"></i>
          </button>
          
          <div class="participant-avatar">
            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(participant.displayName)}&background=4f46e5&color=ffffff&size=80&rounded=true`"
              :alt="participant.DisplayName"
            />
            <div class="online-indicator"></div>
          </div>
          <div class="participant-info">
            <h3 class="participant-name">{{ participant.displayName }}</h3>
            <!-- <span class="participant-id">ID: {{ participant.ParticipantId }}</span> -->
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-state">
          <i class="fas fa-user-plus"></i>
          <h3>Chưa có người tham gia</h3>
          <p>Đang chờ người chơi tham gia phòng...</p>
        </div>
      </template>
    </div>

    <div v-if="participants.length" class="lobby-actions">
      <button class="btn btn-primary" @click="startGame">
        <i class="fas fa-play"></i>
        Bắt đầu trò chơi
      </button>
      <button class="btn btn-secondary" @click="refreshParticipants">
        <i class="fas fa-refresh"></i>
        Làm mới
      </button>
    </div>

    <!-- Remove Confirmation Modal -->
    <div v-if="showRemoveModal" class="modal-overlay" @click="hideRemoveConfirm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle modal-icon"></i>
          <h3 class="modal-title">Xác nhận loại bỏ</h3>
        </div>
        <div class="modal-body">
          <div class="participant-preview">
            <img 
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedParticipant?.displayName || '')}&background=ef4444&color=ffffff&size=50&rounded=true`"
              :alt="selectedParticipant?.displayName"
              class="preview-avatar"
            />
            <div class="preview-info">
              <strong>{{ selectedParticipant?.displayName }}</strong>
              <span class="preview-id">ID: {{ selectedParticipant?.participantId }}</span>
            </div>
          </div>
          <p class="modal-message">
            Bạn có chắc chắn muốn loại bỏ người chơi này khỏi phòng? 
            Họ sẽ phải tham gia lại để tiếp tục chơi.
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="hideRemoveConfirm">
            <i class="fas fa-times"></i>
            Hủy bỏ
          </button>
          <button class="btn btn-danger" @click="confirmRemove">
            <i class="fas fa-user-times"></i>
            Loại bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue'
import { useSignalR } from '../utils/hubConnection'
import Cookies from 'js-cookie'
import { useRouter, useRoute } from 'vue-router'
import AxiosClient from '../utils/axiosClient'
import _auth from "../services/AuthService";
import {showToast} from '../utils/toast'

const { signalR, isConnected, connectionState, connect, disconnect } = useSignalR()

const router = useRouter()
const route = useRoute()
const participants = ref([])
const currentSession = reactive({
    QuizId : null,
    SessionID : null,
    AccessCode : null,
    HostName : null,
    SessionStatus : null 
}) ; 

const sessionID = route.params.sessionId 
const roomCode = ref('') 
const domain = import.meta.env.VITE_APP_URL 
const isLeavingIntentionally = ref(false)

// Remove modal states
const showRemoveModal = ref(false)
const selectedParticipant = ref(null)


const leaderboard = reactive(null);
const leaderboard_show = ref(false) 

const qrCodeUrl = computed(() => {
  if (!roomCode.value) return ''
  const joinUrl = `${domain}?roomCode=${roomCode.value}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinUrl)}`
})

const roomLink = computed(() => {
  if (!roomCode.value) return ''
  return `${domain}/join?roomCode=${roomCode.value}`
})

const sessionReady = ref(false)

// Handle browser refresh/close
const handleBeforeUnload = (event) => {
  if (!isLeavingIntentionally.value && currentSession.SessionID) {
    event.preventDefault()
    event.returnValue = 'Bạn có chắc chắn muốn rời khỏi phòng chờ? Phiên làm bài sẽ bị đóng.'
    return event.returnValue
  }
}

// Handle Vue router navigation
const handleRouterNavigation = async (to, from, next) => {
  if (!isLeavingIntentionally.value && currentSession.SessionID) {
    if (confirm('Bạn có chắc chắn muốn rời khỏi phòng chờ? Phiên làm bài sẽ bị đóng.')) {
      isLeavingIntentionally.value = true
      await closeLobby()
      next()
    } else {
      next(false) // Cancel navigation
    }
  } else {
    next()
  }
}

onMounted(async () => {

    if (!sessionID) {
      showToast.warning("Phiên không tồn tại hoặc đã kết thúc")
      router.push('/')
      return
    }

    if(!Cookies.get('access_token')) {
      if(! await _auth.refreshToken()) {
        router.push('/login')
        return
      }
    }

  // Add browser beforeunload listener
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // Add Vue router navigation guard
  router.beforeEach(handleRouterNavigation)

  await connect()

  signalR.on("SessionCreated", session => {
    currentSession.QuizId = session.quizId
    currentSession.SessionID = session.sessionID
    currentSession.AccessCode = session.accessCode
    currentSession.HostName = session.hostName
    currentSession.SessionStatus = session.sessionStatus
    roomCode.value = session.accessCode
    sessionReady.value = true
  })

  signalR.on("NewJoined" , participant => {
    showToast.info(participant.displayName + " đã tham gia")
    console.log("Người chơi tham giaaaaa")
    participants.value.push(participant)

  })

  signalR.on("SessionNotFound", () => {
    showToast.error('Phiên làm bài không tồn tại hoặc đã kết thúc.')
    setTimeout( () => {
    router.push('/')
    },1000)
  })


  signalR.on("SessionEnded" ,()=> {
    // 1. Noti to host
    // 2. Display leadrboard ( later)
  })

  signalR.on("ParticipantRemoved", participantId => {
    var p = participants.value.find( x => x.participantId ==participantId )
    showToast.warning(p.displayName + " đã bị xóa khỏi phòng")
    participants.value = participants.value.filter(p => p.participantId !== participantId)
  })


  signalR.on("ParticipantLeft", participantId => {
    var p = participants.value.find( x => x.participantId === participantId)
    showToast.warning(p.displayName + " đã rời phòng")
    participants.value = participants.value.filter(p => p.participantId !== participantId)
  })

  signalR.on("Leaderboard", (data) => {
    leaderboard = data 
    leaderboard_show.value = true
  })



  await signalR.invoke("CreateSession", parseInt(sessionID)) 
})

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener('beforeunload', handleBeforeUnload)
  
  // If leaving intentionally, close lobby without confirmation
  if (isLeavingIntentionally.value) {
    closeLobby()
  }
})

onUnmounted(() => {
  // Final cleanup
  if (currentSession.SessionID && !isLeavingIntentionally.value) {
    // This is a fallback - try to close the session
    signalR?.invoke('EndSession', currentSession.SessionID)
    disconnect()
  }
})

function startGame() {
  signalR.invoke('StartSession', currentSession.SessionID, currentSession.AccessCode)
}

// Remove participant functions
function showRemoveConfirm(participant) {
  selectedParticipant.value = participant
  showRemoveModal.value = true
}

function hideRemoveConfirm() {
  showRemoveModal.value = false
  selectedParticipant.value = null
}

async function confirmRemove() {
  if (!selectedParticipant.value) return
  
  try {
    await removeParticipant(selectedParticipant.value.participantId)
    hideRemoveConfirm()
  } catch (err) {
    console.error('Error removing participant:', err)
    showToast.warning('Có lỗi xảy ra khi loại bỏ người chơi. Vui lòng thử lại.')
  }
}

const removeParticipant = async (participantId) => {
  try {
    await AxiosClient.delete(`session/${sessionID}/participants/${participantId}`)
  } catch (err) {
    console.error('Error removing participant:', err)
    throw err
  }
}

async function refreshParticipants() {
  try {
    var res = await AxiosClient.get("session/" + currentSession.SessionID + "/participants")
    participants.value = res.data
  } catch (error) {
    console.error("Không thể tải danh sách người chơi. Vui lòng thử lại.", error)
  }
}

function copyRoomCode() {
  if (roomCode.value) {
    navigator.clipboard.writeText(roomCode.value)
  }
}

function copyRoomLink() {
  if (roomLink.value) {
    navigator.clipboard.writeText(roomLink.value)

  }
}

function confirmCloseLobby() {
  if (confirm('Bạn có chắc chắn muốn đóng phòng chờ?')) {
    isLeavingIntentionally.value = true
    closeLobby()
  }
}

async function closeLobby() {
  try {
    if (currentSession.SessionID) {
      await signalR.invoke('EndSession', parseInt(currentSession.SessionID) , currentSession.AccessCode)
    }

    await disconnect()
    router.push('/')
  } catch (error) {
    console.error('Error closing lobby:', error)
    // Still navigate away even if there's an error
    router.push('/')
  }
}
</script>
<style scoped>
.lobby-container {
    width : 100%;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.close-btn {
    position: relative;
    float : right;
    top: 1.3rem;
    right: 1.3rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 0, 0, 0.5);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
    background: rgba(239, 68, 68, 0.9);
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(239, 68, 68, 0.3);
}

.close-btn i {
    font-size: 1.5rem;
    font-weight: 600;
}

.lobby-header {
    text-align: center;
    margin-bottom: 2rem;
    color: white;
}

.lobby-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.lobby-title i {
    margin-right: 0.5rem;
    color: #ffd700;
}

.participant-count {
    margin-bottom: 1.5rem;
}

.count-badge {
    background: rgba(255,255,255,0.2);
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.3);
}

/* Game Code Entry Section */
.game-code-section {
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
}

.code-entry-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    max-width: 600px;
    width: 100%;
}

.section-title {
    text-align: center;
    color: #374151;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.section-title i {
    color: #4f46e5;
}

.code-display {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 2rem;
}

.code-info {
    flex: 1;
}

.info-item {
    margin-bottom: 1.5rem;
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-item label {
    display: block;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.room-code {
    display: inline-block;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 2px;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    margin-right: 0.5rem;
}

.room-link {
    display: inline-block;
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    margin-right: 0.5rem;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.room-link:hover {
    background: linear-gradient(135deg, #047857, #059669);
}

.btn-copy {
    background: #f3f4f6;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.3s ease;
}

.btn-copy:hover {
    background: #e5e7eb;
    color: #374151;
}

.qr-section {
    text-align: center;
    flex-shrink: 0;
}

.qr-code {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 0.5rem;
}

.qr-code img {
    display: block;
    border-radius: 8px;
}

.qr-instruction {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
}

.join-form {
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
}

.input-group {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.code-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.code-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-copy {
    background: #f3f4f6;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.3s ease;
}

.btn-copy:hover {
    background: #e5e7eb;
    color: #374151;
}

.qr-section {
    text-align: center;
}

.qr-code {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 0.5rem;
}

.qr-code img {
    display: block;
    border-radius: 8px;
}

.qr-instruction {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
}

.join-form {
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
}

.input-group {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.code-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.code-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-join {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.btn-join:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Existing styles continue... */
.participants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.participant-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
    position: relative;
}

.participant-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

/* Remove Button Styles */
.remove-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    z-index: 10;
}

.remove-btn:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.remove-btn i {
    font-size: 0.875rem;
}

.participant-avatar {
    position: relative;
    margin-bottom: 1rem;
    display: inline-block;
}

.participant-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 4px solid #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.online-indicator {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background: #22c55e;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.participant-info {
    color: #374151;
}

.participant-name {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #1f2937;
}

.participant-id {
    font-size: 0.85rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    display: inline-block;
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: rgba(255,255,255,0.8);
}

.empty-state i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.empty-state p {
    font-size: 1.1rem;
    opacity: 0.8;
}

.lobby-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    min-width: 160px;
    justify-content: center;
}

.btn-primary {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(10px);
}

.btn-secondary:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 450px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 1.5rem;
    text-align: center;
    position: relative;
}

.modal-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    display: block;
    opacity: 0.9;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.modal-body {
    padding: 2rem;
}

.participant-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #f9fafb;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    border: 2px solid #fee2e2;
}

.preview-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #ef4444;
}

.preview-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.preview-info strong {
    color: #1f2937;
    font-weight: 600;
    font-size: 1.1rem;
}

.preview-id {
    color: #6b7280;
    font-size: 0.85rem;
    background: #e5e7eb;
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
    display: inline-block;
    width: fit-content;
}

.modal-message {
    color: #374151;
    line-height: 1.6;
    margin: 0;
    text-align: center;
}

.modal-actions {
    padding: 1.5rem;
    background: #f9fafb;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
    background: #e5e7eb;
    transform: translateY(-2px);
}

.btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
    .lobby-container {
        padding: 1rem;
    }

    .lobby-title {
        font-size: 2rem;
    }

    .code-display {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
    }

    .input-group {
        flex-direction: column;
    }

    .code-input {
        width: 100%;
    }

    .participants-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .lobby-actions {
        flex-direction: column;
        align-items: center;
    }

    .btn {
        width: 100%;
        max-width: 300px;
    }

    .modal-content {
        margin: 1rem;
        width: calc(100% - 2rem);
    }

    .modal-actions {
        flex-direction: column;
    }

    .modal-actions .btn {
        width: 100%;
        max-width: none;
    }
}
</style>