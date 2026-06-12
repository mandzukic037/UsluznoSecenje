package com.usluznosecenje.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private double price;
    private String image;

    @Column(length = 1000)
    private String description;

    private String material;
    private String thickness;

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getThickness() { return thickness; }
    public void setThickness(String thickness) { this.thickness = thickness; }
}