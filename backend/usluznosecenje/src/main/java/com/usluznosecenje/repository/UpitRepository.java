package com.usluznosecenje.repository;

import com.usluznosecenje.model.Upit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface UpitRepository extends JpaRepository<Upit, Long> {

    @Query("SELECT DISTINCT u FROM Upit u LEFT JOIN FETCH u.fajlovi ORDER BY u.kreiranoU DESC")
    List<Upit> findAllByOrderByKreiranoUDesc();
}