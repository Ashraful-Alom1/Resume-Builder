const fs = require('fs');
const path = require('path');

const styles = {
    'minimalist': {
        font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: '#333',
        accent: '#666',
        header_align: 'left',
        name_size: '24px',
        border: 'none',
        web_bg: '#fff'
    },
    'professional': {
        font: "'Roboto', 'Segoe UI', sans-serif",
        color: '#2c3e50',
        accent: '#34495e',
        header_align: 'center',
        name_size: '26px',
        border: '2px solid #2c3e50',
        web_bg: '#fff'
    },
    'executive': {
        font: "Garamond, 'Times New Roman', serif",
        color: '#222',
        accent: '#8a795d', // Bronze/Gold
        header_align: 'center',
        name_size: '28px',
        border: '1px solid #8a795d',
        web_bg: '#fff'
    },
    'tech': {
        font: "'Segoe UI', Consolas, monospace, sans-serif",
        color: '#111',
        accent: '#0984e3',
        header_align: 'left',
        name_size: '22px',
        border: '1px solid #0984e3',
        web_bg: '#fdfdfd'
    },
    'elegant': {
        font: "Georgia, serif",
        color: '#333',
        accent: '#7f8c8d',
        header_align: 'center',
        name_size: '26px',
        border: '1px solid #bdc3c7',
        web_bg: '#fafafa'
    },
    'startup': {
        font: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
        color: '#2d3436',
        accent: '#6c5ce7',
        header_align: 'left',
        name_size: '26px',
        border: '2px solid #6c5ce7',
        web_bg: '#fff'
    },
    'academic': {
        font: "'Times New Roman', Times, serif",
        color: '#000',
        accent: '#000',
        header_align: 'center',
        name_size: '20px',
        border: '1px solid #000',
        web_bg: '#fff'
    }
};

const webBase = (name, font, color, accent, headerAlign, nameSize, border, webBg) => `<!-- ${name} Template -->
<div class="resume-${name}" xmlns:th="http://www.thymeleaf.org">
    <style>
        .resume-${name} { font-family: ${font}; padding: 32px; color: ${color}; line-height: 1.5; min-height: 900px; font-size: 13px; background: ${webBg}; }
        .resume-${name} .r-header { text-align: ${headerAlign}; margin-bottom: 12px; }
        .resume-${name} .r-name { font-size: ${nameSize}; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; color: ${color}; }
        .resume-${name} .r-contact { font-size: 11.5px; color: ${accent}; display: flex; justify-content: ${headerAlign === 'center' ? 'center' : 'flex-start'}; flex-wrap: wrap; gap: 12px; }
        .resume-${name} .r-contact span { display: inline-flex; align-items: center; gap: 4px; }
        .resume-${name} .r-section { margin-bottom: 12px; }
        .resume-${name} .r-section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: ${border}; padding-bottom: 4px; margin-bottom: 8px; margin-top: 10px; color: ${accent}; }
        .resume-${name} .r-row { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
        .resume-${name} .r-inst { font-size: 13px; font-weight: bold; }
        .resume-${name} .r-date { font-size: 11.5px; color: ${accent}; text-align: right; }
        .resume-${name} .r-degree { font-size: 12px; font-style: italic; color: ${color}; }
        .resume-${name} .r-loc { font-size: 11.5px; color: ${accent}; text-align: right; }
        .resume-${name} .r-coursework { display: flex; flex-wrap: wrap; gap: 0; padding-left: 16px; }
        .resume-${name} .r-coursework-col { width: 33.33%; font-size: 11.5px; padding: 2px 0; }
        .resume-${name} .r-coursework-col::before { content: '•'; margin-right: 6px; color: ${accent}; }
        .resume-${name} .r-skills-row { font-size: 12px; margin-bottom: 4px; line-height: 1.5; }
        .resume-${name} .r-skills-row strong { font-weight: bold; color: ${accent}; }
        .resume-${name} .r-proj-title { font-size: 13px; font-weight: bold; }
        .resume-${name} .r-proj-tech { font-size: 11.5px; color: ${accent}; }
        .resume-${name} .r-bullet-list { margin: 4px 0 8px 16px; padding-left: 8px; }
        .resume-${name} .r-bullet-list li { font-size: 11.5px; margin-bottom: 3px; list-style-type: disc; color: ${color}; }
        .resume-${name} .r-exp-title { font-size: 13px; font-weight: bold; }
        .resume-${name} .link-icon { font-size: 10px; color: ${accent}; text-decoration: none; margin-left: 4px; }
        .resume-${name} .r-item { margin-bottom: 10px; }
        .resume-${name} .r-cert-list, .resume-${name} .r-addinfo-list { padding-left: 24px; margin: 4px 0 0; }
        .resume-${name} .r-cert-list li, .resume-${name} .r-addinfo-list li { font-size: 11.5px; margin-bottom: 2px; list-style-type: disc; }
    </style>

    <!-- HEADER -->
    <div class="r-header">
        <div class="r-name" th:text="\${resume.personalInfo.fullName} ?: 'Your Name'">Your Name</div>
        <div class="r-contact">
            <span th:if="\${resume.personalInfo.phone != ''}">&#9742; <span th:text="\${resume.personalInfo.phone}"></span></span>
            <span th:if="\${resume.personalInfo.email != ''}">&#9993; <span th:text="\${resume.personalInfo.email}"></span></span>
            <span th:if="\${resume.personalInfo.linkedIn != ''}">&#128279; <span th:text="\${resume.personalInfo.linkedIn}"></span></span>
            <span th:if="\${resume.personalInfo.website != ''}">&#127760; <span th:text="\${resume.personalInfo.website}"></span></span>
        </div>
    </div>

    <!-- EDUCATION -->
    <div class="r-section" th:if="\${resume.educations != null and !resume.educations.isEmpty()}">
        <div class="r-section-title">Education</div>
        <div class="r-item" th:each="edu : \${resume.educations}">
            <div class="r-row">
                <span class="r-inst" th:text="\${edu.institution}"></span>
                <span class="r-date" th:text="'Expected ' + \${edu.startDate} + ' – ' + \${edu.endDate}"></span>
            </div>
            <div class="r-row">
                <span class="r-degree" th:text="\${edu.degree + (edu.fieldOfStudy != '' ? ' - ' + edu.fieldOfStudy : '')}"></span>
                <span class="r-loc" th:if="\${edu.gpa != ''}" th:text="\${edu.gpa}"></span>
            </div>
        </div>
    </div>

    <!-- RELEVANT COURSEWORK -->
    <div class="r-section" th:if="\${resume.relevantCoursework != null and resume.relevantCoursework != ''}">
        <div class="r-section-title">Relevant Coursework</div>
        <div class="r-coursework">
            <span class="r-coursework-col" th:each="course : \${resume.relevantCoursework.split(',')}" th:text="\${course.trim()}"></span>
        </div>
    </div>

    <!-- TECHNICAL SKILLS -->
    <div class="r-section" th:if="\${resume.technicalSkills != null}">
        <div class="r-section-title">Technical Skills</div>
        <div th:with="ts=\${resume.technicalSkills}">
            <div class="r-skills-row" th:if="\${ts.programmingLanguages != ''}"><strong>Programming Languages:</strong> <span th:text="\${ts.programmingLanguages}"></span></div>
            <div class="r-skills-row" th:if="\${ts.frameworksLibraries != ''}"><strong>Frameworks/Libraries:</strong> <span th:text="\${ts.frameworksLibraries}"></span></div>
            <div class="r-skills-row" th:if="\${ts.databases != ''}"><strong>Databases:</strong> <span th:text="\${ts.databases}"></span></div>
            <div class="r-skills-row" th:if="\${ts.cloudDevOps != ''}"><strong>Cloud/DevOps:</strong> <span th:text="\${ts.cloudDevOps}"></span></div>
            <div class="r-skills-row" th:if="\${ts.tools != ''}"><strong>Tools:</strong> <span th:text="\${ts.tools}"></span></div>
            <div class="r-skills-row" th:if="\${ts.concepts != ''}"><strong>Concepts:</strong> <span th:text="\${ts.concepts}"></span></div>
        </div>
    </div>

    <!-- PROJECTS -->
    <div class="r-section" th:if="\${resume.projects != null and !resume.projects.isEmpty()}">
        <div class="r-section-title">Projects</div>
        <div class="r-item" th:each="proj : \${resume.projects}">
            <div class="r-row">
                <div>
                    <span class="r-proj-title" th:text="\${proj.name}"></span>
                    <span class="link-icon" th:if="\${proj.link != ''}">&#8599;</span>
                    <span class="r-proj-tech" th:if="\${proj.techStack != ''}" th:text="' | ' + \${proj.techStack}"></span>
                </div>
                <span class="r-date" th:text="\${proj.year}"></span>
            </div>
            <ul class="r-bullet-list" th:if="\${proj.description != ''}">
                <li th:each="line : \${proj.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- EXPERIENCE -->
    <div class="r-section" th:if="\${resume.workExperiences != null and !resume.workExperiences.isEmpty()}">
        <div class="r-section-title">Experience</div>
        <div class="r-item" th:each="exp : \${resume.workExperiences}">
            <div class="r-row">
                <span class="r-exp-title" th:text="\${exp.position + (exp.company != '' ? ' | ' + exp.company : '')}"></span>
                <span class="r-date"><span th:text="\${exp.startDate}"></span> — <span th:text="\${exp.current ? 'Present' : exp.endDate}"></span></span>
            </div>
            <ul class="r-bullet-list" th:if="\${exp.description != ''}">
                <li th:each="line : \${exp.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- ACHIEVEMENTS -->
    <div class="r-section" th:if="\${resume.achievements != null and !resume.achievements.isEmpty()}">
        <div class="r-section-title">Achievement</div>
        <div class="r-item" th:each="ach : \${resume.achievements}">
            <div class="r-row">
                <div><span class="r-exp-title" th:text="\${ach.title}"></span><span class="link-icon" th:if="\${ach.link != ''}"> &#8599;</span></div>
                <span class="r-date" th:text="\${ach.date}"></span>
            </div>
            <div class="r-row" th:if="\${ach.role != '' or ach.location != ''}">
                <span class="r-degree" th:text="\${ach.role}"></span>
                <span class="r-loc" th:text="\${ach.location}"></span>
            </div>
            <ul class="r-bullet-list" th:if="\${ach.description != ''}">
                <li th:each="line : \${ach.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- CERTIFICATIONS -->
    <div class="r-section" th:if="\${resume.certifications != null and !resume.certifications.isEmpty()}">
        <div class="r-section-title">Certifications</div>
        <ul class="r-cert-list">
            <li th:each="cert : \${resume.certifications}" th:if="\${!cert.isBlank()}" th:text="\${cert}"></li>
        </ul>
    </div>

    <!-- ADDITIONAL INFORMATION -->
    <div class="r-section" th:if="\${resume.additionalInfo != null and !resume.additionalInfo.isEmpty()}">
        <div class="r-section-title">Additional Information</div>
        <ul class="r-addinfo-list">
            <li th:each="info : \${resume.additionalInfo}" th:if="\${!info.isBlank()}" th:text="\${info}"></li>
        </ul>
    </div>
</div>`;

const pdfBase = (name, font, color, accent, headerAlign, nameSize, border) => `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="en">
<head><meta charset="UTF-8"/><title>Resume</title>
<style>
    @page { size: A4; margin: 15mm 18mm; }
    body { font-family: ${font}; margin: 0; padding: 0; color: ${color}; line-height: 1.5; font-size: 11px; }
    .r-header { text-align: ${headerAlign}; margin-bottom: 10px; }
    .r-name { font-size: ${parseInt(nameSize)-4}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; color: ${color}; }
    .r-contact { font-size: 10px; color: ${accent}; text-align: ${headerAlign}; margin-bottom: 10px; }
    .r-contact span { display: inline-block; margin: 0 6px; }
    .r-section { margin-bottom: 10px; }
    .r-section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: ${border}; padding-bottom: 2px; margin-bottom: 6px; margin-top: 8px; color: ${accent}; }
    .r-inst { font-size: 11px; font-weight: bold; float: left; }
    .r-date { font-size: 10.5px; color: ${accent}; float: right; text-align: right; }
    .r-degree { font-size: 11px; font-style: italic; color: ${color}; float: left; }
    .r-loc { font-size: 10.5px; color: ${accent}; float: right; text-align: right; }
    .clear { clear: both; }
    .r-coursework { margin: 0; padding: 0; }
    .r-coursework-col { display: inline-block; width: 32%; font-size: 10.5px; margin-bottom: 2px; }
    .r-coursework-col::before { content: '• '; margin-right: 2px; color: ${accent}; }
    .r-skills-row { font-size: 11px; margin-bottom: 2px; line-height: 1.5; }
    .r-skills-row strong { font-weight: bold; color: ${accent}; }
    .r-proj-title { font-size: 11px; font-weight: bold; float: left; }
    .r-proj-tech { font-size: 10.5px; color: ${accent}; }
    .r-bullet-list { margin: 2px 0 6px 16px; padding-left: 0; }
    .r-bullet-list li { font-size: 10.5px; margin-bottom: 2px; line-height: 1.4; list-style-type: disc; color: ${color}; }
    .r-exp-title { font-size: 11px; font-weight: bold; float: left; }
    .r-item { margin-bottom: 8px; }
    .r-cert-list, .r-addinfo-list { padding-left: 16px; margin: 2px 0 0; }
    .r-cert-list li, .r-addinfo-list li { font-size: 10.5px; margin-bottom: 1px; list-style-type: disc; }
</style></head>
<body>
    <!-- HEADER -->
    <div class="r-header">
        <div class="r-name" th:text="\${resume.personalInfo.fullName} ?: 'Your Name'">Your Name</div>
        <div class="r-contact">
            <span th:if="\${resume.personalInfo.phone != ''}">&#9742; <span th:text="\${resume.personalInfo.phone}"></span></span>
            <span th:if="\${resume.personalInfo.email != ''}">&#9993; <span th:text="\${resume.personalInfo.email}"></span></span>
            <span th:if="\${resume.personalInfo.linkedIn != ''}">&#128279; <span th:text="\${resume.personalInfo.linkedIn}"></span></span>
            <span th:if="\${resume.personalInfo.website != ''}">&#127760; <span th:text="\${resume.personalInfo.website}"></span></span>
        </div>
    </div>

    <!-- EDUCATION -->
    <div class="r-section" th:if="\${resume.educations != null and !resume.educations.isEmpty()}">
        <div class="r-section-title">Education</div>
        <div class="r-item" th:each="edu : \${resume.educations}">
            <div>
                <span class="r-inst" th:text="\${edu.institution}"></span>
                <span class="r-date" th:text="'Expected ' + \${edu.startDate} + ' – ' + \${edu.endDate}"></span>
                <div class="clear"></div>
            </div>
            <div>
                <span class="r-degree" th:text="\${edu.degree + (edu.fieldOfStudy != '' ? ' - ' + edu.fieldOfStudy : '')}"></span>
                <span class="r-loc" th:if="\${edu.gpa != ''}" th:text="\${edu.gpa}"></span>
                <div class="clear"></div>
            </div>
        </div>
    </div>

    <!-- RELEVANT COURSEWORK -->
    <div class="r-section" th:if="\${resume.relevantCoursework != null and resume.relevantCoursework != ''}">
        <div class="r-section-title">Relevant Coursework</div>
        <div class="r-coursework">
            <span class="r-coursework-col" th:each="course : \${resume.relevantCoursework.split(',')}" th:text="\${course.trim()}"></span>
            <div class="clear"></div>
        </div>
    </div>

    <!-- TECHNICAL SKILLS -->
    <div class="r-section" th:if="\${resume.technicalSkills != null}">
        <div class="r-section-title">Technical Skills</div>
        <div th:with="ts=\${resume.technicalSkills}">
            <div class="r-skills-row" th:if="\${ts.programmingLanguages != ''}"><strong>Programming Languages:</strong> <span th:text="\${ts.programmingLanguages}"></span></div>
            <div class="r-skills-row" th:if="\${ts.frameworksLibraries != ''}"><strong>Frameworks/Libraries:</strong> <span th:text="\${ts.frameworksLibraries}"></span></div>
            <div class="r-skills-row" th:if="\${ts.databases != ''}"><strong>Databases:</strong> <span th:text="\${ts.databases}"></span></div>
            <div class="r-skills-row" th:if="\${ts.cloudDevOps != ''}"><strong>Cloud/DevOps:</strong> <span th:text="\${ts.cloudDevOps}"></span></div>
            <div class="r-skills-row" th:if="\${ts.tools != ''}"><strong>Tools:</strong> <span th:text="\${ts.tools}"></span></div>
            <div class="r-skills-row" th:if="\${ts.concepts != ''}"><strong>Concepts:</strong> <span th:text="\${ts.concepts}"></span></div>
        </div>
    </div>

    <!-- PROJECTS -->
    <div class="r-section" th:if="\${resume.projects != null and !resume.projects.isEmpty()}">
        <div class="r-section-title">Projects</div>
        <div class="r-item" th:each="proj : \${resume.projects}">
            <div>
                <span class="r-proj-title"><span th:text="\${proj.name}"></span> <span class="r-proj-tech" th:if="\${proj.techStack != ''}" th:text="' | ' + \${proj.techStack}"></span></span>
                <span class="r-date" th:text="\${proj.year}"></span>
                <div class="clear"></div>
            </div>
            <ul class="r-bullet-list" th:if="\${proj.description != ''}">
                <li th:each="line : \${proj.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- EXPERIENCE -->
    <div class="r-section" th:if="\${resume.workExperiences != null and !resume.workExperiences.isEmpty()}">
        <div class="r-section-title">Experience</div>
        <div class="r-item" th:each="exp : \${resume.workExperiences}">
            <div>
                <span class="r-exp-title" th:text="\${exp.position + (exp.company != '' ? ' | ' + exp.company : '')}"></span>
                <span class="r-date"><span th:text="\${exp.startDate}"></span> — <span th:text="\${exp.current ? 'Present' : exp.endDate}"></span></span>
                <div class="clear"></div>
            </div>
            <ul class="r-bullet-list" th:if="\${exp.description != ''}">
                <li th:each="line : \${exp.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- ACHIEVEMENTS -->
    <div class="r-section" th:if="\${resume.achievements != null and !resume.achievements.isEmpty()}">
        <div class="r-section-title">Achievement</div>
        <div class="r-item" th:each="ach : \${resume.achievements}">
            <div>
                <span class="r-exp-title" th:text="\${ach.title}"></span>
                <span class="r-date" th:text="\${ach.date}"></span>
                <div class="clear"></div>
            </div>
            <div th:if="\${ach.role != '' or ach.location != ''}">
                <span class="r-degree" th:text="\${ach.role}"></span>
                <span class="r-loc" th:text="\${ach.location}"></span>
                <div class="clear"></div>
            </div>
            <ul class="r-bullet-list" th:if="\${ach.description != ''}">
                <li th:each="line : \${ach.description.split('\\n')}" th:if="\${!line.isBlank()}" th:text="\${line.trim()}"></li>
            </ul>
        </div>
    </div>

    <!-- CERTIFICATIONS -->
    <div class="r-section" th:if="\${resume.certifications != null and !resume.certifications.isEmpty()}">
        <div class="r-section-title">Certifications</div>
        <ul class="r-cert-list">
            <li th:each="cert : \${resume.certifications}" th:if="\${!cert.isBlank()}" th:text="\${cert}"></li>
        </ul>
    </div>

    <!-- ADDITIONAL INFORMATION -->
    <div class="r-section" th:if="\${resume.additionalInfo != null and !resume.additionalInfo.isEmpty()}">
        <div class="r-section-title">Additional Information</div>
        <ul class="r-addinfo-list">
            <li th:each="info : \${resume.additionalInfo}" th:if="\${!info.isBlank()}" th:text="\${info}"></li>
        </ul>
    </div>
</body></html>`;

const baseDir = path.join(__dirname, 'src', 'main', 'resources', 'templates');

for (const [name, conf] of Object.entries(styles)) {
    const web = webBase(name, conf.font, conf.color, conf.accent, conf.header_align, conf.name_size, conf.border, conf.web_bg);
    const pdf = pdfBase(name, conf.font, conf.color, conf.accent, conf.header_align, conf.name_size, conf.border);
    
    fs.writeFileSync(path.join(baseDir, 'templates', name + '.html'), web, 'utf8');
    fs.writeFileSync(path.join(baseDir, 'pdf', name + '.html'), pdf, 'utf8');
}
console.log("Done");
