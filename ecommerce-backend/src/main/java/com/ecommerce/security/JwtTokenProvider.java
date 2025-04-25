package com.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:yourVeryLongSecretKeyWithAtLeast32Characters@}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationInMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String subject, String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        String token = Jwts.builder()
                .setSubject(subject)
                .claim("userId", userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        return token;
    }

    public String getShortUserIdFromToken(String token) {
        try {
            JwtParser parser = Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build();
            String subject = parser.parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return subject;
        } catch (JwtException e) {
            throw e;
        }
    }

    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .build();
            parser.parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}