package com.resumebuilder.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.resumebuilder.model.Resume;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generatePdf(Resume resume) throws Exception {
        String template = resume.getSelectedTemplate() != null ? resume.getSelectedTemplate() : "modern";

        Context context = new Context();
        context.setVariable("resume", resume);

        String html = templateEngine.process("pdf/" + template, context);

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, "/");
        builder.toStream(os);
        builder.run();

        return os.toByteArray();
    }
}
