package kz.openpath.openpath.controller; // Ваш путь

import kz.openpath.openpath.model.Place;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController // Говорим Spring, что это REST API
@RequestMapping("/api/places") // Базовый URL для запросов
public class PlaceController {

    // Когда карта запросит /api/places, этот метод отдаст список мест
    @GetMapping
    public List<Place> getAllPlaces() {
        // Пока мы не подключили базу данных, отдаем тестовый список
        return Arrays.asList(
                new Place(1L, "Центральная Аптека", 43.2389, 76.8897, true),
                new Place(2L, "Магазин у дома", 43.2400, 76.8920, false),
                new Place(3L, "Городская поликлиника", 43.2350, 76.8850, true)
        );
    }
}