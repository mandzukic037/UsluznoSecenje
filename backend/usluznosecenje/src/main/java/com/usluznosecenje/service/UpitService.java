package com.usluznosecenje.service;

import com.usluznosecenje.model.Upit;
import com.usluznosecenje.model.UpitFajl;
import com.usluznosecenje.repository.UpitFajlRepository;
import com.usluznosecenje.repository.UpitRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpitService {

    private final JavaMailSender mailSender;
    private final UpitRepository upitRepository;
    private final UpitFajlRepository upitFajlRepository;

    @Value("${app.mail.admin}")
    private String adminEmail;

    public void posaljiUpit(String ime, String prezime, String mail,
                            String telefon, String usluga, String opis,
                            List<MultipartFile> files) throws Exception {

        Upit upit = new Upit();
        upit.setIme(ime);
        upit.setPrezime(prezime);
        upit.setMail(mail);
        upit.setTelefon(telefon);
        upit.setUsluga(usluga);
        upit.setOpis(opis);

        Upit sacuvanUpit = upitRepository.save(upit);

        Path uploadDir = Paths.get("uploads");

        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        if (files != null) {
            for (MultipartFile file : files) {

                if (file.isEmpty()) {
                    continue;
                }

                String fileName =
                        UUID.randomUUID() + "_" +
                        file.getOriginalFilename();

                Path target =
                        uploadDir.resolve(fileName);

                Files.copy(
                        file.getInputStream(),
                        target,
                        StandardCopyOption.REPLACE_EXISTING
                );

                UpitFajl upitFajl = new UpitFajl();
                upitFajl.setNaziv(file.getOriginalFilename());
                upitFajl.setPutanja("/uploads/" + fileName);
                upitFajl.setUpit(sacuvanUpit);

                upitFajlRepository.save(upitFajl);
            }
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper =
                new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(adminEmail);
        helper.setReplyTo(mail);
        helper.setSubject(
                "Novi upit: " + usluga + " — " + ime + " " + prezime
        );

        String body =
                "<h2>Novi upit sa sajta</h2>" +
                "<p><b>Ime:</b> " + ime + " " + prezime + "</p>" +
                "<p><b>Email:</b> " + mail + "</p>" +
                "<p><b>Telefon:</b> " + telefon + "</p>" +
                "<p><b>Usluga:</b> " + usluga + "</p>" +
                "<p><b>Opis:</b><br>" +
                opis.replace("\n", "<br>") +
                "</p>";

        helper.setText(body, true);

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    helper.addAttachment(
                            file.getOriginalFilename(),
                            file
                    );
                }
            }
        }

        mailSender.send(message);
    }
}