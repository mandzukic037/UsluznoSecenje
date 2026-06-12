package com.usluznosecenje.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UpitService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.admin}")
    private String adminEmail;

    public void posaljiUpit(String ime, String prezime, String mail,
                            String telefon, String usluga, String opis,
                            List<MultipartFile> files) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(adminEmail);
        helper.setReplyTo(mail);
        helper.setSubject("Novi upit: " + usluga + " — " + ime + " " + prezime);

        String body = "<h2>Novi upit sa sajta</h2>" +
                "<p><b>Ime:</b> " + ime + " " + prezime + "</p>" +
                "<p><b>Email:</b> " + mail + "</p>" +
                "<p><b>Telefon:</b> " + telefon + "</p>" +
                "<p><b>Usluga:</b> " + usluga + "</p>" +
                "<p><b>Opis:</b><br>" + opis.replace("\n", "<br>") + "</p>";

        helper.setText(body, true);

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    helper.addAttachment(file.getOriginalFilename(), file);
                }
            }
        }

        mailSender.send(message);
    }
}