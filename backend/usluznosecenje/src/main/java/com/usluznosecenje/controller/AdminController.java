package com.usluznosecenje.controller;

import com.usluznosecenje.model.Porudzbina;
import com.usluznosecenje.model.Product;
import com.usluznosecenje.model.Upit;
import com.usluznosecenje.repository.UpitRepository;
import com.usluznosecenje.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UpitRepository upitRepository;
    private final AdminService adminService;

    // --- PORUDZBINE ---
    @GetMapping("/porudzbine")
    public ResponseEntity<List<Porudzbina>> getPorudzbine() {
        return ResponseEntity.ok(adminService.getAllPorudzbine());
    }

    @PutMapping("/porudzbine/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Porudzbina p = adminService.updateStatus(id, body.get("status"));
            return ResponseEntity.ok(Map.of("id", p.getId(), "status", p.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/porudzbine/{id}")
    public ResponseEntity<?> deletePorudzbina(@PathVariable Long id) {
        adminService.deletePorudzbina(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }

    // --- PRODUCTS ---
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(adminService.saveProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        return ResponseEntity.ok(adminService.updateProduct(id, product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }

    // --- STATISTIKE ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/upiti")
    public ResponseEntity<List<Upit>> getUpiti() {
        return ResponseEntity.ok(upitRepository.findAllByOrderByKreiranoUDesc());
    }

    @PutMapping("/upiti/{id}/procitan")
    public ResponseEntity<?> markUpitProcitan(@PathVariable Long id) {
        Upit u = upitRepository.findById(id).orElseThrow();
        u.setProcitan(true);
        upitRepository.save(u);
        return ResponseEntity.ok(Map.of("id", u.getId(), "procitan", true));
    }

    @DeleteMapping("/upiti/{id}")
    public ResponseEntity<?> deleteUpit(@PathVariable Long id) {
        upitRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }

    @PutMapping("/porudzbine/bulk-status")
    public ResponseEntity<?> bulkUpdateStatus(@RequestBody Map<String, Object> body) {
        List<Integer> idsRaw = (List<Integer>) body.get("ids");
        String status = (String) body.get("status");
        List<Long> ids = idsRaw.stream().map(Integer::longValue).toList();
        adminService.bulkUpdateStatus(ids, status);
        return ResponseEntity.ok(Map.of("updated", ids.size()));
    }
}