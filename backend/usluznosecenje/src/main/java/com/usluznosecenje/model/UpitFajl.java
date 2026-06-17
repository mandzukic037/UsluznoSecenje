package com.usluznosecenje.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "upit_fajlovi")
public class UpitFajl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;

    private String putanja;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upit_id")
    @JsonIgnore
    private Upit upit;

    public Long getId() {
        return id;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getPutanja() {
        return putanja;
    }

    public void setPutanja(String putanja) {
        this.putanja = putanja;
    }

    public Upit getUpit() {
        return upit;
    }

    public void setUpit(Upit upit) {
        this.upit = upit;
    }
}