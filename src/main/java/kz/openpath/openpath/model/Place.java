package kz.openpath.openpath.model; // Убедитесь, что здесь ваш правильный путь

public class Place {
    private Long id;
    private String name;
    private double lat; // Широта
    private double lng; // Долгота
    private boolean hasRamp; // Есть ли пандус

    // Конструктор
    public Place(Long id, String name, double lat, double lng, boolean hasRamp) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.hasRamp = hasRamp;
    }

    // Геттеры (нужны Spring Boot для превращения объекта в JSON)
    public Long getId() { return id; }
    public String getName() { return name; }
    public double getLat() { return lat; }
    public double getLng() { return lng; }
    public boolean isHasRamp() { return hasRamp; }
}