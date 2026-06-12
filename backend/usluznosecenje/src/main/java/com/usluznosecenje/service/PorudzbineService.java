package com.usluznosecenje.service;

import com.usluznosecenje.model.Porudzbina;
import com.usluznosecenje.model.PorudzbineStavka;
import com.usluznosecenje.repository.PorudzbineRepository;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PorudzbineService {

    private final PorudzbineRepository porudzbineRepository;
    private final JavaMailSender mailSender;

    @Value("${app.mail.admin}")
    private String adminEmail;

    public Porudzbina kreiraj(Map<String, Object> payload) {
        Map<String, Object> kupac   = (Map<String, Object>) payload.get("kupac");
        Map<String, Object> dostava = (Map<String, Object>) payload.get("dostava");
        List<Map<String, Object>> stavkeRaw = (List<Map<String, Object>>) payload.get("stavke");

        Porudzbina p = new Porudzbina();

        // Kupac
        p.setIme((String) kupac.get("ime"));
        p.setPrezime((String) kupac.get("prezime"));
        p.setEmail((String) kupac.get("email"));
        p.setTelefon((String) kupac.get("telefon"));
        p.setFirma((String) kupac.get("firma"));
        p.setPib((String) kupac.get("pib"));

        // Dostava
        p.setAdresa((String) dostava.get("adresa"));
        p.setGrad((String) dostava.get("grad"));
        p.setPostBroj((String) dostava.get("postBroj"));
        p.setNacinDostave((String) dostava.get("nacin"));

        // Ostalo
        p.setPlacanje((String) payload.get("placanje"));
        p.setNapomena((String) payload.get("napomena"));
        p.setUkupnoBezPdv(toDouble(payload.get("ukupnoBezPdv")));
        p.setPdv(toDouble(payload.get("pdv")));
        p.setUkupnoSaPdv(toDouble(payload.get("ukupnoSaPdv")));

        // Stavke
        List<PorudzbineStavka> stavke = stavkeRaw.stream().map(s -> {
            PorudzbineStavka st = new PorudzbineStavka();
            st.setProductId(toLong(s.get("productId")));
            st.setNaziv((String) s.get("naziv"));
            st.setKolicina(toInt(s.get("kolicina")));
            st.setCena(toDouble(s.get("cena")));
            st.setPorudzbina(p);
            return st;
        }).toList();

        p.setStavke(stavke);

        Porudzbina saved = porudzbineRepository.save(p);

        posaljiMailove(saved);

        return saved;
    }

    private void posaljiMailove(Porudzbina p) {
        // Mail adminu
        try {
            SimpleMailMessage adminMail = new SimpleMailMessage();
            adminMail.setTo(adminEmail);
            adminMail.setSubject("Nova porudžbina #" + p.getId());
            adminMail.setText(buildAdminMailText(p));
            mailSender.send(adminMail);
        } catch (Exception e) {
            // Ne prekidamo flow ako mail ne uspe
            System.err.println("Greška pri slanju admin maila: " + e.getMessage());
        }

        // Mail kupcu
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(p.getEmail());
            helper.setSubject("Potvrda porudžbine #" + p.getId());

            helper.setText(buildKupacHtml(p), true);

            helper.addInline(
                "logo",
                new File("D:/KostaMarinkovic/UsluznoSecenje-main/frontend/app/public/logo.png")
            );

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Greška pri slanju maila kupcu: " + e.getMessage());
        }
    }

    private String buildAdminMailText(Porudzbina p) {
        StringBuilder sb = new StringBuilder();

        sb.append("Nova porudžbina #").append(p.getId()).append("\n\n");

        sb.append("Kupac: ")
        .append(p.getIme())
        .append(" ")
        .append(p.getPrezime())
        .append("\n");

        sb.append("Email: ").append(p.getEmail()).append("\n");
        sb.append("Telefon: ").append(p.getTelefon()).append("\n");

        if (p.getFirma() != null && !p.getFirma().isBlank()) {
            sb.append("Firma: ").append(p.getFirma()).append("\n");
        }

        sb.append("\nDostava: ").append(p.getNacinDostave()).append("\n");
        sb.append("Adresa: ")
        .append(p.getAdresa())
        .append(", ")
        .append(p.getPostBroj())
        .append(" ")
        .append(p.getGrad())
        .append("\n");

        sb.append("\nPlaćanje: ").append(p.getPlacanje()).append("\n");

        sb.append("\nStavke:\n");
        for (PorudzbineStavka s : p.getStavke()) {
            sb.append("  - ")
            .append(s.getNaziv())
            .append(" x")
            .append(s.getKolicina())
            .append(" = ")
            .append(s.getCena() * s.getKolicina())
            .append(" RSD\n");
        }

        sb.append("\nUkupno bez PDV: ")
        .append(p.getUkupnoBezPdv())
        .append(" RSD\n");

        sb.append("PDV (20%): ")
        .append(p.getPdv())
        .append(" RSD\n");

        if ("kurirska".equalsIgnoreCase(p.getNacinDostave())) {
            sb.append("UKUPNO: ")
            .append(p.getUkupnoSaPdv())
            .append(" RSD + troškovi dostave\n");
        } else {
            sb.append("UKUPNO: ")
            .append(p.getUkupnoSaPdv())
            .append(" RSD\n");
        }

        if (p.getNapomena() != null && !p.getNapomena().isBlank()) {
            sb.append("\nNapomena: ").append(p.getNapomena());
        }

        return sb.toString();
    }

    private String buildKupacMailText(Porudzbina p) {

        String ukupanIznos = "Ukupan iznos: " + p.getUkupnoSaPdv() + " RSD";

        if ("kurirska".equalsIgnoreCase(p.getNacinDostave())) {
            ukupanIznos += " + troškovi dostave";
        }

        return "Poštovani " + p.getIme() + ",\n\n" +
            "Vaša porudžbina #" + p.getId() + " je uspešno primljena.\n" +
            "Kontaktiraćemo vas u najkraćem roku.\n\n" +
            ukupanIznos + "\n\n" +
            "Hvala na poverenju,\nUslužno sečenje";
    }

    private String buildKupacHtml(Porudzbina p) {

        String ukupno = p.getUkupnoSaPdv() + " RSD";

        if ("kurirska".equalsIgnoreCase(p.getNacinDostave())) {
            ukupno += " + troškovi dostave";
        }

        return """
        <!DOCTYPE html>
        <html lang="sr">
        <head>
        <meta charset="UTF-8">
        </head>
        <body style="
            margin:0;
            padding:40px 20px;
            background:#0F1115;
            font-family:Arial,sans-serif;
        ">

        <table width="100%%" cellpadding="0" cellspacing="0">
        <tr>
        <td align="center">

        <table width="650" cellpadding="0" cellspacing="0"
        style="
            background:#1A1F29;
            border-radius:18px;
            overflow:hidden;
            border-top:4px solid #FF6B00;
        ">

        <tr>
        <td align="center"
        style="
            padding:40px;
            background:
            linear-gradient(
                180deg,
                rgb(32,38,49) 0%%,
                #1A1F29 100%%
            );
        ">

        <img
        src="cid:logo"
        alt="Uslužno sečenje"
        style="max-height:90px;margin-bottom:20px;"
        >

        <div style="
            color:#FF6B00;
            font-size:11px;
            letter-spacing:3px;
            text-transform:uppercase;
            font-weight:bold;
        ">
        POTVRDA PORUDŽBINE
        </div>

        <h1 style="
            color:#F3F4F6;
            margin:15px 0 0;
            font-size:34px;
        ">
        Hvala na porudžbini!
        </h1>

        </td>
        </tr>

        <tr>
        <td style="padding:40px;">

        <p style="color:#F3F4F6;font-size:16px;">
        Poštovani <strong>%s</strong>,
        </p>

        <p style="
            color:#B5BBC5;
            font-size:15px;
            line-height:1.7;
        ">
        Vaša porudžbina <strong>#%d</strong> je uspešno primljena
        i trenutno je u obradi.
        </p>

        <div style="
            margin:30px 0;
            padding:25px;
            border-radius:12px;
            background:#202631;
            border:1px solid rgba(255,107,0,0.25);
        ">

        <div style="
            color:#FF6B00;
            font-size:12px;
            text-transform:uppercase;
            letter-spacing:2px;
            margin-bottom:10px;
        ">
        Ukupan iznos
        </div>

        <div style="
            color:#F3F4F6;
            font-size:28px;
            font-weight:bold;
        ">
        %s
        </div>

        </div>

        <p style="
            color:#B5BBC5;
            font-size:15px;
            line-height:1.7;
        ">
        Kontaktiraćemo vas u najkraćem roku radi potvrde porudžbine.
        </p>

        </td>
        </tr>

        <tr>
        <td style="
            padding:25px;
            background:#141922;
            border-top:1px solid rgba(255,255,255,0.05);
        ">

        <p style="
            margin:0;
            color:#8C95A3;
            text-align:center;
            font-size:13px;
        ">
        Uslužno sečenje • Profesionalno CNC i lasersko sečenje
        </p>

        </td>
        </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>
    """.formatted(
            p.getIme(),
            p.getId(),
            ukupno
        );
    }


    // --- helpers ---
    private double toDouble(Object o) {
        if (o instanceof Number n) return n.doubleValue();
        return 0.0;
    }

    private int toInt(Object o) {
        if (o instanceof Number n) return n.intValue();
        return 0;
    }

    private long toLong(Object o) {
        if (o instanceof Number n) return n.longValue();
        return 0L;
    }
}