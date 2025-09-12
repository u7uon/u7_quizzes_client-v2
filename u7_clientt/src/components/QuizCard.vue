<!-- filepath: src/components/QuizCard.vue -->
<template>
  <div class="quiz-card">
    <div class="quiz-header" :style="{ backgroundImage: `url('${quiz.imageUrl}')` }">
      <!-- <div class="quiz-title-overlay">{{ quiz.title }}</div> -->
      <div class="quiz-meta">
        <span class="quiz-badge">{{ quiz.questionCount }} Qs</span>
        <span class="quiz-badge">{{ toFormattedString(quiz.totalAttempts) }} lần chơi</span>
      </div>
    </div>
    <div class="quiz-title-bottom">{{ quiz.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'QuizCard',
  props: {
    quiz: {
      type: Object,
      required: true
    }
  },
  methods: {
    toFormattedString(num) {
      // Định dạng số, ví dụ: 1,234
      return num?.toLocaleString?.() ?? num;
    }
  }
}
</script>

<style scoped>
.quiz-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  margin: 10px;
}
.quiz-card:hover {
  transform: translateY(-4px);
}
.quiz-header {
  position: relative;
  height: 120px;
  background-color: #6b3fa0;
  background-size: cover;
  background-position: center;
  padding: 8px;
}
.quiz-title-overlay {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px;
  border-radius: 8px;
  margin: 0 8px;
}
.quiz-meta {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
}
.quiz-badge {
  background-color: white;
  color: #555;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}
.quiz-title-bottom {
  text-align: center;
  font-weight: bold;
  padding: 10px 8px;
  font-size: 14px;
}
</style>