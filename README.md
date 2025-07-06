# 📖 StoryHub Story Image Generator

Turn your words into vivid, AI-generated art.

StoryHub Story Image Generator is a full-stack application that takes in story text and returns a beautifully rendered image using AI OpenAI DALL·E API.

## ✨ Features

- 🖼️ Transforms story scenes into high-quality images
- ⚙️ Custom prompt injection for consistent visual style
- 🔄 Regenerate button for new image variations
- 💡 Real-time feedback with loading states and error handling
- 📱 Responsive UI styled with Tailwind CSS and custom CSS modules

## 🚀 Tech Stack

- **Next.js 14**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Prisma**
- **MySQL**
- **API routes** for AI image generation

## 🧠 How It Works

1. User enters story text.
2. App sends a POST request to `/api/generateImage` with the prompt and dimensions.
3. OpenAI DALL·E API responds with a generated image URL.
4. Page is stored in MySQL
5. Image is displayed alongside the story text with a smooth loading experience.
6. Users can regenerate to get a different image for the same text.


Login Page
<img width="1452" alt="image" src="https://github.com/user-attachments/assets/085c47d1-8c7a-4507-b9dd-f9980c1e4bee" />

Register Page
<img width="1447" alt="image" src="https://github.com/user-attachments/assets/5e662fa7-500a-4d11-ae39-52a3b519cdd2" />

Dashboard
<img width="1453" alt="image" src="https://github.com/user-attachments/assets/7cb147b6-5146-4f82-97bb-371c1cd1817b" />

Create Story Page
<img width="1448" alt="image" src="https://github.com/user-attachments/assets/05167ee8-3f71-4db2-b4e3-f0acfea13877" />

Creating an Image
<img width="1451" alt="image" src="https://github.com/user-attachments/assets/5dc9f144-b9f9-4292-b289-2b938c372555" />
