package com.resumebuilder.model;

import java.util.ArrayList;
import java.util.List;

public class Resume {
    private PersonalInfo personalInfo = new PersonalInfo();
    private List<WorkExperience> workExperiences = new ArrayList<>();
    private List<Education> educations = new ArrayList<>();
    private List<Skill> skills = new ArrayList<>();
    private String selectedTemplate = "modern";

    public Resume() {}

    public PersonalInfo getPersonalInfo() { return personalInfo; }
    public void setPersonalInfo(PersonalInfo personalInfo) { this.personalInfo = personalInfo; }
    public List<WorkExperience> getWorkExperiences() { return workExperiences; }
    public void setWorkExperiences(List<WorkExperience> workExperiences) { this.workExperiences = workExperiences; }
    public List<Education> getEducations() { return educations; }
    public void setEducations(List<Education> educations) { this.educations = educations; }
    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }
    public String getSelectedTemplate() { return selectedTemplate; }
    public void setSelectedTemplate(String selectedTemplate) { this.selectedTemplate = selectedTemplate; }
}
