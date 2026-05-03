package com.resumebuilder.model;

import java.util.ArrayList;
import java.util.List;

public class Resume {
    private PersonalInfo personalInfo = new PersonalInfo();
    private List<WorkExperience> workExperiences = new ArrayList<>();
    private List<Education> educations = new ArrayList<>();
    private List<Skill> skills = new ArrayList<>();
    private TechnicalSkills technicalSkills = new TechnicalSkills();
    private String relevantCoursework = "";
    private List<Project> projects = new ArrayList<>();
    private List<Achievement> achievements = new ArrayList<>();
    private List<String> certifications = new ArrayList<>();
    private List<String> additionalInfo = new ArrayList<>();
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
    public TechnicalSkills getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(TechnicalSkills technicalSkills) { this.technicalSkills = technicalSkills; }
    public String getRelevantCoursework() { return relevantCoursework; }
    public void setRelevantCoursework(String relevantCoursework) { this.relevantCoursework = relevantCoursework; }
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }
    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }
    public List<String> getAdditionalInfo() { return additionalInfo; }
    public void setAdditionalInfo(List<String> additionalInfo) { this.additionalInfo = additionalInfo; }
    public String getSelectedTemplate() { return selectedTemplate; }
    public void setSelectedTemplate(String selectedTemplate) { this.selectedTemplate = selectedTemplate; }
}
