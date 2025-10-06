<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-particles"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text animate-fade-in-up">
          <h1 class="hero-title">
            <span class="gradient-text">Khám Phá</span>
            <span class="typing-text">Tri Thức Mới</span>
          </h1>
          <p class="hero-description">
            Thử thách bản thân với hàng nghìn câu hỏi thú vị từ nhiều lĩnh vực khác nhau. 
            Học tập và giải trí cùng lúc với Quiz Online!
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number counter" :data-target="10000" ref="counter1">0</span>
              <span class="stat-label">Câu hỏi</span>
            </div>
            <div class="stat-item">
              <span class="stat-number counter" :data-target="5000" ref="counter2">0</span>
              <span class="stat-label">Người chơi</span>
            </div>
            <div class="stat-item">
              <span class="stat-number counter" :data-target="50" ref="counter3">0</span>
              <span class="stat-label">Chủ đề</span>
            </div>
          </div>
          <button class="cta-button pulse-animation" @click="startQuiz">
            <span>Bắt Đầu Ngay</span>
            <i class="fas fa-rocket"></i>
          </button>
        </div>
        <div class="hero-image animate-float">
          <div class="hero-quiz-cards">
            <div class="floating-card card-1">
              <i class="fa-solid fa-calculator"></i>
              <span>Toán Học</span>
            </div>
            <div class="floating-card card-2">
              <i class="fa-solid fa-microchip"></i>
              <span>Công nghệ</span>
            </div>
            <div class="floating-card card-3">
              <i class="fas fa-brain"></i>
              <span>AI</span>
            </div>
            <div class="floating-card card-4">
              <i class="fas fa-flask"></i>
              <span>Hóa Học</span>
            </div>
            <div class="floating-card card-5">
              <i class="fas fa-globe"></i>
              <span>Địa Lý</span>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-indicator" @click="scrollToTrending">
        <div class="scroll-arrow bounce"></div>
      </div>
    </section>

    <!-- Trending Quizzes Section -->
    <section class="trending-section section-spacing" ref="trendingSection">
      <div class="container">
        <div class="section-header">
          <div class="section-title-container">
            <h2 class="section-title">
              <i class="fas fa-fire trending-icon"></i>
              Quiz Thịnh Hành
            </h2>
            <div class="trending-badge">HOT</div>
          </div>
          <p class="section-subtitle">Những quiz được yêu thích nhất tuần này</p>
        </div>
        
        <div class="quiz-carousel">
          <div class="quiz-grid trending-grid">
            <div 
              v-for="(quiz, index) in trendingQuizzes" 
              :key="quiz.quizId" 
              class="quiz-card-wrapper trending-item"
              @click="$router.push(`/quiz/details?quizId=5`)"
            >
              <div class="trending-rank">#{{ index + 1 }}</div>
              <QuizCard :quiz="quiz" />
              <div class="trending-overlay">
                <div class="trending-stats">
                  <span><i class="fas fa-users"></i> {{ quiz.totalAttempts }} lượt chơi</span>
                  <span><i class="fas fa-star"></i> 4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recommended Quizzes Section -->
    <section class="recommended-section section-spacing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-thumbs-up"></i>
            Đề Xuất Cho Bạn
          </h2>
          <p class="section-subtitle">Dựa trên sở thích và lịch sử học tập của bạn</p>
        </div>
        
        <div class="quiz-grid recommended-grid">
          <div 
            v-for="quiz in recommendedQuizzes" 
            :key="quiz.quizId" 
            class="quiz-card-wrapper recommended-item"
          >
            <div class="recommendation-badge">
              <i class="fas fa-heart"></i>
              Phù hợp với bạn
            </div>
            <QuizCard :quiz="quiz" />
            <div class="match-percentage">
              <div class="match-bar">
                <div class="match-fill" :style="`width: ${getRandomMatch()}%`"></div>
              </div>
              <span class="match-text">{{ getRandomMatch() }}% phù hợp</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Sections -->
    <section 
      v-for="category in categories" 
      :key="category.id" 
      class="category-section section-spacing"
      :class="{ 'even-section': category.id % 2 === 0 }"
    >
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i :class="category.icon"></i>
            {{ category.name }}
          </h2>
          <p class="section-subtitle">{{ category.description }}</p>
          <router-link :to="`/category/${category.id}`" class="view-all-link">
            Xem tất cả <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        
        <div class="quiz-grid category-grid">
          <div 
            v-for="quiz in getQuizzesByCategory(category.id)" 
            :key="quiz.quizId" 
            class="quiz-card-wrapper category-item"
          >
            <div class="category-badge" :style="`background: ${category.color}`">
              <i :class="category.icon"></i>
            </div>
            <QuizCard :quiz="quiz" />
            <div class="difficulty-indicator">
              <span class="difficulty-label">Độ khó:</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h3>Nhận thông báo về Quiz mới</h3>
            <p>Đăng ký để không bỏ lỡ những quiz thú vị nhất!</p>
          </div>
          <div class="newsletter-form">
            <input 
              type="email" 
              v-model="newsletterEmail"
              placeholder="Nhập email của bạn..." 
              class="newsletter-input"
              @keyup.enter="subscribeNewsletter"
            >
            <button class="newsletter-button" @click="subscribeNewsletter">
              <i class="fas fa-paper-plane"></i>
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import QuizCard from '../components/QuizCard.vue'

export default {
  name: 'Home',
  components: {
    QuizCard
  },
  setup() {
    const router = useRouter()
    const trendingSection = ref(null)
    const counter1 = ref(null)
    const counter2 = ref(null) 
    const counter3 = ref(null)
    const newsletterEmail = ref('')

    // Sample data
    const trendingQuizzes = ref([
      { quizId: 1, title: "Toán Học Cơ Bản", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 1234, questionCount: 10 },
      { quizId: 2, title: "Vật Lý Đại Cương", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 987, questionCount: 15 },
      { quizId: 3, title: "Lịch Sử Việt Nam", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 856, questionCount: 20 },
      { quizId: 4, title: "Tiếng Anh Giao Tiếp", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 743, questionCount: 12 }
    ])

    const recommendedQuizzes = ref([
      { quizId: 5, title: "Hóa Học Hữu Cơ", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 652, questionCount: 18 },
      { quizId: 6, title: "Địa Lý Thế Giới", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 534, questionCount: 14 },
      { quizId: 7, title: "Văn Học Việt Nam", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 421, questionCount: 16 },
      { quizId: 8, title: "Sinh Học Phân Tử", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 389, questionCount: 22 }
    ])

    const categories = ref([
      { id: 1, name: "Khoa Học Tự Nhiên", description: "Khám phá thế giới của Toán học, Vật lý, Hóa học và Sinh học", icon: "fas fa-flask", color: "linear-gradient(45deg, #667eea, #764ba2)" },
      { id: 2, name: "Khoa Học Xã Hội", description: "Tìm hiểu về Lịch sử, Địa lý và các vấn đề xã hội", icon: "fas fa-globe-americas", color: "linear-gradient(45deg, #f093fb, #f5576c)" },
      { id: 3, name: "Ngôn Ngữ", description: "Rèn luyện kỹ năng ngôn ngữ và giao tiếp", icon: "fas fa-language", color: "linear-gradient(45deg, #4facfe, #00f2fe)" },
      { id: 4, name: "Công Nghệ", description: "Cập nhật kiến thức về công nghệ và lập trình", icon: "fas fa-laptop-code", color: "linear-gradient(45deg, #43e97b, #38f9d7)" },
      { id: 5, name: "Nghệ Thuật", description: "Khám phá thế giới nghệ thuật và văn hóa", icon: "fas fa-palette", color: "linear-gradient(45deg, #fa709a, #fee140)" }
    ])

    const quizzesByCategory = {
      1: [
        { quizId: 9, title: "Đại Số Tuyến Tính", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 567, questionCount: 25 },
        { quizId: 10, title: "Cơ Học Cổ Điển", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 432, questionCount: 18 },
        { quizId: 11, title: "Hóa Học Vô Cơ", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 678, questionCount: 20 }
      ],
      2: [
        { quizId: 12, title: "Lịch Sử Thế Giới", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 789, questionCount: 30 },
        { quizId: 13, title: "Địa Lý Kinh Tế", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 456, questionCount: 22 },
        { quizId: 14, title: "Tâm Lý Học Đại Cương", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 543, questionCount: 16 }
      ],
      3: [
        { quizId: 15, title: "TOEIC Practice", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 1123, questionCount: 40 },
        { quizId: 16, title: "Tiếng Trung Cơ Bản", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 334, questionCount: 15 },
        { quizId: 17, title: "Ngữ Pháp Tiếng Việt", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 667, questionCount: 25 }
      ],
      4: [
        { quizId: 18, title: "Lập Trình C#", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 892, questionCount: 35 },
        { quizId: 19, title: "Cơ Sở Dữ Liệu", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 756, questionCount: 28 },
        { quizId: 20, title: "Trí Tuệ Nhân Tạo", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 445, questionCount: 20 }
      ],
      5: [
        { quizId: 21, title: "Lịch Sử Nghệ Thuật", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 389, questionCount: 24 },
        { quizId: 22, title: "Âm Nhạc Cổ Điển", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 234, questionCount: 18 },
        { quizId: 23, title: "Văn Hóa Dân Gian", imageUrl: "https://storage.googleapis.com/a1aa/image/69f22bfb-363d-4813-1c18-7cadb89f5f99.jpg", totalAttempts: 512, questionCount: 22 }
      ]
    }

    // // Methods
    // const animateCounters = () => {
    //   const counters = [counter1.value, counter2.value, counter3.value]
    //   counters.forEach((counter) => {
    //     if (!counter) return
    //     const target = parseInt(counter.dataset.target)
    //     const increment = target / 100
    //     let current = 0
        
    //     const updateCounter = () => {
    //       if (current < target) {
    //         current += increment
    //         counter.textContent = Math.floor(current).toLocaleString()
    //         requestAnimationFrame(updateCounter)
    //       } else {
    //         counter.textContent = target.toLocaleString()
    //       }
    //     }
        
    //     updateCounter()
    //   })
    // }

    const scrollToTrending = () => {
      if (trendingSection.value) {
        trendingSection.value.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const startQuiz = () => {
      router.push('/quizzes')
    }

    const getRandomMatch = () => {
      return Math.floor(Math.random() * 16) + 80 // 80-95%
    }

    const getQuizzesByCategory = (categoryId) => {
      return quizzesByCategory[categoryId] || []
    }

    const subscribeNewsletter = async () => {
      if (!newsletterEmail.value) {
        alert('Vui lòng nhập email!')
        return
      }
      
      try {
        // Call API to subscribe newsletter
        console.log('Subscribing email:', newsletterEmail.value)
        alert('Đăng ký thành công!')
        newsletterEmail.value = ''
      } catch (error) {
        console.error('Newsletter subscription failed:', error)
        alert('Có lỗi xảy ra, vui lòng thử lại!')
      }
    }

    // Setup intersection observer for animations
    // const setupScrollAnimations = () => {
    //   const observerOptions = {
    //     threshold: 0.1,
    //     rootMargin: '0px 0px -50px 0px'
    //   }

    //   const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //       if (entry.isIntersecting) {
    //         entry.target.style.opacity = '1'
    //         entry.target.style.transform = 'translateY(0)'
            
    //         // Animate counters when hero section is visible
    //         if (entry.target.classList.contains('hero-section')) {
    //           setTimeout(animateCounters, 500)
    //         }
    //       }
    //     })
    //   }, observerOptions)

    //   // Observe sections for scroll animations
    //   const sections = document.querySelectorAll('section')
    //   sections.forEach(section => {
    //     section.style.opacity = '0'
    //     section.style.transform = 'translateY(30px)'
    //     section.style.transition = 'all 0.8s ease-out'
    //     observer.observe(section)
    //   })

    //   // Hero section should be visible immediately
    //   const heroSection = document.querySelector('.hero-section')
    //   if (heroSection) {
    //     heroSection.style.opacity = '1'
    //     heroSection.style.transform = 'translateY(0)'
    //   }
    // }

    onMounted(async () => {
      await nextTick()
    })

    return {
      trendingSection,
      newsletterEmail,
      trendingQuizzes,
      recommendedQuizzes,
      categories,
      scrollToTrending,
      startQuiz,
      getRandomMatch,
      getQuizzesByCategory,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
/* Global Styles */
.home-container {
  overflow: hidden;
}



.section-spacing {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.2)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.4)"/><circle cx="90" cy="90" r="1" fill="rgba(255,255,255,0.2)"/></svg>');
  animation: float 20s ease-in-out infinite;
}

.hero-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.typing-text {
  display: inline-block;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #feca57;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.cta-button {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.hero-image {
  position: relative;
  height: 400px;
}

.hero-quiz-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
}

.floating-card i {
  font-size: 2rem;
  color: #667eea;
}

.card-1 {
  position: absolute;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.card-2 {
  position: absolute;
  top: 10%;
  right: 20%;
  animation-delay: 2s;
}

.card-3 {
  position: absolute;
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

.card-4 {
  position: absolute;
  bottom: 20%;
  right: 10%;
  animation-delay: 6s;
}

.card-5 {
  position: absolute;
  bottom: 10%;
  left: 50%;
  animation-delay: 8s;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  cursor: pointer;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 15px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 0;
}

.trending-icon {
  color: #ff6b6b;
  animation: pulse 2s infinite;
}

.trending-badge {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

/* Quiz Grids */
.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.quiz-card-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.quiz-card-wrapper:hover {
  transform: translateY(-10px);
}

/* Trending Section */
.trending-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.trending-item {
  position: relative;
}

.trending-rank {
  position: absolute;
  top: -10px;
  left: -10px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
}

.trending-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 10px;
  opacity: 0;
  transition: all 0.3s ease;
}

.trending-item:hover .trending-overlay {
  opacity: 1;
}

.trending-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

/* Recommended Section */
.recommended-section {
  background: #fff;
}

.recommendation-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #48dbfb, #0abde3);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
}

.match-percentage {
  margin-top: 15px;
  text-align: center;
}

.match-bar {
  width: 100%;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.match-fill {
  height: 100%;
  background: linear-gradient(90deg, #48dbfb, #0abde3);
  border-radius: 3px;
  transition: width 1s ease;
}

.match-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 600;
}

/* Category Sections */
.category-section.even-section {
  background: #f8f9fa;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #764ba2;
  gap: 10px;
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.difficulty-indicator {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.difficulty-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 60px 0;
}

.newsletter-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.newsletter-text h3 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.newsletter-text p {
  opacity: 0.8;
  font-size: 1.1rem;
}

.newsletter-form {
  display: flex;
  gap: 10px;
}

.newsletter-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
}

.newsletter-button {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.newsletter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

/* Animations */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes typing {
  0%, 50% { width: 0; }
  100% { width: 100%; }
}

@keyframes blink {
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: white; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(45deg); }
  40% { transform: translateY(-10px) rotate(45deg); }
  60% { transform: translateY(-5px) rotate(45deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .quiz-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
}
</style>