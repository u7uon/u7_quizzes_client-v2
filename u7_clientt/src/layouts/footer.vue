<template>
  <footer class="footer text-center mt-5">
    <div class="container">
      <p>© 2024 u7 Quizzi. Tất cả các quyền được bảo lưu.</p>
      <div>
        <router-link class="me-3" to="/about">Giới Thiệu</router-link>
        <router-link class="me-3" to="/contact">Liên Hệ</router-link>
        <router-link to="/privacy">Chính Sách Bảo Mật</router-link>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>