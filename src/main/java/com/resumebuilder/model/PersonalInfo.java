package com.resumebuilder.model;

public class PersonalInfo {
    private String fullName = "";
    private String jobTitle = "";
    private String email = "";
    private String phone = "";
    private String address = "";
    private String summary = "";
    private String linkedIn = "";
    private String website = "";

    public PersonalInfo() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getLinkedIn() { return linkedIn; }
    public void setLinkedIn(String linkedIn) { this.linkedIn = linkedIn; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
