package com.usluznosecenje.controller;

import com.usluznosecenje.model.Porudzbina;
import com.usluznosecenje.service.PorudzbineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/porudzbine")
@RequiredArgsConstructor
public class PorudzbineController {

    private final PorudzbineService porudzbineService;

    @PostMapping
    public ResponseEntity<?> kreiraj(@RequestBody Map<String, Object> payload) {
        try {
            Porudzbina p = porudzbineService.kreiraj(payload);
            return ResponseEntity.ok(Map.of("id", p.getId(), "status", "ok"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}