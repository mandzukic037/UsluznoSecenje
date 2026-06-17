package com.usluznosecenje.service;

import com.usluznosecenje.model.Porudzbina;
import com.usluznosecenje.model.Product;
import com.usluznosecenje.repository.PorudzbineRepository;
import com.usluznosecenje.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PorudzbineRepository porudzbineRepository;
    private final ProductRepository productRepository;

    // --- PORUDZBINE ---

    public List<Porudzbina> getAllPorudzbine() {
        return porudzbineRepository.findAllByOrderByKreiranoUDesc();
    }

    public Porudzbina updateStatus(Long id, String status) {
        Porudzbina p = porudzbineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Porudžbina nije pronađena: " + id));
        p.setStatus(Porudzbina.StatusPorudzbine.valueOf(status));
        return porudzbineRepository.save(p);
    }

    public void deletePorudzbina(Long id) {
        porudzbineRepository.deleteById(id);
    }

    // --- PRODUCTS ---

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proizvod nije pronađen: " + id));
        p.setTitle(updated.getTitle());
        p.setCategory(updated.getCategory());
        p.setPrice(updated.getPrice());
        p.setImage(updated.getImage());
        p.setDescription(updated.getDescription());
        p.setMaterial(updated.getMaterial());
        p.setThickness(updated.getThickness());
        return productRepository.save(p);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // --- STATS ---

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Porudzbina> sve = porudzbineRepository.findAll();

        long ukupnoPorudzbina = sve.size();
        long nove = sve.stream().filter(p -> p.getStatus() == Porudzbina.StatusPorudzbine.NOVA).count();
        long uObradi = sve.stream().filter(p -> p.getStatus() == Porudzbina.StatusPorudzbine.U_OBRADI).count();
        long poslate = sve.stream().filter(p -> p.getStatus() == Porudzbina.StatusPorudzbine.POSLATA).count();
        long otkazane = sve.stream().filter(p -> p.getStatus() == Porudzbina.StatusPorudzbine.OTKAZANA).count();

        double ukupanPromet = sve.stream()
                .filter(p -> p.getStatus() != Porudzbina.StatusPorudzbine.OTKAZANA)
                .mapToDouble(Porudzbina::getUkupnoSaPdv)
                .sum();

        stats.put("ukupnoPorudzbina", ukupnoPorudzbina);
        stats.put("nove", nove);
        stats.put("uObradi", uObradi);
        stats.put("poslate", poslate);
        stats.put("otkazane", otkazane);
        stats.put("ukupanPromet", ukupanPromet);
        stats.put("ukupnoProizvoda", productRepository.count());

        return stats;
    }

    public void bulkUpdateStatus(List<Long> ids, String status) {
        Porudzbina.StatusPorudzbine st = Porudzbina.StatusPorudzbine.valueOf(status);
        List<Porudzbina> porudzbine = porudzbineRepository.findAllById(ids);
        porudzbine.forEach(p -> p.setStatus(st));
        porudzbineRepository.saveAll(porudzbine);
    }

    public Map<String, Object> getProductStats() {
        List<Porudzbina> sve = porudzbineRepository.findAll();
        Map<String, Double> prometPoProizvodu = new HashMap<>();
        Map<String, Integer> kolicinaPoProizvodu = new HashMap<>();

        for (Porudzbina p : sve) {
            if (p.getStatus() == Porudzbina.StatusPorudzbine.OTKAZANA) continue;
            for (var s : p.getStavke()) {
                prometPoProizvodu.merge(s.getNaziv(), s.getCena() * s.getKolicina(), Double::sum);
                kolicinaPoProizvodu.merge(s.getNaziv(), s.getKolicina(), Integer::sum);
            }
        }

        Map<String, Double> kupciPromet = new HashMap<>();
        for (Porudzbina p : sve) {
            if (p.getStatus() == Porudzbina.StatusPorudzbine.OTKAZANA) continue;
            String kupac = p.getIme() + " " + p.getPrezime();
            kupciPromet.merge(kupac, p.getUkupnoSaPdv(), Double::sum);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("prometPoProizvodu", prometPoProizvodu);
        result.put("kolicinaPoProizvodu", kolicinaPoProizvodu);
        result.put("topKupci", kupciPromet);
        return result;
    }
}