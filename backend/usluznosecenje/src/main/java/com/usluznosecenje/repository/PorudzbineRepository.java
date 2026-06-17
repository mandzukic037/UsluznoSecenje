package com.usluznosecenje.repository;

import com.usluznosecenje.model.Porudzbina;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PorudzbineRepository extends JpaRepository<Porudzbina, Long> {
    List<Porudzbina> findAllByOrderByKreiranoUDesc();
}