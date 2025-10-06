<template >
  <nav class="navbar navbar-expand-lg navbar-light sticky-top">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img 
          src="../assets/img/logo.png" 
          alt="U7 Quizzes Logo" 
          class="navbar-logo me-2"
        >
        <!-- <span class="brand-text">Quizzes</span> -->
      </router-link>
      <button 
        class="navbar-toggler" 
        type="button" 
        @click="toggleNavbar"
        :aria-expanded="isNavbarOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div 
        class="collapse navbar-collapse justify-content-end align-items-center" 
        :class="{ show: isNavbarOpen }"
        id="navbarNav"
      >
        <ul class="navbar-nav align-items-center ms-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="active">
              Trang Chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/quizzes">
              Bài Trắc Nghiệm
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">
              Giới Thiệu
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-outline-primary ms-3" to="/join">
              <i class="fas fa-sign-in-alt me-1"></i>Tham gia phòng
            </router-link>
          </li>
          <li class="nav-item" v-if="currentUser === null">
            <router-link class="btn btn-outline-primary ms-3" to="/login">
              Đăng Nhập
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import axios from '../utils/axiosClient'

import infoSound from "../assets/sounds/info.mp3"
import warningSound from "../assets/sounds/warning.mp3"

const infos = new Audio(infoSound)
const warnings = new Audio(warningSound)

const userStore = useUserStore()
const isNavbarOpen = ref(false)
const currentUser = computed(() => userStore.currentUser)

const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value
}

const logout = async () => {
  await userStore.logout()
}

onMounted(() => {
   userStore.loadUser()
})
</script>



<style scoped>
* {
  box-sizing: border-box;
}
html, body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

a, .btn-link {
    color: #006bb7;
}

.btn-primary {
    color: #fff;
    background-color: #1b6ec2;
    border-color: #1861ac;
}

.btn:focus, .btn:active:focus, .btn-link.nav-link:focus, .form-control:focus, .form-check-input:focus {
  box-shadow: 0 0 0 0.1rem white, 0 0 0 0.25rem #258cfb;
}

.content {
    padding-top: 1.1rem;
}

h1:focus {
    outline: none;
}

.valid.modified:not([type=checkbox]) {
    outline: 1px solid #26b050;
}

.invalid {
    outline: 1px solid #e50000;
}

.validation-message {
    color: #e50000;
}

.blazor-error-boundary {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNDkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIG92ZXJmbG93PSJoaWRkZW4iPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHg9IjIzNSIgeT0iNTEiIHdpZHRoPSI1NiIgaGVpZ2h0PSI0OSIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMzUgLTUxKSI+PHBhdGggZD0iTTI2My41MDYgNTFDMjY0LjcxNyA1MSAyNjUuODEzIDUxLjQ4MzcgMjY2LjYwNiA1Mi4yNjU4TDI2Ny4wNTIgNTIuNzk4NyAyNjcuNTM5IDUzLjYyODMgMjkwLjE4NSA5Mi4xODMxIDI5MC41NDUgOTIuNzk1IDI5MC42NTYgOTIuOTk2QzI5MC44NzcgOTMuNTEzIDI5MSA5NC4wODE1IDI5MSA5NC42NzgyIDI5MSA5Ny4wNjUxIDI4OS4wMzggOTkgMjg2LjYxNyA5OUwyNDAuMzgzIDk5QzIzNy45NjMgOTkgMjM2IDk3LjA2NTEgMjM2IDk0LjY3ODIgMjM2IDk0LjM3OTkgMjM2LjAzMSA5NC4wODg2IDIzNi4wODkgOTMuODA3MkwyMzYuMzM4IDkzLjAxNjIgMjM2Ljg1OCA5Mi4xMzE0IDI1OS40NzMgNTMuNjI5NCAyNTkuOTYxIDUyLjc5ODUgMjYwLjQwNyA1Mi4yNjU4QzI2MS4yIDUxLjQ4MzcgMjYyLjI5NiA1MSAyNjMuNTA2IDUxWk0yNjMuNTg2IDY2LjAxODNDMjYwLjczNyA2Ni4wMTgzIDI1OS4zMTMgNjcuMTI0NSAyNTkuMzEzIDY5LjMzNyAyNTkuMzEzIDY5LjYxMDIgMjU5LjMzMiA2OS44NjA4IDI1OS4zNzEgNzAuMDg4N0wyNjEuNzk1IDg0LjAxNjEgMjY1LjM4IDg0LjAxNjEgMjY3LjgyMSA2OS43NDc1QzI2Ny44NiA2OS43MzA5IDI2Ny44NzkgNjkuNTg3NyAyNjcuODc5IDY5LjMxNzkgMjY3Ljg3OSA2Ny4xMTgyIDI2Ni40NDggNjYuMDE4MyAyNjMuNTg2IDY2LjAxODNaTTI2My41NzYgODYuMDU0N0MyNjEuMDQ5IDg2LjA1NDcgMjU5Ljc4NiA4Ny4zMDA1IDI1OS43ODYgODkuNzkyMSAyNTkuNzg2IDkyLjI4MzcgMjYxLjA0OSA5My41Mjk1IDI2My41NzYgOTMuNTI5NSAyNjYuMTE2IDkzLjUyOTUgMjY3LjM4NyA5Mi4yODM3IDI2Ny4zODcgODkuNzkyMSAyNjcuMzg3IDg3LjMwMDUgMjY2LjExNiA4Ni4wNTQ3IDI2My41NzYgODYuMDU0N1oiIGZpbGw9IiNGRkU1MDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4=) no-repeat 1rem/1.8rem, #b32121;
    padding: 1rem 1rem 1rem 3.7rem;
    color: white;
}

    .blazor-error-boundary::after {
        content: "An error has occurred."
    }

.darker-border-checkbox.form-check-input {
    border-color: #929292;
}

.form-floating > .form-control-plaintext::placeholder, .form-floating > .form-control::placeholder {
    color: var(--bs-secondary-color);
    text-align: end;
}

.form-floating > .form-control-plaintext:focus::placeholder, .form-floating > .form-control:focus::placeholder {
    text-align: start;
}


body {
        font-family: 'Poppins', sans-serif;
        background: rgb(255, 255, 255)   ;
        margin: 0;
        padding: 0;
    }
/* Elegant Navbar */
       .navbar {
  background: linear-gradient(90deg, #6c63ff 0%, #a29bfe 100%);
  box-shadow: 0 8px 30px rgb(108 99 255 / 0.4);
  padding: 0.8rem 1rem;
  position: sticky;
  top: 0;
  z-index: 1030;
}

.navbar .container {
  max-width: 1140px;
}

.navbar-brand {
  text-decoration: none !important;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.navbar-brand:hover .brand-text {
  color: #d1c4ff !important;
  text-shadow: 0 3px 12px rgba(255, 255, 255, 0.7);
}

/* Navigation links - Fixed spacing */
.navbar-nav {
  align-items: center;
}

.nav-item {
  margin: 0 0.25rem; /* Consistent spacing between all nav items */
}
.nav-item:first-child {
    position: relative;
    bottom:  8px;
}

.nav-item:last-child {
    position: relative;
    top: 3px;
}



.nav-link {
  color: #e0dbff !important;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 3px;
  bottom: 0;
  left: 0;
  background: #fff;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover,
.nav-link.active {
  color: #fff !important;
  background-color: rgba(255 255 255 / 0.25);
  box-shadow: 0 4px 15px rgb(255 255 255 / 0.3);
  text-shadow: 0 0 5px rgba(255 255 255 / 0.7);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
        .btn-outline-primary {
            border-color: #d1c4ff;
            color: #000000;
            font-weight: 700;
            border-radius: 50px;
            padding: 0.4rem 1.2rem;
            font-size: 0.95rem;
            box-shadow: 0 0 10px rgba(209, 196, 255, 0.6);
            transition: all 0.3s ease;
            backdrop-filter: blur(6px);
            background-color: rgba(186, 136, 199, 0.1);
            user-select: none;
        }
        .btn-outline-primary:hover {
            background-color: #fff;
            color: #6c63ff;
            box-shadow: 0 0 20px #a29bfe;
            transform: translateY(-2px);
        }
        .navbar-toggler {
            border: none;
            outline: none;
            box-shadow: none;
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.3));
        }
        .navbar-toggler-icon {
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28217, 198, 255, 0.85%29' stroke-width='3' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.7));
        }
        /* Search input styling */
        #navbarSearchForm {
            display: flex;
            align-items: center;
            margin-left: 1.5rem;
            max-width: 320px;
            transition: max-width 0.3s ease;
            background: rgba(255 255 255 / 0.15);
            border-radius: 50px;
            padding: 0.15rem 0.3rem 0.15rem 0.8rem;
            box-shadow: 0 0 10px rgba(209, 196, 255, 0.4);
            backdrop-filter: blur(8px);
        }
        #navbarSearchForm .form-control {
            border: none;
            background: transparent;
            color: #fff;
            font-weight: 600;
            font-size: 0.95rem;
            padding-left: 0;
            box-shadow: none;
            outline: none;
            border-radius: 50px;
            width: 100%;
            transition: width 0.3s ease;
        }
        #navbarSearchForm .form-control::placeholder {
            color: #d1c4ffcc;
            font-weight: 500;
        }
        #navbarSearchForm .form-control:focus {
            box-shadow: none;
            background: rgba(255 255 255 / 0.25);
            color: #fff;
        }
        #navbarSearchForm button {
            border: none;
            background: transparent;
            color: #d1c4ff;
            font-size: 1.2rem;
            padding: 0 0.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        #navbarSearchForm button:hover {
            color: #fff;
        }
        header {
            background: linear-gradient(135deg, #6c63ff 0%, #a29bfe 100%);
            color: #fff;
            padding: 5rem 0;
            box-shadow: 0 8px 30px rgb(108 99 255 / 0.3);
            border-radius: 0 0 3rem 3rem;
            text-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
        }
        header h1 {
            font-weight: 700;
            letter-spacing: 1.5px;
        }
        header p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            font-weight: 500;
            opacity: 0.9;
        }
        .btn-light {
            font-weight: 700;
            color: #6c63ff;
            box-shadow: 0 6px 20px rgb(108 99 255 / 0.3);
            border-radius: 50px;
            padding: 0.75rem 2.5rem;
            transition: all 0.3s ease;
        }
        .btn-light:hover {
            background-color: #fff;
            color: #4a47d5;
            box-shadow: 0 10px 30px rgb(74 71 213 / 0.5);
            transform: translateY(-3px);
        }
    
        .table-primary {
            background: #d6d2ff !important;
            color: #4a47d5 !important;
            font-weight: 700;
        }
        table.table-striped > tbody > tr:nth-of-type(odd) {
            background-color: #f9f8ff;
        }
        .badge {
            font-weight: 600;
            font-size: 0.85rem;
            border-radius: 12px;
            padding: 0.4em 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .badge.bg-success {
            background-color: #8bc34a !important;
            color: #2e4600 !important;
            box-shadow: 0 4px 10px rgb(139 195 74 / 0.3);
        }
        .badge.bg-info {
            background-color: #4fc3f7 !important;
            color: #014f6a !important;
            box-shadow: 0 4px 10px rgb(79 195 247 / 0.3);
        }
        .badge.bg-warning {
            background-color: #ffd54f !important;
            color: #665500 !important;
            box-shadow: 0 4px 10px rgb(255 213 79 / 0.3);
        }
        section h2 {
            color: #4a47d5;
            font-weight: 700;
            margin-bottom: 2rem;
            letter-spacing: 1px;
        }
        .feature-icon {
            color: #6c63ff;
            margin-bottom: 1rem;
            transition: color 0.3s ease;
        }
        .feature-icon:hover {
            color: #4a47d5;
        }
        .footer {
            background-color: #c7a3e2;
            color: #dcdcff;
            padding: 2.5rem 0;
            font-weight: 500;
            letter-spacing: 0.05em;
        }
        .footer a {
            color: #dcdcff;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }
        .footer a:hover {
            color: #fff;
            text-decoration: underline;
        }

        /* Responsive improvements for mobile */
        @media (max-width: 768px) {
            header {
                padding: 4rem 1.5rem;
                border-radius: 0 0 2rem 2rem;
            }
            header h1 {
                font-size: 2.25rem;
                letter-spacing: 1.2px;
            }
            header p {
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
            }
            .btn-light {
                padding: 0.65rem 2rem;
                font-size: 1rem;
            }
            .quiz-card {
                border-radius: 1rem;
            }
            .card-title {
                font-size: 1.15rem;
            }
            .card-text {
                font-size: 0.9rem;
            }
            .card-footer {
                font-size: 0.85rem;
            }
        }
        @media (max-width: 576px) {
            .navbar-brand {
                font-size: 1.6rem;
            }
            .nav-link {
                font-size: 0.95rem;
                padding: 0.4rem 0.5rem;
            }
            .btn-outline-primary {
                font-size: 0.9rem;
                padding: 0.35rem 0.9rem;
            }
            header h1 {
                font-size: 1.9rem;
            }
            header p {
                font-size: 1rem;
            }
            .btn-light {
                padding: 0.55rem 1.8rem;
                font-size: 0.95rem;
            }
            .quiz-card {
                box-shadow: 0 6px 15px rgb(108 99 255 / 0.12);
            }
            .quiz-card:hover {
                box-shadow: 0 10px 25px rgb(108 99 255 / 0.3);
                transform: translateY(-5px);
            }
            .card-title {
                font-size: 1.1rem;
            }
            .card-text {
                font-size: 0.85rem;
            }
            .card-footer {
                font-size: 0.8rem;
            }
            section h2 {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
            }
            .feature-icon {
                font-size: 2.5rem !important;
                margin-bottom: 0.75rem;
            }
            .footer {
                font-size: 0.9rem;
                padding: 2rem 1rem;
            }
            .footer a {
                font-size: 0.9rem;
            }
            /* Search form full width on small */
            #navbarSearchForm {
                width: 100% !important;
                margin-top: 0.5rem;
            }
            #navbarSearchForm .form-control {
                width: 100%;
                border-radius: 50px;
                padding-left: 1.5rem;
            }
        }
        @media (max-width: 400px) {
            .btn-light {
                padding: 0.5rem 1.5rem;
                font-size: 0.9rem;
            }
            .nav-link {
                padding: 0.3rem 0.4rem;
            }
            .navbar-toggler {
                padding: 0.25rem 0.5rem;
            }
        }

        /* Search input styling */
        #navbarSearchForm {
            display: flex;
            align-items: center;
            margin-left: 1.5rem;
            max-width: 300px;
            transition: max-width 0.3s ease;
        }
        #navbarSearchForm .form-control {
            border-radius: 50px 0 0 50px;
            border-right: none;
            padding-left: 1.2rem;
            box-shadow: 0 2px 8px rgb(108 99 255 / 0.15);
            transition: box-shadow 0.3s ease;
        }
        #navbarSearchForm .form-control:focus {
            box-shadow: 0 4px 15px rgb(108 99 255 / 0.4);
            outline: none;
            border-color: #6c63ff;
        }
        #navbarSearchForm button {
            border-radius: 0 50px 50px 0;
            border: none;
            background-color: #6c63ff;
            color: white;
            padding: 0.45rem 1rem;
            box-shadow: 0 4px 15px rgb(108 99 255 / 0.4);
            transition: background-color 0.3s ease;
        }
        #navbarSearchForm button:hover {
            background-color: #4a47d5;
        }



        .auth-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;
        background: linear-gradient(to right, #667eea, #764ba2);
    }

    .auth-container {
        background: white;
        padding: 2.5rem 3rem;
        border-radius: 18px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        width: 350px;
        text-align: center;
    }

    h3 {
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
    }

    label {
        text-align: left;
        display: block;
        margin-top: 1rem;
        color: #475569;
        font-weight: 600;
        font-size: 0.95rem;
    }

    input {
        width: 100%;
        padding: 0.65rem;
        font-size: 1rem;
        border: 2px solid #cbd5e1;
        border-radius: 12px;
        margin-top: 0.3rem;
    }

    input:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 5px #4f46e5aa;
    }

    .btn-submit {
        background: #4f46e5;
        color: white;
        padding: 0.7rem;
        width: 100%;
        font-weight: 600;
        margin-top: 1.5rem;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        cursor: pointer;
    }

    .btn-submit:hover {
        background: #4338ca;
    }

    .validation-message {
        color: #ef4444;
        font-weight: 600;
        font-size: 0.85rem;
        text-align: left;
    }
    /* Logo styling */
.navbar-logo {
  height: 50px;
  width: auto;
  transition: all 0.3s ease;
  border-radius: 8px;
  
}

.navbar-logo:hover {
  transform: scale(1.05);
}
.brand-text {
  font-weight: 800;
  font-size: 1.5rem;
  color: #fff !important;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-style: italic;
  user-select: none;
  transition: color 0.3s ease;
}

.navbar-brand:hover .brand-text {
  color: #d1c4ff !important;
  text-shadow: 0 3px 12px rgba(255, 255, 255, 0.7);
}

</style>