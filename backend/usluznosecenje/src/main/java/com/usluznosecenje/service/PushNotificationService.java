package com.usluznosecenje.service;

import com.usluznosecenje.model.PushSubscription;
import com.usluznosecenje.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final PushSubscriptionRepository repo;

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    public void saveSubscription(Map<String, Object> sub) {
        Map<String, String> keys = (Map<String, String>) sub.get("keys");
        PushSubscription ps = new PushSubscription();
        ps.setEndpoint((String) sub.get("endpoint"));
        ps.setP256dh(keys.get("p256dh"));
        ps.setAuth(keys.get("auth"));
        repo.save(ps);
    }

    public void sendToAll(String title, String body) {
        try {
            PushService pushService = new PushService(publicKey, privateKey, "mailto:tvoj@email.com");
            String payload = "{\"title\":\"" + title + "\",\"body\":\"" + body + "\"}";

            List<PushSubscription> subs = repo.findAll();
            for (PushSubscription sub : subs) {
                try {
                    Notification notif = new Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        payload.getBytes()
                    );
                    pushService.send(notif);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}