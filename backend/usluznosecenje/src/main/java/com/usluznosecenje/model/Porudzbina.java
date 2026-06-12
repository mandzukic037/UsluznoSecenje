package com.usluznosecenje.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "porudzbine")
public class Porudzbina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ime;
    private String prezime;
    private String email;
    private String telefon;
    private String firma;
    private String pib;

    private String adresa;
    private String grad;
    private String postBroj;
    private String nacinDostave;

    private String placanje;

    @Column(length = 1000)
    private String napomena;

    private double ukupnoBezPdv;
    private double pdv;
    private double ukupnoSaPdv;

    @Enumerated(EnumType.STRING)
    private StatusPorudzbine status;

    private LocalDateTime kreiranoU;

    @OneToMany(mappedBy = "porudzbina", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PorudzbineStavka> stavke;

    @PrePersist
    public void prePersist() {
        this.kreiranoU = LocalDateTime.now();
        if (this.status == null) this.status = StatusPorudzbine.NOVA;
    }

    public enum StatusPorudzbine {
        NOVA, U_OBRADI, POSLATA, OTKAZANA
    }

    public Long getId() { return id; }
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }
    public String getFirma() { return firma; }
    public void setFirma(String firma) { this.firma = firma; }
    public String getPib() { return pib; }
    public void setPib(String pib) { this.pib = pib; }
    public String getAdresa() { return adresa; }
    public void setAdresa(String adresa) { this.adresa = adresa; }
    public String getGrad() { return grad; }
    public void setGrad(String grad) { this.grad = grad; }
    public String getPostBroj() { return postBroj; }
    public void setPostBroj(String postBroj) { this.postBroj = postBroj; }
    public String getNacinDostave() { return nacinDostave; }
    public void setNacinDostave(String nacinDostave) { this.nacinDostave = nacinDostave; }
    public String getPlacanje() { return placanje; }
    public void setPlacanje(String placanje) { this.placanje = placanje; }
    public String getNapomena() { return napomena; }
    public void setNapomena(String napomena) { this.napomena = napomena; }
    public double getUkupnoBezPdv() { return ukupnoBezPdv; }
    public void setUkupnoBezPdv(double ukupnoBezPdv) { this.ukupnoBezPdv = ukupnoBezPdv; }
    public double getPdv() { return pdv; }
    public void setPdv(double pdv) { this.pdv = pdv; }
    public double getUkupnoSaPdv() { return ukupnoSaPdv; }
    public void setUkupnoSaPdv(double ukupnoSaPdv) { this.ukupnoSaPdv = ukupnoSaPdv; }
    public StatusPorudzbine getStatus() { return status; }
    public void setStatus(StatusPorudzbine status) { this.status = status; }
    public LocalDateTime getKreiranoU() { return kreiranoU; }
    public List<PorudzbineStavka> getStavke() { return stavke; }
    public void setStavke(List<PorudzbineStavka> stavke) { this.stavke = stavke; }
}