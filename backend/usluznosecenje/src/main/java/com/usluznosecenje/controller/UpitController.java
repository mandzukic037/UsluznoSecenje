package com.usluznosecenje.controller;

import com.usluznosecenje.service.UpitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UpitController {

    private final UpitService upitService;

    @PostMapping("/upit")
    public ResponseEntity<?> posaljiUpit(
            @RequestParam("ime")      String ime,
            @RequestParam("prezime")  String prezime,
            @RequestParam("mail")     String mail,
            @RequestParam("telefon")  String telefon,
            @RequestParam("usluga")   String usluga,
            @RequestParam("opis")     String opis,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        try {
            upitService.posaljiUpit(ime, prezime, mail, telefon, usluga, opis, files);
            return ResponseEntity.ok(Map.of("status", "ok"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}