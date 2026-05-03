package com.resumebuilder.model;

public class Skill {
    private String name = "";
    private int proficiency = 3;

    public Skill() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getProficiency() { return proficiency; }
    public void setProficiency(int proficiency) { this.proficiency = proficiency; }
}
