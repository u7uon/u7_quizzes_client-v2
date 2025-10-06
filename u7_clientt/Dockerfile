# ============================
# Stage 1: Build app
# ============================
FROM node:22-alpine AS build

# Cài thêm bash và tool cần thiết (tùy chọn, cho dev/debug)
RUN apk add --no-cache bash

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json trước để tối ưu cache
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build app (vite sẽ build ra thư mục dist/)
RUN npm run build


# ============================
# Stage 2: Serve app
# ============================
FROM node:16-alpine AS production

WORKDIR /usr/src/app

# Cài công cụ serve (nhẹ, dùng cho frontend SPA)
RUN npm install -g serve

# Copy kết quả build từ stage 1
COPY --from=build /usr/src/app/dist ./dist

# Mở port 3000
EXPOSE 3000

# Dùng serve để chạy app
CMD ["serve", "-s", "dist", "-l", "3000"]
