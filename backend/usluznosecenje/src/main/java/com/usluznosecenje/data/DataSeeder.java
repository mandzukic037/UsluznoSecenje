package com.usluznosecenje.data;

import com.usluznosecenje.model.Product;
import com.usluznosecenje.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        Product p1 = new Product();
        p1.setTitle("Lasersko sečenje lima");
        p1.setCategory("Lasersko sečenje");
        p1.setPrice(1500.0);
        p1.setImage("/images/lasersko-secenje.jpg");
        p1.setDescription("Precizno lasersko sečenje metalnih limova po meri.");
        p1.setMaterial("Čelik, inox, aluminijum");
        p1.setThickness("0.5mm - 20mm");

        Product p2 = new Product();
        p2.setTitle("CNC savijanje");
        p2.setCategory("CNC savijanje");
        p2.setPrice(2000.0);
        p2.setImage("/images/cnc-savijanje.jpg");
        p2.setDescription("CNC savijanje metalnih profila i limova.");
        p2.setMaterial("Čelik, aluminijum");
        p2.setThickness("1mm - 10mm");

        Product p3 = new Product();
        p3.setTitle("Lasersko graviranje");
        p3.setCategory("Graviranje");
        p3.setPrice(800.0);
        p3.setImage("/images/graviranje.jpg");
        p3.setDescription("Lasersko graviranje logotipa, natpisa i ornamenata.");
        p3.setMaterial("Metal, drvo, plastika");

        Product p4 = new Product();
        p4.setTitle("CAD projektovanje");
        p4.setCategory("CAD Design");
        p4.setPrice(3000.0);
        p4.setImage("/images/cad.jpg");
        p4.setDescription("Izrada tehničke dokumentacije i 2D/3D crteža po zahtevu.");

        productRepository.saveAll(List.of(p1, p2, p3, p4));
    }
}