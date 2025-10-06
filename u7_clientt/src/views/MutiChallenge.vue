<template>
  <div class="lobby-container" v-if="!isStarted">
      <button class="close-btn" @click="showLeaveConfirm" title="Đóng phòng chơi">
      <i class="fas fa-times"></i>
    </button> 
    <div class="lobby-header">
      <h1 class="lobby-title">
        <i class="fas fa-users"></i>
        Phòng Chơi
      </h1>
      <div class="participant-count">
        <span class="count-badge">{{ participants.length }} người tham gia</span>
      </div>
    </div>
    <div class="participants-grid">
      <template v-if="participants.length">
        <div v-for="participant in participants" :key="participant.ParticipantId" class="participant-card">
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
      <button class="btn btn-danger" @click="showLeaveConfirm">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        Rời phòng
      </button>
    </div>

    <!-- Leave Confirmation Modal -->
    <div v-if="showLeaveModal" class="modal-overlay" @click="hideLeaveConfirm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle modal-icon"></i>
          <h3 class="modal-title">Rời khỏi phòng chơi</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">
            Bạn có chắc chắn muốn rời khỏi phòng này không? Bạn sẽ không thể tham gia trò chơi nếu rời khỏi phòng.
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="hideLeaveConfirm">
            <i class="fas fa-times"></i>
            Ở lại
          </button>
          <button class="btn btn-danger" @click="confirmLeave">
            <i class="fas fa-sign-out-alt"></i>
            Rời phòng
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Confirmation Modal -->
    <div v-if="showRemoveModal" class="modal-overlay" @click="hideLeaveCofirm">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle modal-icon"></i>
          <h3 class="modal-title">Bạn muốn rời khỏi phòng</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">
            Bạn có chắc chắn muốn rời khỏi phòng này? 
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="hideLeaveCofirm">
            <i class="fas fa-times"></i>
            Hủy bỏ
          </button>
          <button class="btn btn-danger" @click="confirmLeave">
            <i class="fas fa-user-times"></i>
            Loại bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="game-container">
    <!-- Countdown Screen -->
    <div v-if="showCountdown" class="countdown-screen">
      <div class="countdown-content">
        <h2 class="countdown-title">Trò chơi bắt đầu sau</h2>
        <div class="countdown-number" :class="{ 'pulse': true }">
          {{ countdown }}
        </div>
        <p class="countdown-message">Hãy sẵn sàng!</p>
      </div>
    </div>

    <!-- Question Display -->
    <div v-else-if="currentQuestion" class="question-container">
      <!-- Scoreboard -->
      <section class="scoreboard" v-if="inGame">
        <div class="score-item">
          <div class="label">Đúng</div>
          <div class="value" :class="{ flash: flashField === 'correct' }">{{ correctCount }}</div>
        </div>
        <div class="score-item">
          <div class="label">Sai</div>
          <div class="value" :class="{ flash: flashField === 'wrong' }">{{ wrongCount }}</div>
        </div>
        <div class="score-item score-total">
          <div class="label">Điểm</div>
          <div class="value" :class="{ flash: flashField === 'score' }">{{ score }}</div>
        </div>
      </section>

      <div class="question-header">
        <div class="question-number">
          Câu hỏi {{ currentQuestionIndex  }}
        </div>
        <div class="timer" :class="{ 'timer-warning': timeRemaining <= 10 }">
          <i class="fas fa-clock"></i>
          <span>{{ timeRemaining }}s</span>
        </div>
      </div>

      <div class="question-content">
        <h2 class="question-text">{{ currentQuestion.content }}</h2>
      </div>

      <!-- Answer Options based on Question Type -->
      <div class="answer-section">
        <!-- True/False -->
        <div v-if="currentQuestion.questionType === 'TrueFalse'" class="true-false-options">
          <button 
            v-for="answer in currentQuestion.answers" 
            :key="answer.answerId"
            class="answer-btn true-false-btn m-2"
            :class="{ 
              'selected': selectedAnswers.includes(answer.answerId),
              'disabled': hasSubmitted 
            }"
            @click="selectAnswer(answer.answerId, 'single')"
            :disabled="hasSubmitted"
          >
            <i :class="answer.content === 'True' ? 'fas fa-check' : 'fas fa-times'"></i>
            <span>{{ answer.content === 'True' ? 'Đúng' : 'Sai' }}</span>
          </button>
        </div>

        <!-- Single Choice -->
        <div v-else-if="currentQuestion.questionType === 'SingleChoice'  " class="single-choice-options">
          <button 
            v-for="(answer, index) in currentQuestion.answers" 
            :key="answer.answerId"
            class="answer-btn single-choice-btn"
            :class="{ 
              'selected': selectedAnswers.includes(answer.answerId),
              'disabled': hasSubmitted,
              [`color-${index % 4}`]: true
            }"
            @click="selectAnswer(answer.answerId, 'single')"
            :disabled="hasSubmitted"
          >
            <span class="answer-label">{{ String.fromCharCode(65 + index) }}</span>
            <span class="answer-text">{{ answer.content }}</span>
          </button>
        </div>

        <!-- Multiple Choice -->
        <div v-else-if="currentQuestion.questionType  === 'MultipleChoice'" class="multiple-choice-options">
          <div class="choice-hint">
            <i class="fas fa-info-circle"></i>
            Chọn tất cả đáp án đúng
          </div>
          <label 
            v-for="(answer, index) in currentQuestion.answers" 
            :key="answer.answerId"
            class="answer-checkbox"
            :class="{ 'disabled': hasSubmitted }"
          >
            <input 
              type="checkbox" 
              :value="answer.answerId"
              v-model="selectedAnswers"
              :disabled="hasSubmitted"
            />
            <span class="checkbox-custom"></span>
            <span class="answer-label">{{ String.fromCharCode(65 + index) }}</span>
            <span class="answer-text">{{ answer.content }}</span>
          </label>
        </div>

        <!-- Short Answer -->
        <div v-else-if="currentQuestion.questionType  === 'ShortAnswer'" class="short-answer-section">
          <textarea 
            v-model="shortAnswer"
            class="short-answer-input"
            placeholder="Nhập câu trả lời của bạn..."
            :disabled="hasSubmitted"
            @keypress.enter.prevent="submitAnswer"
          ></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section" v-if="!hasSubmitted">
        <button 
          class="btn-submit"
          @click="submitAnswer"
          :disabled="!canSubmit"
        >
          <i class="fas fa-paper-plane"></i>
          Gửi câu trả lời
        </button>
      </div>

      <!-- Waiting Message -->
      <div v-else class="waiting-message">
        <i class="fas fa-check-circle"></i>
        <p>Đã gửi câu trả lời! Đang chờ kết quả</p>
      </div>
    </div>

   <!-- Session Ended -->
    <div v-else-if="sessionEnded" class="session-ended">
      <template v-if="endState === 'ended'"  class="countdown-screen"  >
        <div class="countdown-content">
        <h2 class="countdown-title">Kết thúc</h2>
        <p class="countdown-message">Cảm ơn bạn đã tham gia</p>
      </div>
      </template>
      <template v-else-if="endState === 'loading'">
        <div class="waiting-screen">
          <div class="loading-spinner"></div>
          <p>Đang tải bảng xếp hạng...</p>
        </div>
      </template>
      <template v-else-if="endState === 'leaderboard'">
        <div class="leaderboard-content">
          <i class="fas fa-trophy"></i>
          <h2>Bảng Xếp Hạng</h2>
          <div class="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Người chơi</th>
                  <th>Điểm</th>
                  <th>Đúng</th>
                  <th>Sai</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in leaderboardData.participants" :key="player.participant.participantId" :class="getRankClass(player.rank)">
                  <td class="rank">
                    <span v-if="player.rank > 3">{{ player.rank }}</span>
                    <i v-else :class="['fas fa-medal', getMedalClass(player.rank)]"></i>
                  </td>
                  <td>{{ player.participant.displayName }}</td>
                  <td>{{ player.score }}</td>
                  <td>{{ player.correctAnsCount }}</td>
                  <td>{{ player.wrongAwnserCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-primary" @click="backToHome">
            <i class="fas fa-home"></i>
            Về trang chủ
          </button>
        </div>
      </template>
    </div>

    <!-- Waiting for Question -->
    <div v-else class="waiting-screen">
      <div class="loading-spinner"></div>
      <p>Đang chờ câu hỏi...</p>
    </div>

    <!-- Result Dialog - Centered Modal -->
    <div v-if="showResultDialog && lastResult" class="result-dialog-overlay">
      <div class="result-dialog">
        <div :class="['result-dialog-content', lastResult.isCorrect ? 'correct' : 'wrong']">
          <div class="result-icon">
            <i :class="lastResult.isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          </div>
          <h3 class="result-title">
            {{ lastResult.isCorrect ? 'Chính xác!' : 'Sai rồi!' }}
          </h3>
          <p class="result-score">
            Điểm nhận được: <strong>{{ lastResult.score }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onUnmounted } from 'vue'
import { useSignalR } from '../utils/hubConnection'
import { useRouter, useRoute } from 'vue-router'
import {showToast} from "../utils/toast"
import _axios from "../utils/axiosClient"


import incorrect from "../assets/sounds/incorrect.mp3"
import correct from "../assets/sounds/correct.mp3"
import ticking from '../assets/sounds/ticking.mp3'
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils'
const tickingSound = new Audio(ticking)
const incorrectSound = new Audio(incorrect)
const correctSound = new Audio(correct)


const isStarted = ref(false)
const showCountdown = ref(false)
const countdown = ref(3)
const currentQuestion = ref(null)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref([])
const shortAnswer = ref('')
const hasSubmitted = ref(false)
const timeRemaining = ref(0)
const sessionEnded = ref(false)
let timerInterval = null

// Score tracking variables
const inGame = ref(false)
const correctCount = ref(0)
const wrongCount = ref(0)
const score = ref(0)
const flashField = ref('')

const { signalR, connect, disconnect } = useSignalR()

const router = useRouter()
const route = useRoute()
const participants = ref([])
const submittedQuestions = ref([]) 
const lastResult = ref(null)  // { isCorrect, score }
const showResultDialog = ref(false) // Changed from showResult

const accessCode = route.query.accesscode
const participantId = route.params.participantId 
const roomCode = ref('') 
const leaderboardData = ref(null)
const endState = ref(null)
// Modal states
const showRemoveModal = ref(false)
const showLeaveModal = ref(false)

console.log("con ", signalR.connection.connectionId)

const canSubmit = computed(() => {
  if (!currentQuestion.value) return false
  
  if (currentQuestion.value.type === 3) { // Short Answer
    return shortAnswer.value.trim().length > 0
  }
  
  return selectedAnswers.value.length > 0
})

const playsound = (sound) => sound.play()

// Flash effect function
function flashScoreField(field) {
  flashField.value = field
  setTimeout(() => {
    flashField.value = ''
  }, 600)
}

// Setup beforeunload event to handle page close/refresh
function setupBeforeUnloadHandler() {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('unload', handleUnload)
}

// Remove beforeunload event handler
function removeBeforeUnloadHandler() {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('unload', handleUnload)
}

// Handle beforeunload - set flag for refresh detection
function handleBeforeUnload(event) {
  // Mark that we're potentially refreshing
  sessionStorage.setItem('isRefreshing', 'true')
  sessionStorage.setItem('lastActivity', Date.now().toString())
}

// Handle unload - only leave session if NOT refreshing
async function handleUnload(event) {
  const isRefreshing = sessionStorage.getItem('isRefreshing')
  
  // Don't leave session if we're just refreshing
  if (isRefreshing === 'true') {
    console.log('Page refresh detected - keeping session')
    return
  }
  
  // Only leave session when actually closing tab/browser
  if (!sessionEnded.value && !isLeavingSession.value && signalR && participantId) {
    try {
      // Use sendBeacon for reliable data sending during page unload
      const data = JSON.stringify({
        participantId: parseInt(participantId),
        accessCode: accessCode
      })
        await signalR.invoke("LeaveSession", parseInt(participantId), accessCode)
    } catch (error) {
      console.error('Error during unload leave:', error)
    }
  }
}

// Simple leave control
const isLeavingSession = ref(false)

onMounted(async () => {
  // Check if this is a page refresh
  const isRefreshing = sessionStorage.getItem('isRefreshing')
  const lastActivity = sessionStorage.getItem('lastActivity')
  const now = Date.now()
  
  if (isRefreshing === 'true' && lastActivity) {
    const timeDiff = now - parseInt(lastActivity)
    
    // If last activity was within 3 seconds, it's definitely a refresh
    if (timeDiff < 3000) {
      console.log('Page was refreshed - reconnecting to existing session')
      sessionStorage.removeItem('isRefreshing')
      
      // Reconnect to SignalR if needed
      if (!signalR || signalR.state !== 'Connected') {
        await connect()
      }
      
    }
  } else {
    // First time loading - connect normally
    await connect()
  }

  try {
    participants.value = await _axios.get(`session/participants?acesscode=${accessCode}`)

  }
  catch(e){
    showToast.error(e.message)
  }

  
  // Clear the refresh flag after mounting
  sessionStorage.removeItem('isRefreshing')

  // Setup page unload handlers
  setupBeforeUnloadHandler()

  signalR.on("Participants", data => {
    console.log("Received participants:", data)
    participants.value = data
  })

  signalR.on("SessionClosed", async () => {
    sessionEnded.value = true
    ClearConnection()
    removeBeforeUnloadHandler()
    router.push('/join')
  })

  signalR.on("AnswerSubmitted", (res) => {
    submittedQuestions.value.push(res)
    if (res.participantId === parseInt(participantId)) {
      lastResult.value = {
        isCorrect: res.isCorrect,
        score: res.score
      }
    }
  })
  
  signalR.on("SessionStarted" , () => {
    isStarted.value = true
    inGame.value = true
    showCountdown.value = true
    startCountdown()
  })

  signalR.on("ReceiveQuestion", (question) => {
    currentQuestion.value = question
    hasSubmitted.value = false
    selectedAnswers.value = []
    shortAnswer.value = ''
    showResultDialog.value = false
    currentQuestionIndex.value++
    // Start timer based on question timeLimit (convert ms to seconds)
    timeRemaining.value = Math.floor(question.timeLimit / 1000)
    startQuestionTimer()
  })

  signalR.on("SessionEnded", () => {
    sessionEnded.value = true
    inGame.value = false
    currentQuestion.value = null
    clearInterval(timerInterval)
    removeBeforeUnloadHandler()
    //ClearConnection()
  })

  signalR.on("NewJoined" , participant => {
    showToast.info(participant.displayName + "đã tham gia",{timeout : 2000})
    participants.value.push(participant)
  })

  signalR.on("SessionNotFound", () => {
    alert('Phiên làm bài không tồn tại hoặc đã kết thúc.')
    sessionEnded.value = true
    removeBeforeUnloadHandler()
    router.push('/')
  })


  signalR.on("Leaderboard", async (data) => {
    console.log("Received leaderboard:", data)
    leaderboardData.value = data
    endState.value = 'leaderboard'

    await ClearConnection() 
    removeBeforeUnloadHandler() 
  
  })

  signalR.on("ParticipantRemoved",  async (removedParticipantId) =>{
    if(participantId == removedParticipantId){
      await removedFromSession()
    }   
    var p = participants.value.find( (x) => x.participantId === removedParticipantId )
    participants.value = participants.value.filter(p => p.participantId !== removedParticipantId)
    
    showToast.warning(p.displayName + "đã bị xóa khỏi phòng.")
  })

  signalR.on("ParticipantLeft", (participantId) => {
    var p = participants.value.find( (x) => x.participantId === participantId )
    participants.value = participants.value.filter(p => p.participantId !== participantId)
    
    showToast.warning(p.displayName + "đã rời khỏi phòng.")
  })

})

onUnmounted(() => {
  clearInterval(timerInterval)
  // Only remove handler if we're intentionally leaving (not refreshing)
  if (!sessionStorage.getItem('isRefreshing')) {
    leaveSession()
    removeBeforeUnloadHandler()
    ClearConnection()
    showToast.clear()
  }
})

function getRankClass(rank) {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
}

function getMedalClass(rank) {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
}

function startCountdown() {
  const countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      showCountdown.value = false
      countdown.value = 3 // Reset for next time
    }
  }, 1000)
}

function startQuestionTimer() {
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value == 0) {
      clearInterval(timerInterval)
      // Auto submit if time runs out
      if (!hasSubmitted.value) {
       console.log("Here")
        submitAnswer()
      }
      if (lastResult.value) {
        showResultDialog.value = true
        if (lastResult.value.isCorrect) {
          correctCount.value++
          flashScoreField('correct')
          playsound(correctSound)
        } else {
          wrongCount.value++
          flashScoreField('wrong')
          playsound(incorrectSound)
        }
        
        // Update total score
        score.value += lastResult.value.score
        setTimeout(() => {
          flashScoreField('score')
        }, 300)
        
        // Hide dialog after 2 seconds
        setTimeout(() => {
          showResultDialog.value = false
        }, 2000)
      }
    }
    if(timeRemaining.value === 8 )
        playsound(tickingSound)
  }, 1000)
  
}

function selectAnswer(answerId, type) {
  if (hasSubmitted.value) return
  
  if (type === 'single') {
    selectedAnswers.value = [answerId]
  }
  // For multiple choice, v-model handles it automatically
}

async function submitAnswer() {
  if (hasSubmitted.value || !canSubmit.value) return
  
  hasSubmitted.value = true
  
  try {
    const responseData = {
      participantId: parseInt(participantId),
      questionId: currentQuestion.value.questionId,
      answerIds: currentQuestion.value.questionType === 'ShortAnswer' ? [] : selectedAnswers.value,
      textAnswer: currentQuestion.value.questionType === 'ShortAnswer' ? shortAnswer.value : null,
    }
    
    await signalR.invoke("SubmitAnswer", accessCode, responseData)
    console.log("auto submitting")
  } catch (error) {
    console.error('Error submitting answer:', error)
    hasSubmitted.value = false
  }
}

function backToHome() {
  isLeavingSession.value = true
  removeBeforeUnloadHandler()
  router.push('/')
}

// Show leave confirmation modal
function showLeaveConfirm() {
  showLeaveModal.value = true
}

// Hide leave confirmation modal
function hideLeaveConfirm() {
  showLeaveModal.value = false
}

// Confirm leave and execute leave session
async function confirmLeave() {
  showLeaveModal.value = false
  isLeavingSession.value = true
  await leaveSession()
}

async function leaveSession() {
  // Clear refresh flag to ensure we actually leave
  sessionStorage.removeItem('isRefreshing')
  
  try{
    await signalR.invoke("LeaveSession", parseInt(participantId) , accessCode)
    ClearConnection() 
    removeBeforeUnloadHandler()
  }
  catch (err){
    console.error('Error leaving session:', err)
  }
  finally {
    router.push('/')
  }
}

async function removedFromSession() {
  isLeavingSession.value = true
  sessionStorage.removeItem('isRefreshing')
  ClearConnection() 
  removeBeforeUnloadHandler()
  router.push('/join')
}

// Legacy function for existing modal
function hideLeaveCofirm() {
  showRemoveModal.value = false
}

// Simple close lobby function - chỉ hiện modal xác nhận
function closeLobby() {
  showLeaveConfirm()
}

async function ClearConnection() {
 signalR.clearAllEvents()
 await disconnect()
}
</script>


<style scoped>
    .scoreboard {
  position: fixed;
  top: 20px;               
  left: 50%;
  transform: translateX(-50%); 
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 15px 25px;
  border-radius: 12px;
  z-index: 9999;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;           /* dùng flexbox */
  align-items: center;     /* căn giữa theo chiều dọc */
  gap: 25px;              /* khoảng cách giữa các item */
  min-width: auto;        /* cho phép tự động điều chỉnh */
}

/* Loại bỏ tiêu đề scoreboard không cần thiết */
.scoreboard h3 {
  display: none;
}

/* Các item điểm nằm ngang */
.scoreboard .score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 60px;
}

.scoreboard .score-item .label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scoreboard .score-item .value {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

/* Màu sắc cho từng loại điểm */
.scoreboard .score-item:nth-child(1) .value {
  color: #22c55e; /* xanh lá cho đúng */
}

.scoreboard .score-item:nth-child(2) .value {
  color: #ef4444; /* đỏ cho sai */
}

.scoreboard .score-item.score-total .value {
  color: #fbbf24; /* vàng cho tổng điểm */
}
.lobby-container {
    width : 100%;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 2rem;
}

.code-info {
    flex: 1;
}

.code-info label {
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
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.35);
}

/* Game & Question Layouts */
.game-container {
    width: 100%;
    min-height: 100vh;
    padding: 2.5rem;
    background: linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.9) 100%);
    color: #e6eef8;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Countdown Screen */
.countdown-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

.countdown-content {
    text-align: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 10px 40px rgba(2,6,23,0.6);
    width: 100%;
}

.countdown-title {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: #cfe8ff;
    font-weight: 600;
}

.countdown-number {
    font-size: 6rem;
    font-weight: 800;
    line-height: 1;
    margin: 0.25rem 0;
    color: #fff;
    text-shadow: 0 8px 30px rgba(79,70,229,0.45);
    transition: transform 0.25s ease;
}

.countdown-number.pulse {
    animation: pulseScale 1s infinite;
}

@keyframes pulseScale {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
}

.countdown-message {
    margin-top: 0.5rem;
    color: #a7c4ff;
    font-size: 1rem;
}

/* Question Container */
.question-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.question-number {
    background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-weight: 700;
    color: #dbeafe;
    border: 1px solid rgba(255,255,255,0.05);
}

.timer {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    color: #bbdefb;
    font-weight: 700;
    border: 1px solid rgba(255,255,255,0.04);
    transition: all 0.2s ease;
}

.timer i {
    font-size: 1rem;
}

/* Warning state */
.timer-warning {
    background: linear-gradient(90deg, rgba(255,235,59,0.08), rgba(255,87,34,0.06));
    color: #ffebc2;
    box-shadow: 0 6px 20px rgba(255,87,34,0.12);
    transform: scale(1.02);
}

/* Question content */
.question-content {
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    padding: 1.75rem;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.04);
    box-shadow: 0 6px 20px rgba(2,6,23,0.6);
}

.question-text {
    margin: 0;
    font-size: 1.5rem;
    color: #e6f0ff;
    line-height: 1.4;
    font-weight: 700;
}

/* Answer Section common */
.answer-section {
    display: grid;
    gap: 1rem;
    margin-top: 0.5rem;
}

/* Answer buttons */
.answer-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 10px;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.04);
    background: linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01));
    cursor: pointer;
    font-weight: 700;
    color: #e6f0ff;
    transition: all 0.18s ease;
    box-shadow: 0 6px 18px rgba(2,6,23,0.5);
}

.answer-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(2,6,23,0.6);
}

/* Disabled state */
.answer-btn.disabled,
.answer-btn[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Selected state */
.answer-btn.selected {
    outline: 2px solid rgba(79,70,229,0.9);
    background: linear-gradient(90deg, rgba(79,70,229,0.18), rgba(124,58,237,0.08));
    box-shadow: 0 12px 40px rgba(79,70,229,0.2);
}

/* True/False specific */
.true-false-options {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.true-false-btn {
    width: 160px;
    justify-content: center;
    font-size: 1.05rem;
}

/* Single choice: label + text */
.single-choice-btn {
    justify-content: flex-start;
    align-items: center;
}

.single-choice-btn .answer-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    border-radius: 10px;
    font-weight: 900;
    margin-right: 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.02);
}

/* Color variants for single choices (4 colors loop) */
.color-0 .answer-label { background: linear-gradient(180deg, rgba(79,70,229,0.12), rgba(99,102,241,0.06)); }
.color-1 .answer-label { background: linear-gradient(180deg, rgba(16,185,129,0.12), rgba(34,197,94,0.06)); }
.color-2 .answer-label { background: linear-gradient(180deg, rgba(59,130,246,0.12), rgba(96,165,250,0.06)); }
.color-3 .answer-label { background: linear-gradient(180deg, rgba(234,88,12,0.12), rgba(249,115,22,0.06)); }

/* Answer text */
.answer-text {
    flex: 1;
    font-weight: 600;
    color: #e6f0ff;
}

/* Multiple choice (checkbox style) */
.multiple-choice-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.choice-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #cfe8ff;
    font-size: 0.95rem;
    opacity: 0.95;
    margin-bottom: 0.5rem;
}

.answer-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.01);
    border: 1px solid rgba(255,255,255,0.03);
    cursor: pointer;
    transition: all 0.15s ease;
    color: #e6f0ff;
    user-select: none;
}

.answer-checkbox input {
    display: none;
}

.answer-checkbox .checkbox-custom {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid rgba(255,255,255,0.12);
    display: inline-block;
    position: relative;
    flex-shrink: 0;
}

/* checked state using sibling input:checked (works because input is inside label) */
.answer-checkbox input:checked + .checkbox-custom {
    background: linear-gradient(90deg, rgba(79,70,229,0.9), rgba(124,58,237,0.7));
    border-color: rgba(79,70,229,0.95);
    box-shadow: 0 6px 18px rgba(79,70,229,0.18);
}

/* Custom checkmark */
.answer-checkbox .checkbox-custom::after {
    content: '';
    position: absolute;
    inset: 4px;
    opacity: 0;
    transform: scale(0.6) rotate(20deg);
    transition: all 0.12s ease;
    border-radius: 3px;
}

.answer-checkbox input:checked + .checkbox-custom::after {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    background: rgba(255,255,255,0.12);
}

/* Labels style inside checkbox */
.answer-checkbox .answer-label {
    min-width: 36px;
    font-weight: 800;
}

/* Short answer textarea */
.short-answer-section {
    display: flex;
    flex-direction: column;
}

.short-answer-input {
    width: 100%;
    min-height: 120px;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    color: #eaf4ff;
    font-size: 1rem;
    resize: vertical;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.2);
    transition: box-shadow 0.12s ease, border 0.12s ease;
}

.short-answer-input:focus {
    outline: none;
    border-color: rgba(79,70,229,0.9);
    box-shadow: 0 8px 30px rgba(79,70,229,0.12);
}

/* Submit section */
.submit-section {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.btn-submit {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    padding: 0.9rem 2rem;
    border-radius: 12px;
    font-weight: 800;
    font-size: 1.05rem;
    cursor: pointer;
    box-shadow: 0 8px 26px rgba(79,70,229,0.2);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: inline-flex;
    gap: 0.75rem;
    align-items: center;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(79,70,229,0.28);
}

/* Waiting message after submit */
.waiting-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.03);
    color: #dbeafe;
    font-weight: 700;
}

/* Session ended screen */
.session-ended {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.ended-content {
    text-align: center;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.04);
    max-width: 640px;
    box-shadow: 0 12px 36px rgba(2,6,23,0.6);
}

.ended-content h2 {
    margin: 0.5rem 0;
    color: #fff;
    font-size: 1.6rem;
}

.ended-content p {
    color: #cfe8ff;
    margin-bottom: 1rem;
}

/* Loading spinner & waiting screen */
.waiting-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #dbeafe;
}

.loading-spinner {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 8px solid rgba(255,255,255,0.06);
    border-top-color: rgba(79,70,229,0.9);
    animation: spin 1s linear infinite;
    box-shadow: 0 8px 20px rgba(79,70,229,0.08);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Result Dialog - NEW STYLES */
.result-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(8px);
    animation: fadeInOverlay 0.3s ease;
}

@keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
}

.result-dialog {
    max-width: 500px;
    width: 90%;
    animation: slideInResult 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInResult {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.result-dialog-content {
    background: white;
    border-radius: 20px;
    padding: 3rem 2rem 2.5rem;
    text-align: center;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    border: 3px solid transparent;
    position: relative;
    overflow: hidden;
}

.result-dialog-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.result-dialog-content.correct {
    border-color: #22c55e;
    color: #065f46;
}

.result-dialog-content.correct::before {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.result-dialog-content.wrong {
    border-color: #ef4444;
    color: #991b1b;
}

.result-dialog-content.wrong::before {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.result-icon {
    margin-bottom: 1.5rem;
}

.result-icon i {
    font-size: 4rem;
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.result-dialog-content.correct .result-icon i {
    color: #22c55e;
    text-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.result-dialog-content.wrong .result-icon i {
    color: #ef4444;
    text-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}

.result-title {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.result-score {
    font-size: 1.2rem;
    margin: 0;
    font-weight: 600;
}

.result-score strong {
    font-size: 1.5rem;
    font-weight: 800;
}

.result-dialog-content.correct .result-score strong {
    color: #16a34a;
}

.result-dialog-content.wrong .result-score strong {
    color: #dc2626;
}

/* Responsive tweaks */
@media (max-width: 900px) {
    .participants-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    .countdown-number { font-size: 4.5rem; }
    .question-text { font-size: 1.25rem; }
    .answer-btn { padding: 0.75rem; }
    
    .result-dialog-content {
        padding: 2.5rem 1.5rem 2rem;
    }
    
    .result-icon i {
        font-size: 3rem;
    }
    
    .result-title {
        font-size: 1.5rem;
    }
}

@media (max-width: 520px) {
    .lobby-container { padding: 1.25rem; }
    .participant-card { padding: 1rem; }
    .room-code { font-size: 1.125rem; padding: 0.5rem 1rem; }
    .answer-btn .answer-label { min-width: 38px; height: 38px; }
    .true-false-btn { width: 140px; }
    .countdown-number { font-size: 3.5rem; }
    .btn { min-width: 120px; padding: 0.6rem 1rem; }
    
    .result-dialog-content {
        padding: 2rem 1rem 1.5rem;
    }
    
    .result-icon i {
        font-size: 2.5rem;
    }
    
    .result-title {
        font-size: 1.25rem;
    }
    
    .result-score {
        font-size: 1rem;
    }
    
    .result-score strong {
        font-size: 1.25rem;
    }
}

/* Small accessibility improvements */
.answer-btn:focus,
.answer-checkbox:focus-within {
    outline: 3px solid rgba(124,58,237,0.16);
    outline-offset: 2px;
}

/* Leaderboard Styles */
.leaderboard-content {
    text-align: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 10px 40px rgba(2,6,23,0.6);
    width: 100%;
    max-width: 900px;
}

.leaderboard-content h2 {
    margin: 0.5rem 0;
    color: #fff;
    font-size: 1.6rem;
}

.leaderboard-table {
    margin: 1rem 0 2rem;
}

.leaderboard-table table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.75rem;
}

.leaderboard-table th {
    text-align: left;
    padding: 0.75rem 1rem;
    color: #a7c4ff;
    font-weight: 600;
    font-size: 1rem;
}

.leaderboard-table td {
    padding: 1rem;
    background: rgba(255,255,255,0.01);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 8px;
    color: #e6eef8;
    font-weight: 600;
}

.leaderboard-table tr td:first-child {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.leaderboard-table tr td:last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
}

.rank {
    text-align: center;
    font-weight: bold;
    width: 80px;
}

.fa-medal {
    font-size: 1.5rem;
}

.gold {
    color: #ffd700;
}

.silver {
    color: #c0c0c0;
}

.bronze {
    color: #cd7f32;
}

.rank-gold td {
    background: linear-gradient(90deg, rgba(255,215,0,0.08), rgba(255,255,255,0.01));
}

.rank-silver td {
    background: linear-gradient(90deg, rgba(192,192,192,0.08), rgba(255,255,255,0.01));
}

.rank-bronze td {
    background: linear-gradient(90deg, rgba(205,127,50,0.08), rgba(255,255,255,0.01));
}

/* Responsive tweaks for leaderboard */
@media (max-width: 900px) {
    .leaderboard-table th, .leaderboard-table td {
        padding: 0.75rem;
        font-size: 0.95rem;
    }
}

@media (max-width: 520px) {
    .leaderboard-table th, .leaderboard-table td {
        padding: 0.5rem;
        font-size: 0.9rem;
    }
    .rank {
        width: 60px;
    }
    .fa-medal {
        font-size: 1.2rem;
    }
}

</style>