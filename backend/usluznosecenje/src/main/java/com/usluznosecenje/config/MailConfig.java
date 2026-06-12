package com.usluznosecenje.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    // Fallback JavaMailSender koji ne pada aplikaciju
    // kad SMTP kredencijali nisu postavljeni.
    // Kad postaviš prave kredencijale, Spring Boot automatski
    // koristi svoje auto-configured sendere umesto ovog.
    @Bean
    @ConditionalOnProperty(
        name = "spring.mail.username",
        havingValue = "your-email@gmail.com"
    )
    public JavaMailSender fallbackMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("localhost");
        sender.setPort(25);
        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.connectiontimeout", "1000");
        props.put("mail.smtp.timeout", "1000");
        return sender;
    }
}