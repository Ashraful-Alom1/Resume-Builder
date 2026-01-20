document.addEventListener('DOMContentLoaded', function() {
    // Initialize ATS score
    let atsScore = 0;
    const keywords = new Set();
    const skills = new Set(['Leadership', 'Communication']);
    
    // DOM Elements
    const atsScoreElement = document.getElementById('atsScore');
    const atsProgressElement = document.getElementById('atsProgress');
    const skillsContainer = document.getElementById('skillsContainer');
    const keywordsContainer = document.getElementById('keywordsContainer');
    const skillInput = document.getElementById('skillInput');
    const keywordInput = document.getElementById('keywordInput');
    const generateLatexBtn = document.getElementById('generateLatex');
    const downloadLatexBtn = document.getElementById('downloadLatex');
    const copyToClipboardBtn = document.getElementById('copyToClipboard');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const latexCodeElement = document.getElementById('latexCode');
    const resumePreview = document.getElementById('resumePreview');
    
    // Initialize
    updateAtsScore();
    renderSkills();
    renderKeywords();
    
    // Event Listeners for real-time updates
    document.querySelectorAll('#resumeForm input, #resumeForm textarea').forEach(element => {
        element.addEventListener('input', updateAtsScore);
    });
    
    // Add Experience Entry
    document.getElementById('addExperience').addEventListener('click', function() {
        const container = document.getElementById('experienceContainer');
        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry border p-3 mb-3';
        newEntry.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Job Title*" required>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Company*" required>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Start Date (MM/YYYY)*" required>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="End Date (MM/YYYY) or Present">
                </div>
                <div class="col-12">
                    <textarea class="form-control" rows="3" 
                              placeholder="Responsibilities and achievements. Use bullet points and action verbs. Each point on a new line."></textarea>
                </div>
                <div class="col-12 text-end">
                    <button type="button" class="btn btn-danger btn-sm remove-experience">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        container.appendChild(newEntry);
        
        // Add event listener to remove button
        newEntry.querySelector('.remove-experience').addEventListener('click', function() {
            newEntry.remove();
            updateAtsScore();
        });
        
        // Add event listeners to new inputs
        newEntry.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', updateAtsScore);
        });
        
        updateAtsScore();
    });
    
    // Skills Management
    skillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = skillInput.value.trim();
            if (skill && skill.length > 0) {
                skills.add(skill);
                renderSkills();
                skillInput.value = '';
                updateAtsScore();
            }
        }
    });
    
    // Keywords Management
    keywordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const keyword = keywordInput.value.trim();
            if (keyword && keyword.length > 0) {
                keywords.add(keyword);
                renderKeywords();
                keywordInput.value = '';
                updateAtsScore();
            }
        }
    });
    
    // Generate LaTeX Code
    generateLatexBtn.addEventListener('click', function() {
        const latexCode = generateLatexCode();
        latexCodeElement.textContent = latexCode;
        
        // Update preview
        updateResumePreview();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('latexModal'));
        modal.show();
    });
    
    // Download LaTeX File
    downloadLatexBtn.addEventListener('click', function() {
        const latexCode = generateLatexCode();
        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Copy to Clipboard
    copyToClipboardBtn.addEventListener('click', function() {
        const latexCode = generateLatexCode();
        navigator.clipboard.writeText(latexCode).then(() => {
            alert('LaTeX code copied to clipboard!');
        });
    });
    
    copyCodeBtn.addEventListener('click', function() {
        const code = latexCodeElement.textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copied to clipboard!');
        });
    });
    
    // Functions
    function renderSkills() {
        skillsContainer.innerHTML = '';
        skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.textContent = skill;
            tag.innerHTML += ' <i class="fas fa-times ms-1" style="cursor:pointer; font-size:0.8rem;"></i>';
            tag.querySelector('i').addEventListener('click', function() {
                skills.delete(skill);
                renderSkills();
                updateAtsScore();
            });
            skillsContainer.appendChild(tag);
        });
    }
    
    function renderKeywords() {
        keywordsContainer.innerHTML = '';
        keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.style.backgroundColor = '#fff3cd';
            tag.textContent = keyword;
            tag.innerHTML += ' <i class="fas fa-times ms-1" style="cursor:pointer; font-size:0.8rem;"></i>';
            tag.querySelector('i').addEventListener('click', function() {
                keywords.delete(keyword);
                renderKeywords();
                updateAtsScore();
            });
            keywordsContainer.appendChild(tag);
        });
    }
    
    function updateAtsScore() {
        let score = 0;
        
        // Check required fields (30 points)
        const requiredFields = ['fullName', 'jobTitle', 'email', 'degree', 'university'];
        requiredFields.forEach(field => {
            if (document.getElementById(field)?.value.trim()) score += 6;
        });
        
        // Check experience entries (20 points)
        const experienceEntries = document.querySelectorAll('.experience-entry');
        if (experienceEntries.length > 0) {
            let expScore = 0;
            experienceEntries.forEach(entry => {
                const inputs = entry.querySelectorAll('input[required]');
                let filled = 0;
                inputs.forEach(input => {
                    if (input.value.trim()) filled++;
                });
                expScore += (filled / inputs.length) * 5;
            });
            score += Math.min(expScore, 20);
        }
        
        // Check skills (15 points)
        score += Math.min(skills.size * 1.5, 15);
        
        // Check summary length (10 points)
        const summary = document.getElementById('summary').value;
        if (summary.length > 100) score += 10;
        else if (summary.length > 50) score += 5;
        
        // Check keywords (15 points)
        score += Math.min(keywords.size * 3, 15);
        
        // Check for action verbs in experience (10 points)
        const actionVerbs = ['managed', 'led', 'developed', 'implemented', 'created', 
                           'improved', 'increased', 'reduced', 'achieved', 'coordinated'];
        let verbCount = 0;
        document.querySelectorAll('.experience-entry textarea').forEach(textarea => {
            const text = textarea.value.toLowerCase();
            actionVerbs.forEach(verb => {
                if (text.includes(verb)) verbCount++;
            });
        });
        score += Math.min(verbCount * 2, 10);
        
        // Update UI
        atsScore = Math.min(Math.round(score), 100);
        atsScoreElement.textContent = atsScore;
        atsProgressElement.style.width = `${atsScore}%`;
        
        // Update color based on score
        atsScoreElement.className = 'ats-score ';
        if (atsScore >= 80) {
            atsScoreElement.className += 'score-excellent';
            atsProgressElement.className = 'progress-bar bg-success';
        } else if (atsScore >= 60) {
            atsScoreElement.className += 'score-good';
            atsProgressElement.className = 'progress-bar bg-warning';
        } else {
            atsScoreElement.className += 'score-poor';
            atsProgressElement.className = 'progress-bar bg-danger';
        }
        
        // Update preview
        updateResumePreview();
    }
    
    function updateResumePreview() {
        const name = document.getElementById('fullName').value || 'John Doe';
        const title = document.getElementById('jobTitle').value || 'Software Developer';
        const email = document.getElementById('email').value || 'john@example.com';
        const phone = document.getElementById('phone').value || '(123) 456-7890';
        const location = document.getElementById('location').value || 'San Francisco, CA';
        const summary = document.getElementById('summary').value || 'Professional summary goes here...';
        const degree = document.getElementById('degree').value || 'Bachelor of Science';
        const university = document.getElementById('university').value || 'University Name';
        
        let experienceHTML = '';
        document.querySelectorAll('.experience-entry').forEach((entry, index) => {
            const jobTitle = entry.querySelector('input[placeholder*="Job Title"]').value || 'Job Title';
            const company = entry.querySelector('input[placeholder*="Company"]').value || 'Company Name';
            const startDate = entry.querySelector('input[placeholder*="Start Date"]').value || '01/2020';
            const endDate = entry.querySelector('input[placeholder*="End Date"]').value || 'Present';
            const description = entry.querySelector('textarea').value || 'Responsibilities description';
            
            experienceHTML += `
                <div class="mb-3">
                    <h5>${jobTitle}</h5>
                    <h6>${company} | ${startDate} - ${endDate}</h6>
                    <p>${description.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        });
        
        let skillsHTML = Array.from(skills).map(skill => 
            `<span class="badge bg-primary me-1">${skill}</span>`
        ).join('');
        
        let keywordsHTML = Array.from(keywords).map(keyword => 
            `<span class="badge bg-warning text-dark me-1">${keyword}</span>`
        ).join('');
        
        resumePreview.innerHTML = `
            <div class="text-center mb-4 border-bottom pb-3">
                <h1 class="display-4">${name}</h1>
                <h3 class="text-muted">${title}</h3>
                <div class="mt-2">
                    <span class="me-3"><i class="fas fa-envelope"></i> ${email}</span>
                    <span class="me-3"><i class="fas fa-phone"></i> ${phone}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="border-bottom pb-2"><i class="fas fa-user me-2"></i>Professional Summary</h4>
                <p>${summary}</p>
            </div>
            
            ${experienceHTML ? `
            <div class="mb-4">
                <h4 class="border-bottom pb-2"><i class="fas fa-briefcase me-2"></i>Work Experience</h4>
                ${experienceHTML}
            </div>` : ''}
            
            <div class="mb-4">
                <h4 class="border-bottom pb-2"><i class="fas fa-graduation-cap me-2"></i>Education</h4>
                <h5>${degree}</h5>
                <p>${university}</p>
            </div>
            
            <div class="mb-4">
                <h4 class="border-bottom pb-2"><i class="fas fa-code me-2"></i>Skills</h4>
                <p>${skillsHTML}</p>
            </div>
            
            ${keywords.size > 0 ? `
            <div class="mb-4">
                <h4 class="border-bottom pb-2"><i class="fas fa-key me-2"></i>Keywords</h4>
                <p>${keywordsHTML}</p>
            </div>` : ''}
            
            <div class="mt-4 pt-3 border-top text-center">
                <small class="text-muted">ATS Score: ${atsScore}/100 | Generated with ATS-Optimized Resume Builder</small>
            </div>
        `;
    }
    
    function generateLatexCode() {
        // Gather all data
        const name = document.getElementById('fullName').value || 'John Doe';
        const title = document.getElementById('jobTitle').value || 'Software Developer';
        const email = document.getElementById('email').value || 'john@example.com';
        const phone = document.getElementById('phone').value || '(123) 456-7890';
        const location = document.getElementById('location').value || 'San Francisco, CA';
        const linkedin = document.getElementById('linkedin').value || '';
        const github = document.getElementById('github').value || '';
        const summary = document.getElementById('summary').value || 'Professional summary goes here...';
        const degree = document.getElementById('degree').value || 'Bachelor of Science';
        const university = document.getElementById('university').value || 'University Name';
        const gradYear = document.getElementById('gradYear').value || '';
        const gpa = document.getElementById('gpa').value || '';
        
        // Collect experience
        let experienceLatex = '';
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const jobTitle = entry.querySelector('input[placeholder*="Job Title"]').value || 'Job Title';
            const company = entry.querySelector('input[placeholder*="Company"]').value || 'Company Name';
            const startDate = entry.querySelector('input[placeholder*="Start Date"]').value || '01/2020';
            const endDate = entry.querySelector('input[placeholder*="End Date"]').value || 'Present';
            const description = entry.querySelector('textarea').value || 'Responsibilities description';
            
            const bullets = description.split('\n')
                .filter(line => line.trim())
                .map(line => `  \\item ${line.trim()}`)
                .join('\n');
            
            experienceLatex += `
\\section{${jobTitle}}
\\textbf{${company}} \\hfill ${startDate} -- ${endDate}
\\begin{itemize}
${bullets}
\\end{itemize}
`;
        });
        
        // Prepare skills list
        const skillsList = Array.from(skills).join(', ');
        const keywordsList = Array.from(keywords).join(', ');
        
        // Generate LaTeX code
        return `% ATS-Optimized Resume
% Generated with ATS Score: ${atsScore}/100
% Compatible with Overleaf

\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\setlist{noitemsep, topsep=0pt}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{${name}}}\\\\
    \\vspace{5pt}
    {\\Large ${title}}\\\\
    \\vspace{10pt}
    \\faEnvelope\\ ${email} \\quad
    \\faPhone\\ ${phone} \\quad
    \\faMapMarker\\ ${location}\\\\
    ${linkedin ? `\\faLinkedin\\ \\href{${linkedin}}{LinkedIn} \\quad` : ''}
    ${github ? `\\faGithub\\ \\href{${github}}{GitHub}` : ''}
\\end{center}

\\section*{Professional Summary}
${summary}

\\section*{Work Experience}
${experienceLatex}

\\section*{Education}
\\textbf{${degree}}\\\\
${university}${gradYear ? ` \\hfill ${gradYear}` : ''}\\\\
${gpa ? `GPA: ${gpa}` : ''}

\\section*{Skills}
${skillsList}

\\section*{Keywords}
${keywordsList}

\\vfill
\\begin{center}
    \\footnotesize Generated with ATS-Optimized Resume Builder | ATS Score: ${atsScore}/100
\\end{center}

\\end{document}`;
    }
    
    // Initial preview
    updateResumePreview();
});