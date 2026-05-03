package com.resumebuilder.controller;

import com.resumebuilder.model.Resume;
import com.resumebuilder.service.PdfService;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Controller
public class ResumeController {

    private final TemplateEngine templateEngine;
    private final PdfService pdfService;

    public ResumeController(TemplateEngine templateEngine, PdfService pdfService) {
        this.templateEngine = templateEngine;
        this.pdfService = pdfService;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/api/preview")
    @ResponseBody
    public String preview(@RequestBody Resume resume) {
        String template = resume.getSelectedTemplate() != null ? resume.getSelectedTemplate() : "modern";
        Context context = new Context();
        context.setVariable("resume", resume);
        return templateEngine.process("templates/" + template, context);
    }

    @PostMapping("/api/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody Resume resume) {
        try {
            byte[] pdfBytes = pdfService.generatePdf(resume);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                ContentDisposition.attachment()
                    .filename("resume.pdf")
                    .build()
            );
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
