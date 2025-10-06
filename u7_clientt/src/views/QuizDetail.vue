<template>
  <div class="quiz-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải thông tin quiz...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h2>Có lỗi xảy ra</h2>
      <p>{{ error }}</p>
      <button @click="fetchQuizDetail" class="retry-btn">Thử lại</button>
    </div>

    <!-- Quiz Content -->
    <div v-else-if="quiz" class="quiz-content">
      <!-- Quiz Header -->
      <div class="quiz-header">
        <div class="quiz-image-container">
          <img 
            v-if="quiz.coverImage" 
            :src="getCloudinaryImageUrl(quiz.coverImage, { width: 300, height: 200 })" 
            :alt="quiz.title"
            class="quiz-cover-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <div v-else class="default-cover">
            <i class="quiz-icon">📝</i>
          </div>
          <div v-if="imageLoading" class="image-loading">
            <div class="image-spinner"></div>
          </div>
        </div>

        <div class="quiz-info">
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          <p v-if="quiz.description" class="quiz-description">{{ quiz.description }}</p>
          
          <div class="quiz-meta">
            <div class="meta-item">
              <i class="icon">⏱️</i>
              <span>{{ formatTimeLimit(quiz.timeLimit) }}</span>
            </div>
            <div class="meta-item">
              <i class="icon">{{ quiz.isPublic ? '🌐' : '🔒' }}</i>
              <span>{{ quiz.isPublic ? 'Công khai' : 'Riêng tư' }}</span>
            </div>
            <div class="meta-item">
              <i class="icon">❓</i>
              <span>{{ quiz.questionsCount || 'Chưa có' }} câu hỏi</span>
            </div>
          </div>

          <!-- Categories -->
          <div v-if="quiz.categories && quiz.categories.length > 0" class="categories">
            <h3>Danh mục:</h3>
            <div class="category-tags">
              <span 
                v-for="category in quiz.categories" 
                :key="category"
                class="category-tag"
              >
                {{ category }}
              </span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="quiz.tags && quiz.tags.length > 0" class="tags">
            <h3>Thẻ:</h3>
            <div class="tag-list">
              <span 
                v-for="tag in quiz.tags" 
                :key="tag"
                class="tag-item"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions Preview - Removed since not in DTO -->
      <!-- Questions preview would be loaded separately if needed -->
      <div v-if="showQuestionsPreview" class="questions-info">
        <h2>Thông tin bài quiz</h2>
        <div class="quiz-stats">
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>Thống kê</h3>
              <p>Thông tin chi tiết sẽ được hiển thị khi bắt đầu làm bài</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3>Mục tiêu</h3>
              <p>Hoàn thành tất cả câu hỏi trong thời gian quy định</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="startQuiz" class="start-quiz-btn">
          Bắt đầu làm bài
        </button>
        <button @click="goBack" class="back-btn">
          Quay lại
        </button>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="no-data-container">
      <div class="no-data-icon">📝</div>
      <h2>Không tìm thấy quiz</h2>
      <p>không tìm thấy thông tin</p>
      <button @click="goBack" class="back-btn">Quay lại</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AxiosClient from '../utils/axiosClient'

// Composables
const route = useRoute()
const router = useRouter()

// Reactive data
const quiz = ref(null)
const loading = ref(false)
const error = ref(null)
const imageLoading = ref(false)
const showQuestionsPreview = ref(true) // Control questions preview display

const startquizError = ref(null)
const startquizLoading = ref(false)
// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUDNAME // Replace with your actual cloud name
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`

// Computed
const quizId = computed(() => route.query.quizId )

// Methods
const getCloudinaryImageUrl = (publicId, transformations = {}) => {
  if (!publicId) return ''
  
  // Default transformations
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'fill',
    ...transformations
  }
  
  // Build transformation string
  const transformationString = Object.entries(defaultTransformations)
    .map(([key, value]) => {
      switch (key) {
        case 'width': return `w_${value}`
        case 'height': return `h_${value}`
        case 'quality': return `q_${value}`
        case 'fetch_format': return `f_${value}`
        case 'crop': return `c_${value}`
        default: return `${key}_${value}`
      }
    })
    .join(',')
  
  return `${CLOUDINARY_BASE_URL}${transformationString}/${publicId}`
}

const fetchQuizDetail = async () => {
  if (!quizId.value) {
    error.value = 'Không tìm thấy ID quiz'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const response = await AxiosClient.get(`/quizzes/details/${quizId.value}`)
    quiz.value = response
  } catch (err) {
    error.value = "Đã xảy ra lỗi vui lòng thử lại"
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatTimeLimit = (timeLimit) => {
  if (!timeLimit) return 'Không giới hạn'
  
  const minutes = Math.floor(timeLimit / 60)
  const seconds = timeLimit % 60
  
  if (minutes === 0) return `${seconds} giây`
  if (seconds === 0) return `${minutes} phút`
  return `${minutes} phút ${seconds} giây`
}

const handleImageError = (event) => {
  imageLoading.value = false
  event.target.style.display = 'none'
  const defaultCover = event.target.parentNode.querySelector('.default-cover')
  if (defaultCover) {
    defaultCover.style.display = 'flex'
  }
}

const handleImageLoad = (event) => {
  imageLoading.value = false
  event.target.classList.add('loaded')
}

const startQuiz = async () => {
  try {
    startquizLoading.value = true
    var newSession =  await AxiosClient.post(`session`,{
      quizId: quizId.value
    })

    router.push("/lobby/" + newSession.sessionId)
  }
  catch {
    startquizError.value = "Không thể tạo phiên làm bài. Vui lòng thử lại."
  }

  finally {
    startquizLoading.value = false
  }
 


}

const goBack = () => {
  router.go(-1)
}
// Watchers
watch(
  () => route.query.quizid,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      fetchQuizDetail()
    }
  }
)

watch(
  () => route.params.quizid,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      fetchQuizDetail()
    }
  }
)

// Lifecycle
onMounted(() => {
  fetchQuizDetail()
})
</script>

<style scoped>
.quiz-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #666;
}

.loading-spinner, .image-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.image-spinner {
  width: 30px;
  height: 30px;
  border-width: 3px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Image Loading States */
.image-loading, .question-image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Error State */
.error-container {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.retry-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #0056b3;
}

/* Quiz Header */
.quiz-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin-bottom: 40px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.quiz-image-container {
  position: relative;
}

.quiz-cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-cover-image.loaded {
  opacity: 1;
}

.default-cover {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.quiz-icon {
  font-size: 48px;
}

.quiz-title {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.3;
}

.quiz-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
}

.quiz-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

.icon {
  font-size: 16px;
}

/* Categories and Tags */
.categories, .tags {
  margin-bottom: 20px;
}

.categories h3, .tags h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.category-tags, .tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  background: #007bff;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.tag-item {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

/* Questions Info */
.questions-info {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.questions-info h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 24px;
}

.quiz-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}

.start-quiz-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-quiz-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

/* No Data State */
.no-data-container {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.no-data-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quiz-detail-page {
    padding: 15px;
  }

  .quiz-header {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 20px;
  }

  .quiz-image-container {
    max-width: 250px;
    margin: 0 auto;
  }

  .quiz-title {
    font-size: 24px;
  }

  .questions-info {
    padding: 20px;
  }

  .quiz-stats {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .start-quiz-btn, .back-btn {
    width: 100%;
    max-width: 300px;
  }

  .quiz-meta {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .quiz-header {
    padding: 15px;
  }

  .questions-info {
    padding: 15px;
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
}
</style>