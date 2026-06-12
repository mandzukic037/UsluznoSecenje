package com.usluznosecenje.model;

import jakarta.persistence.*;

@Entity
@Table(name = "porudzbine_stavke")
public class PorudzbineStavka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String naziv;
    private int kolicina;
    private double cena;

    @ManyToOne
    @JoinColumn(name = "porudzbina_id")
    private Porudzbina porudzbina;

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    public int getKolicina() { return kolicina; }
    public void setKolicina(int kolicina) { this.kolicina = kolicina; }
    public double getCena() { return cena; }
    public void setCena(double cena) { this.cena = cena; }
    public Porudzbina getPorudzbina() { return porudzbina; }
    public void setPorudzbina(Porudzbina porudzbina) { this.porudzbina = porudzbina; }
}