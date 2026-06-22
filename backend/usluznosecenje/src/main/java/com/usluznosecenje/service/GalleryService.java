package com.usluznosecenje.service;

import com.usluznosecenje.model.GalleryItem;
import com.usluznosecenje.repository.GalleryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryItemRepository galleryItemRepository;

    public List<GalleryItem> getAll() {
        return galleryItemRepository.findAll();
    }

    public GalleryItem save(GalleryItem item) {
        return galleryItemRepository.save(item);
    }

    public void delete(Long id) {
        galleryItemRepository.deleteById(id);
    }
}