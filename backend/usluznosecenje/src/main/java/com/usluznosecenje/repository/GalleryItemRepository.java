package com.usluznosecenje.repository;

import com.usluznosecenje.model.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
}