/**
 * ResumeForge - Main Application JavaScript
 * Handles form management, live preview, PDF export, and JSON save/load
 */
(function () {
    'use strict';

    let selectedTemplate = 'modern';
    let previewTimeout = null;
    const DEBOUNCE_MS = 400;

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const previewContent = $('#previewContent');
    const workList = $('#workExperienceList');
    const eduList = $('#educationList');
    const skillsList = $('#skillsList');
    const projectsList = $('#projectsList');
    const achievementsList = $('#achievementsList');
    const certificationsList = $('#certificationsList');
    const additionalInfoList = $('#additionalInfoList');
    const loadingOverlay = $('#loadingOverlay');

    // ══════════════════════════════════════════
    //  COLLECT FORM DATA
    // ══════════════════════════════════════════
    function collectFormData() {
        const data = {
            personalInfo: {
                fullName: $('#fullName')?.value || '',
                jobTitle: $('#jobTitle')?.value || '',
                email: $('#email')?.value || '',
                phone: $('#phone')?.value || '',
                address: $('#address')?.value || '',
                summary: $('#summary')?.value || '',
                linkedIn: $('#linkedIn')?.value || '',
                website: $('#website')?.value || ''
            },
            workExperiences: [],
            educations: [],
            skills: [],
            technicalSkills: {
                programmingLanguages: $('#tsLangs')?.value || '',
                frameworksLibraries: $('#tsFrameworks')?.value || '',
                databases: $('#tsDatabases')?.value || '',
                cloudDevOps: $('#tsCloud')?.value || '',
                tools: $('#tsTools')?.value || '',
                concepts: $('#tsConcepts')?.value || ''
            },
            relevantCoursework: $('#relevantCoursework')?.value || '',
            projects: [],
            achievements: [],
            certifications: [],
            additionalInfo: [],
            selectedTemplate: selectedTemplate
        };

        workList.querySelectorAll('.item-card').forEach((card) => {
            data.workExperiences.push({
                company: card.querySelector('[data-field="company"]')?.value || '',
                position: card.querySelector('[data-field="position"]')?.value || '',
                startDate: card.querySelector('[data-field="startDate"]')?.value || '',
                endDate: card.querySelector('[data-field="endDate"]')?.value || '',
                description: card.querySelector('[data-field="description"]')?.value || '',
                current: card.querySelector('[data-field="current"]')?.checked || false
            });
        });

        eduList.querySelectorAll('.item-card').forEach((card) => {
            data.educations.push({
                institution: card.querySelector('[data-field="institution"]')?.value || '',
                degree: card.querySelector('[data-field="degree"]')?.value || '',
                fieldOfStudy: card.querySelector('[data-field="fieldOfStudy"]')?.value || '',
                startDate: card.querySelector('[data-field="startDate"]')?.value || '',
                endDate: card.querySelector('[data-field="endDate"]')?.value || '',
                gpa: card.querySelector('[data-field="gpa"]')?.value || ''
            });
        });

        skillsList.querySelectorAll('.skill-item').forEach((item) => {
            const name = item.querySelector('[data-field="skillName"]')?.value || '';
            const dots = item.querySelectorAll('.proficiency-dot.active');
            data.skills.push({ name, proficiency: dots.length || 3 });
        });

        projectsList.querySelectorAll('.item-card').forEach((card) => {
            data.projects.push({
                name: card.querySelector('[data-field="projName"]')?.value || '',
                techStack: card.querySelector('[data-field="techStack"]')?.value || '',
                year: card.querySelector('[data-field="year"]')?.value || '',
                link: card.querySelector('[data-field="link"]')?.value || '',
                description: card.querySelector('[data-field="projDesc"]')?.value || ''
            });
        });

        achievementsList.querySelectorAll('.item-card').forEach((card) => {
            data.achievements.push({
                title: card.querySelector('[data-field="achTitle"]')?.value || '',
                date: card.querySelector('[data-field="achDate"]')?.value || '',
                location: card.querySelector('[data-field="achLocation"]')?.value || '',
                role: card.querySelector('[data-field="achRole"]')?.value || '',
                link: card.querySelector('[data-field="achLink"]')?.value || '',
                description: card.querySelector('[data-field="achDesc"]')?.value || ''
            });
        });

        certificationsList.querySelectorAll('.simple-item').forEach((item) => {
            const v = item.querySelector('[data-field="certName"]')?.value || '';
            if (v.trim()) data.certifications.push(v.trim());
        });

        additionalInfoList.querySelectorAll('.simple-item').forEach((item) => {
            const v = item.querySelector('[data-field="addInfo"]')?.value || '';
            if (v.trim()) data.additionalInfo.push(v.trim());
        });

        return data;
    }

    // ══════════════════════════════════════════
    //  LIVE PREVIEW
    // ══════════════════════════════════════════
    function triggerPreview() {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => updatePreview(), DEBOUNCE_MS);
    }

    async function updatePreview() {
        const data = collectFormData();
        const hasContent = data.personalInfo.fullName || data.personalInfo.jobTitle ||
            data.workExperiences.length > 0 || data.educations.length > 0 ||
            data.skills.length > 0 || data.projects.length > 0 ||
            data.technicalSkills.programmingLanguages || data.relevantCoursework;

        if (!hasContent) {
            previewContent.innerHTML = '<div class="preview-placeholder"><i class="bi bi-file-earmark-plus"></i><p>Start filling in your details to see a live preview</p></div>';
            return;
        }
        try {
            const resp = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (resp.ok) previewContent.innerHTML = await resp.text();
        } catch (e) { console.error('Preview error:', e); }
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - WORK EXPERIENCE
    // ══════════════════════════════════════════
    let workCount = 0;
    function addWorkExperience(p) {
        workCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header"><span class="item-card-number">Experience #${workCount}</span><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="position" placeholder=" " value="${p?.position||''}"/><label>Position / Title</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="company" placeholder=" " value="${p?.company||''}"/><label>Company</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="startDate" placeholder=" " value="${p?.startDate||''}"/><label>Start Date</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="endDate" placeholder=" " value="${p?.endDate||''}"/><label>End Date</label></div></div>
                <div class="col-md-4"><div class="check-group" style="height:100%;display:flex;align-items:center;padding-top:8px"><input type="checkbox" data-field="current" id="current_${workCount}" ${p?.current?'checked':''}/><label for="current_${workCount}">Currently Working</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><textarea class="form-input form-textarea" data-field="description" placeholder=" " rows="3">${p?.description||''}</textarea><label>Description (one bullet per line)</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(workList, 'Experience'); triggerPreview(); });
        card.querySelectorAll('.form-input, input[type="checkbox"]').forEach(el => el.addEventListener('input', triggerPreview));
        workList.appendChild(card);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - EDUCATION
    // ══════════════════════════════════════════
    let eduCount = 0;
    function addEducation(p) {
        eduCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header"><span class="item-card-number">Education #${eduCount}</span><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="institution" placeholder=" " value="${p?.institution||''}"/><label>Institution</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="degree" placeholder=" " value="${p?.degree||''}"/><label>Degree</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="fieldOfStudy" placeholder=" " value="${p?.fieldOfStudy||''}"/><label>Field of Study</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="startDate" placeholder=" " value="${p?.startDate||''}"/><label>Start Year</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="endDate" placeholder=" " value="${p?.endDate||''}"/><label>End Year</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><input type="text" class="form-input" data-field="gpa" placeholder=" " value="${p?.gpa||''}"/><label>Location / GPA (optional)</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(eduList, 'Education'); triggerPreview(); });
        card.querySelectorAll('.form-input').forEach(el => el.addEventListener('input', triggerPreview));
        eduList.appendChild(card);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - SKILLS
    // ══════════════════════════════════════════
    function addSkill(p) {
        const item = document.createElement('div');
        item.className = 'skill-item';
        const prof = p?.proficiency || 3;
        let dotsHtml = '';
        for (let i = 1; i <= 5; i++) dotsHtml += `<div class="proficiency-dot ${i <= prof ? 'active' : ''}" data-level="${i}"></div>`;
        item.innerHTML = `<input type="text" class="form-input" data-field="skillName" placeholder="Skill name" value="${p?.name||''}"/><div class="proficiency-dots">${dotsHtml}</div><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>`;
        item.querySelector('.btn-remove-item').addEventListener('click', () => { item.remove(); triggerPreview(); });
        item.querySelector('.form-input').addEventListener('input', triggerPreview);
        item.querySelectorAll('.proficiency-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const level = parseInt(dot.dataset.level);
                item.querySelectorAll('.proficiency-dot').forEach((d, i) => d.classList.toggle('active', i < level));
                triggerPreview();
            });
        });
        skillsList.appendChild(item);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - PROJECTS
    // ══════════════════════════════════════════
    let projCount = 0;
    function addProject(p) {
        projCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header"><span class="item-card-number">Project #${projCount}</span><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="projName" placeholder=" " value="${p?.name||''}"/><label>Project Name</label></div></div>
                <div class="col-md-3"><div class="form-floating-custom"><input type="text" class="form-input" data-field="year" placeholder=" " value="${p?.year||''}"/><label>Year</label></div></div>
                <div class="col-md-3"><div class="form-floating-custom"><input type="text" class="form-input" data-field="link" placeholder=" " value="${p?.link||''}"/><label>Link</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><input type="text" class="form-input" data-field="techStack" placeholder=" " value="${p?.techStack||''}"/><label>Tech Stack (comma-separated)</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><textarea class="form-input form-textarea" data-field="projDesc" placeholder=" " rows="3">${p?.description||''}</textarea><label>Description (one bullet per line)</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(projectsList, 'Project'); triggerPreview(); });
        card.querySelectorAll('.form-input').forEach(el => el.addEventListener('input', triggerPreview));
        projectsList.appendChild(card);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - ACHIEVEMENTS
    // ══════════════════════════════════════════
    let achCount = 0;
    function addAchievement(p) {
        achCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header"><span class="item-card-number">Achievement #${achCount}</span><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button></div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="achTitle" placeholder=" " value="${p?.title||''}"/><label>Title</label></div></div>
                <div class="col-md-3"><div class="form-floating-custom"><input type="text" class="form-input" data-field="achDate" placeholder=" " value="${p?.date||''}"/><label>Date</label></div></div>
                <div class="col-md-3"><div class="form-floating-custom"><input type="text" class="form-input" data-field="achLocation" placeholder=" " value="${p?.location||''}"/><label>Location</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="achRole" placeholder=" " value="${p?.role||''}"/><label>Role</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="achLink" placeholder=" " value="${p?.link||''}"/><label>Link (optional)</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><textarea class="form-input form-textarea" data-field="achDesc" placeholder=" " rows="2">${p?.description||''}</textarea><label>Description (one bullet per line)</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(achievementsList, 'Achievement'); triggerPreview(); });
        card.querySelectorAll('.form-input').forEach(el => el.addEventListener('input', triggerPreview));
        achievementsList.appendChild(card);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - CERTIFICATIONS
    // ══════════════════════════════════════════
    function addCertification(val) {
        const item = document.createElement('div');
        item.className = 'simple-item';
        item.innerHTML = `<input type="text" class="form-input" data-field="certName" placeholder="e.g. AWS Certified Solutions Architect" value="${val||''}"/><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>`;
        item.querySelector('.btn-remove-item').addEventListener('click', () => { item.remove(); triggerPreview(); });
        item.querySelector('.form-input').addEventListener('input', triggerPreview);
        certificationsList.appendChild(item);
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  DYNAMIC SECTIONS - ADDITIONAL INFO
    // ══════════════════════════════════════════
    function addAdditionalInfo(val) {
        const item = document.createElement('div');
        item.className = 'simple-item';
        item.innerHTML = `<input type="text" class="form-input" data-field="addInfo" placeholder="e.g. Languages: English (fluent), Hindi (native)" value="${val||''}"/><button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>`;
        item.querySelector('.btn-remove-item').addEventListener('click', () => { item.remove(); triggerPreview(); });
        item.querySelector('.form-input').addEventListener('input', triggerPreview);
        additionalInfoList.appendChild(item);
        triggerPreview();
    }

    function renumberItems(container, label) {
        container.querySelectorAll('.item-card-number').forEach((el, i) => el.textContent = `${label} #${i + 1}`);
    }

    // ══════════════════════════════════════════
    //  TEMPLATE SWITCHING
    // ══════════════════════════════════════════
    function initTemplateButtons() {
        $$('.template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.template-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedTemplate = btn.dataset.template;
                updatePreview();
            });
        });
    }

    // ══════════════════════════════════════════
    //  PDF EXPORT
    // ══════════════════════════════════════════
    async function exportPdf() {
        const data = collectFormData();
        showLoading(true);
        try {
            const resp = await fetch('/api/export/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (resp.ok) {
                const blob = await resp.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (data.personalInfo.fullName || 'resume').replace(/\s+/g, '_') + '_resume.pdf';
                document.body.appendChild(a); a.click(); a.remove();
                URL.revokeObjectURL(url);
                showToast('✅ PDF exported successfully!');
            } else { showToast('❌ PDF export failed. Please try again.'); }
        } catch (e) { console.error(e); showToast('❌ PDF export failed.'); }
        showLoading(false);
    }

    // ══════════════════════════════════════════
    //  JSON SAVE / LOAD
    // ══════════════════════════════════════════
    function saveJson() {
        const data = collectFormData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (data.personalInfo.fullName || 'resume').replace(/\s+/g, '_') + '_resume.json';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        showToast('✅ Resume saved as JSON!');
    }

    function loadJson() { $('#jsonFileInput').click(); }

    function handleJsonFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try { populateForm(JSON.parse(evt.target.result)); showToast('✅ Resume loaded successfully!'); }
            catch (err) { showToast('❌ Invalid JSON file.'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function populateForm(data) {
        if (data.personalInfo) {
            const p = data.personalInfo;
            ['fullName','jobTitle','email','phone','address','summary','linkedIn','website'].forEach(f => {
                if ($('#'+f)) $('#'+f).value = p[f] || '';
            });
        }

        workList.innerHTML = ''; workCount = 0;
        (data.workExperiences || []).forEach(exp => addWorkExperience(exp));

        eduList.innerHTML = ''; eduCount = 0;
        (data.educations || []).forEach(edu => addEducation(edu));

        skillsList.innerHTML = '';
        (data.skills || []).forEach(s => addSkill(s));

        if (data.technicalSkills) {
            const ts = data.technicalSkills;
            $('#tsLangs').value = ts.programmingLanguages || '';
            $('#tsFrameworks').value = ts.frameworksLibraries || '';
            $('#tsDatabases').value = ts.databases || '';
            $('#tsCloud').value = ts.cloudDevOps || '';
            $('#tsTools').value = ts.tools || '';
            $('#tsConcepts').value = ts.concepts || '';
        }
        $('#relevantCoursework').value = data.relevantCoursework || '';

        projectsList.innerHTML = ''; projCount = 0;
        (data.projects || []).forEach(p => addProject(p));

        achievementsList.innerHTML = ''; achCount = 0;
        (data.achievements || []).forEach(a => addAchievement(a));

        certificationsList.innerHTML = '';
        (data.certifications || []).forEach(c => addCertification(c));

        additionalInfoList.innerHTML = '';
        (data.additionalInfo || []).forEach(a => addAdditionalInfo(a));

        if (data.selectedTemplate) {
            selectedTemplate = data.selectedTemplate;
            $$('.template-btn').forEach(b => b.classList.toggle('active', b.dataset.template === selectedTemplate));
        }
        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  UTILITIES
    // ══════════════════════════════════════════
    function showLoading(show) { loadingOverlay.classList.toggle('show', show); }

    function showToast(message) {
        const toastBody = $('#toastBody');
        const toastEl = $('#appToast');
        toastBody.textContent = message;
        new bootstrap.Toast(toastEl, { delay: 3000 }).show();
    }

    function initCollapseAnimations() {
        $$('.section-header').forEach(header => {
            const target = document.querySelector(header.dataset.bsTarget);
            if (target) {
                target.addEventListener('hide.bs.collapse', () => header.classList.add('collapsed'));
                target.addEventListener('show.bs.collapse', () => header.classList.remove('collapsed'));
            }
        });
    }

    // ══════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════
    function init() {
        // Personal info + static fields
        $$('#sectionPersonal .form-input').forEach(el => el.addEventListener('input', triggerPreview));
        $('#relevantCoursework').addEventListener('input', triggerPreview);
        $$('#sectionTechSkills .form-input').forEach(el => el.addEventListener('input', triggerPreview));

        // Add buttons
        $('#btnAddWork').addEventListener('click', () => addWorkExperience());
        $('#btnAddEducation').addEventListener('click', () => addEducation());
        $('#btnAddSkill').addEventListener('click', () => addSkill());
        $('#btnAddProject').addEventListener('click', () => addProject());
        $('#btnAddAchievement').addEventListener('click', () => addAchievement());
        $('#btnAddCertification').addEventListener('click', () => addCertification());
        $('#btnAddAdditionalInfo').addEventListener('click', () => addAdditionalInfo());

        // Action buttons
        $('#btnExportPdf').addEventListener('click', exportPdf);
        $('#btnSaveJson').addEventListener('click', saveJson);
        $('#btnLoadJson').addEventListener('click', loadJson);
        $('#jsonFileInput').addEventListener('change', handleJsonFile);

        initTemplateButtons();
        initCollapseAnimations();

        // Add one of each by default
        addWorkExperience();
        addEducation();
        addSkill();
        addProject();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
