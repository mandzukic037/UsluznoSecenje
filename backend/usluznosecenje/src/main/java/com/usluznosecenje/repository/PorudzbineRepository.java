package com.usluznosecenje.repository;

import com.usluznosecenje.model.Porudzbina;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PorudzbineRepository extends JpaRepository<Porudzbina, Long> {
}