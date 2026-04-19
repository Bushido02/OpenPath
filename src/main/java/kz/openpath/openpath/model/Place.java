package kz.openpath.openpath.model;

import jakarta.persistence.*;

@Entity
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double lat;
    private double lng;
    private String category;
    private String accessLevel;

    public Place() {}

    public Place(String name, double lat, double lng, String category, String accessLevel) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.category = category;
        this.accessLevel = accessLevel;
    }

    // ВАЖНО: Геттеры и Сеттеры обязательны, чтобы браузер увидел данные!
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAccessLevel() { return accessLevel; }
    public void setAccessLevel(String accessLevel) { this.accessLevel = accessLevel; }
}