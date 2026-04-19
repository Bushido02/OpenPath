package kz.openpath.openpath.component;

import kz.openpath.openpath.model.Place;
import kz.openpath.openpath.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private PlaceRepository placeRepository;

    @Override
    public void run(String... args) throws Exception {
        if (placeRepository.count() < 500) {
            System.out.println("База пуста. Скачиваем данные (включая соборы и памятники)...");
            placeRepository.deleteAll();
            loadPlacesFromOSM();
        } else {
            System.out.println("В базе " + placeRepository.count() + " мест. База готова!");
        }
    }

    private void loadPlacesFromOSM() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://overpass-api.de/api/interpreter";

            // В запрос добавлены place_of_worship (храмы) и historic (памятники)
            String query = "[out:json][timeout:60];\n" +
                    "(\n" +
                    "  node(43.15,76.75,43.35,77.05)[\"amenity\"~\"pharmacy|hospital|clinic|dentist|restaurant|cafe|bank|place_of_worship\"];\n" +
                    "  node(43.15,76.75,43.35,77.05)[\"shop\"~\"supermarket|mall|convenience\"];\n" +
                    "  node(43.15,76.75,43.35,77.05)[\"tourism\"~\"museum|gallery|attraction|hotel\"];\n" +
                    "  node(43.15,76.75,43.35,77.05)[\"historic\"];\n" +
                    ");\n" +
                    "out body;";

            String response = restTemplate.postForObject(url, query, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode elements = mapper.readTree(response).path("elements");

            List<Place> placesToSave = new ArrayList<>();

            for (JsonNode node : elements) {
                JsonNode tags = node.path("tags");
                String name = tags.path("name").asText(null);

                if (name != null && !name.isEmpty()) {
                    double lat = node.path("lat").asDouble();
                    double lon = node.path("lon").asDouble();

                    String amenity = tags.path("amenity").asText("");
                    String shop = tags.path("shop").asText("");
                    String tourism = tags.path("tourism").asText("");
                    String historic = tags.path("historic").asText("");

                    String category = "landmark"; // По умолчанию

                    if (amenity.matches(".*(hospital|clinic|dentist).*")) {
                        category = "hospital";
                    } else if (amenity.matches(".*pharmacy.*")) {
                        category = "pharmacy";
                    } else if (amenity.matches(".*(restaurant|cafe|fast_food).*")) {
                        category = "food";
                    } else if (shop.matches(".*(supermarket|mall|convenience).*")) {
                        category = "shop";
                    } else if (amenity.equals("place_of_worship") || !tourism.isEmpty() || !historic.isEmpty()) {
                        category = "tourism"; // Храмы, музеи и памятники пойдут в Достопримечательности
                    }

                    placesToSave.add(new Place(name, lat, lon, category, "unknown"));
                }
            }

            placeRepository.saveAll(placesToSave);
            System.out.println("✅ УСПЕХ! Места и достопримечательности загружены: " + placesToSave.size());

        } catch (Exception e) {
            System.out.println("❌ Ошибка при скачивании данных: " + e.getMessage());
        }
    }
}