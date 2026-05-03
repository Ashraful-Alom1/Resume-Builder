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

### Live Demo
🚀 **[View Live Demo](https://resume-builder-alom.onrender.com)**  
*(If the link is not active yet, please deploy via the button below)*

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ashraful-Alom1/Resume-Builder)

### Build JAR
```bash
mvn clean package -DskipTests
java -jar target/resume-builder-1.0.0.jar
```

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
