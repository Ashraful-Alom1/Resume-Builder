# 📄 ResumeForge — Professional Resume Builder

A full-featured Resume Builder web application built with **Spring Boot 3.2**, **Thymeleaf**, and **Bootstrap 5.3**. Create stunning professional resumes with live preview, multiple templates, PDF export, and JSON save/load.

![Java](https://img.shields.io/badge/Java-17-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?logo=springboot)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **📝 Intuitive Form Builder** — Sections for personal info, work experience, education, and skills
- **👁️ Live Preview** — Real-time resume preview that updates as you type
- **🎨 3 Professional Templates**
  - **Modern** — Two-column layout with dark sidebar and skill bars
  - **Classic** — Traditional single-column with serif fonts
  - **Creative** — Bold gradient header with timeline layout
- **📄 PDF Export** — Download your resume as a professional PDF
- **💾 JSON Save/Load** — Save your resume data and load it later
- **📱 Responsive Design** — Works on desktop, tablet, and mobile
- **🌙 Dark Theme UI** — Modern glassmorphism design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2 (Java 17) |
| Template Engine | Thymeleaf |
| Frontend | Bootstrap 5.3, Vanilla JS |
| PDF Generation | OpenHTMLtoPDF |
| Build Tool | Apache Maven |

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+

### Run Locally
```bash
git clone https://github.com/Ashraful-Alom1/Resume-Builder.git
cd Resume-Builder
mvn spring-boot:run
```

Open your browser at **http://localhost:8080**

### Build JAR
```bash
mvn clean package -DskipTests
java -jar target/resume-builder-1.0.0.jar
```

## 🌐 Online Deployment

This project is pre-configured for easy online deployment.

### Deploy to Render (Recommended)
1. Commit your changes and push them to your GitHub repository.
2. Sign in to [Render](https://render.com/).
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` configuration, build the Docker container, and deploy the service online.

### Deploy to Railway
1. Sign in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Choose your repository.
4. Railway will automatically detect the `Dockerfile` and deploy the application. It will automatically bind the dynamic port using the `${PORT}` variable configured in `application.properties`.

## 📸 Screenshots

### Modern Template
Two-column layout with dark sidebar, contact info, and visual skill bars.

### Classic Template  
Traditional single-column format with serif typography and formal dividers.

### Creative Template
Bold gradient header with timeline-style experience and skill chips.

## 📁 Project Structure

```
resume-builder/
├── pom.xml
├── src/main/
│   ├── java/com/resumebuilder/
│   │   ├── ResumeBuilderApplication.java
│   │   ├── controller/ResumeController.java
│   │   ├── model/ (Resume, PersonalInfo, WorkExperience, Education, Skill)
│   │   └── service/PdfService.java
│   └── resources/
│       ├── application.properties
│       ├── templates/
│       │   ├── index.html
│       │   ├── templates/ (modern, classic, creative)
│       │   └── pdf/ (PDF-specific templates)
│       └── static/
│           ├── css/style.css
│           └── js/app.js
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by [Ashraful Alom](https://github.com/Ashraful-Alom1)
