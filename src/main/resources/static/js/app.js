/**
 * ResumeForge - Main Application JavaScript
 * Handles form management, live preview, PDF export, and JSON save/load
 */
(function () {
    'use strict';

    // ── State ──
    let selectedTemplate = 'modern';
    let previewTimeout = null;
    const DEBOUNCE_MS = 400;

    // ── DOM Refs ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const previewContent = $('#previewContent');
    const workList = $('#workExperienceList');
    const eduList = $('#educationList');
    const skillsList = $('#skillsList');
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
            selectedTemplate: selectedTemplate
        };

        // Work experiences
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

        // Education
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

        // Skills
        skillsList.querySelectorAll('.skill-item').forEach((item) => {
            const name = item.querySelector('[data-field="skillName"]')?.value || '';
            const dots = item.querySelectorAll('.proficiency-dot.active');
            data.skills.push({ name: name, proficiency: dots.length || 3 });
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
        // Check if form has any content
        const hasContent = data.personalInfo.fullName || data.personalInfo.jobTitle ||
            data.workExperiences.length > 0 || data.educations.length > 0 || data.skills.length > 0;

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
            if (resp.ok) {
                previewContent.innerHTML = await resp.text();
            }
        } catch (e) {
            console.error('Preview error:', e);
        }
    }

    // ══════════════════════════════════════════
    //  DYNAMIC FORM SECTIONS
    // ══════════════════════════════════════════

    // -- Work Experience --
    let workCount = 0;
    function addWorkExperience(prefill) {
        workCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header">
                <span class="item-card-number">Experience #${workCount}</span>
                <button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="position" placeholder=" " value="${prefill?.position || ''}"/><label>Position / Title</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="company" placeholder=" " value="${prefill?.company || ''}"/><label>Company</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="startDate" placeholder=" " value="${prefill?.startDate || ''}"/><label>Start Date</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="endDate" placeholder=" " value="${prefill?.endDate || ''}"/><label>End Date</label></div></div>
                <div class="col-md-4"><div class="check-group" style="height:100%;display:flex;align-items:center;padding-top:8px"><input type="checkbox" data-field="current" id="current_${workCount}" ${prefill?.current ? 'checked' : ''}/><label for="current_${workCount}">Currently Working</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><textarea class="form-input form-textarea" data-field="description" placeholder=" " rows="2">${prefill?.description || ''}</textarea><label>Description</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(workList, 'Experience'); triggerPreview(); });
        card.querySelectorAll('.form-input, input[type="checkbox"]').forEach(el => el.addEventListener('input', triggerPreview));
        workList.appendChild(card);
        triggerPreview();
    }

    // -- Education --
    let eduCount = 0;
    function addEducation(prefill) {
        eduCount++;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-header">
                <span class="item-card-number">Education #${eduCount}</span>
                <button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="row g-3">
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="institution" placeholder=" " value="${prefill?.institution || ''}"/><label>Institution</label></div></div>
                <div class="col-md-6"><div class="form-floating-custom"><input type="text" class="form-input" data-field="degree" placeholder=" " value="${prefill?.degree || ''}"/><label>Degree</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="fieldOfStudy" placeholder=" " value="${prefill?.fieldOfStudy || ''}"/><label>Field of Study</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="startDate" placeholder=" " value="${prefill?.startDate || ''}"/><label>Start Date</label></div></div>
                <div class="col-md-4"><div class="form-floating-custom"><input type="text" class="form-input" data-field="endDate" placeholder=" " value="${prefill?.endDate || ''}"/><label>End Date</label></div></div>
                <div class="col-12"><div class="form-floating-custom"><input type="text" class="form-input" data-field="gpa" placeholder=" " value="${prefill?.gpa || ''}"/><label>GPA (optional)</label></div></div>
            </div>`;
        card.querySelector('.btn-remove-item').addEventListener('click', () => { card.remove(); renumberItems(eduList, 'Education'); triggerPreview(); });
        card.querySelectorAll('.form-input').forEach(el => el.addEventListener('input', triggerPreview));
        eduList.appendChild(card);
        triggerPreview();
    }

    // -- Skills --
    function addSkill(prefill) {
        const item = document.createElement('div');
        item.className = 'skill-item';
        const prof = prefill?.proficiency || 3;
        let dotsHtml = '';
        for (let i = 1; i <= 5; i++) {
            dotsHtml += `<div class="proficiency-dot ${i <= prof ? 'active' : ''}" data-level="${i}"></div>`;
        }
        item.innerHTML = `
            <input type="text" class="form-input" data-field="skillName" placeholder="Skill name" value="${prefill?.name || ''}"/>
            <div class="proficiency-dots">${dotsHtml}</div>
            <button type="button" class="btn-remove-item" title="Remove"><i class="bi bi-x-lg"></i></button>`;

        item.querySelector('.btn-remove-item').addEventListener('click', () => { item.remove(); triggerPreview(); });
        item.querySelector('.form-input').addEventListener('input', triggerPreview);
        item.querySelectorAll('.proficiency-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const level = parseInt(dot.dataset.level);
                item.querySelectorAll('.proficiency-dot').forEach((d, i) => {
                    d.classList.toggle('active', i < level);
                });
                triggerPreview();
            });
        });
        skillsList.appendChild(item);
        triggerPreview();
    }

    function renumberItems(container, label) {
        container.querySelectorAll('.item-card-number').forEach((el, i) => {
            el.textContent = `${label} #${i + 1}`;
        });
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
            const resp = await fetch('/api/export/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (resp.ok) {
                const blob = await resp.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = (data.personalInfo.fullName || 'resume').replace(/\s+/g, '_') + '_resume.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                showToast('✅ PDF exported successfully!');
            } else {
                showToast('❌ PDF export failed. Please try again.');
            }
        } catch (e) {
            console.error('PDF export error:', e);
            showToast('❌ PDF export failed.');
        }
        showLoading(false);
    }

    // ══════════════════════════════════════════
    //  JSON SAVE / LOAD
    // ══════════════════════════════════════════
    function saveJson() {
        const data = collectFormData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (data.personalInfo.fullName || 'resume').replace(/\s+/g, '_') + '_resume.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('✅ Resume saved as JSON!');
    }

    function loadJson() {
        $('#jsonFileInput').click();
    }

    function handleJsonFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target.result);
                populateForm(data);
                showToast('✅ Resume loaded successfully!');
            } catch (err) {
                showToast('❌ Invalid JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function populateForm(data) {
        // Personal info
        if (data.personalInfo) {
            const p = data.personalInfo;
            if ($('#fullName')) $('#fullName').value = p.fullName || '';
            if ($('#jobTitle')) $('#jobTitle').value = p.jobTitle || '';
            if ($('#email')) $('#email').value = p.email || '';
            if ($('#phone')) $('#phone').value = p.phone || '';
            if ($('#address')) $('#address').value = p.address || '';
            if ($('#summary')) $('#summary').value = p.summary || '';
            if ($('#linkedIn')) $('#linkedIn').value = p.linkedIn || '';
            if ($('#website')) $('#website').value = p.website || '';
        }

        // Work experiences
        workList.innerHTML = '';
        workCount = 0;
        if (data.workExperiences) {
            data.workExperiences.forEach(exp => addWorkExperience(exp));
        }

        // Education
        eduList.innerHTML = '';
        eduCount = 0;
        if (data.educations) {
            data.educations.forEach(edu => addEducation(edu));
        }

        // Skills
        skillsList.innerHTML = '';
        if (data.skills) {
            data.skills.forEach(skill => addSkill(skill));
        }

        // Template
        if (data.selectedTemplate) {
            selectedTemplate = data.selectedTemplate;
            $$('.template-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.template === selectedTemplate);
            });
        }

        triggerPreview();
    }

    // ══════════════════════════════════════════
    //  UTILITIES
    // ══════════════════════════════════════════
    function showLoading(show) {
        loadingOverlay.classList.toggle('show', show);
    }

    function showToast(message) {
        const toastBody = $('#toastBody');
        const toastEl = $('#appToast');
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }

    // ══════════════════════════════════════════
    //  COLLAPSE CHEVRON ANIMATION
    // ══════════════════════════════════════════
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
        // Bind personal info inputs
        $$('#sectionPersonal .form-input').forEach(el => el.addEventListener('input', triggerPreview));

        // Add buttons
        $('#btnAddWork').addEventListener('click', () => addWorkExperience());
        $('#btnAddEducation').addEventListener('click', () => addEducation());
        $('#btnAddSkill').addEventListener('click', () => addSkill());

        // Action buttons
        $('#btnExportPdf').addEventListener('click', exportPdf);
        $('#btnSaveJson').addEventListener('click', saveJson);
        $('#btnLoadJson').addEventListener('click', loadJson);
        $('#jsonFileInput').addEventListener('change', handleJsonFile);

        // Templates
        initTemplateButtons();

        // Collapse animations
        initCollapseAnimations();

        // Add one of each by default for UX
        addWorkExperience();
        addEducation();
        addSkill();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
