package com.usluznosecenje.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "upiti")
public class Upit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ime;
    private String prezime;
    private String mail;
    private String telefon;
    private String usluga;
    @OneToMany(
        mappedBy = "upit",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<UpitFajl> fajlovi = new ArrayList<>();

    public List<UpitFajl> getFajlovi() {
        return fajlovi;
    }

    public void setFajlovi(List<UpitFajl> fajlovi) {
        this.fajlovi = fajlovi;
    }

    @Column(length = 2000)
    private String opis;

    private boolean procitan = false;

    private LocalDateTime kreiranoU;

    @PrePersist
    public void prePersist() {
        this.kreiranoU = LocalDateTime.now();
    }
    

    public Long getId() { return id; }
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }
    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }
    public String getUsluga() { return usluga; }
    public void setUsluga(String usluga) { this.usluga = usluga; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public boolean isProcitan() { return procitan; }
    public void setProcitan(boolean procitan) { this.procitan = procitan; }
    public LocalDateTime getKreiranoU() { return kreiranoU; }
}