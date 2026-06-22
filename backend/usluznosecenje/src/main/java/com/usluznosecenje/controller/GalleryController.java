package com.usluznosecenje.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.usluznosecenje.model.GalleryItem;
import com.usluznosecenje.service.GalleryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping
    public ResponseEntity<List<GalleryItem>> getAll() {
        return ResponseEntity.ok(galleryService.getAll());
    }
    @PostMapping
    public ResponseEntity<GalleryItem> create(@RequestBody GalleryItem item) {
        return ResponseEntity.ok(galleryService.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        galleryService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }
}