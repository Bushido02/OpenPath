package kz.openpath.openpath.controller;

import kz.openpath.openpath.model.Place;
import kz.openpath.openpath.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    @Autowired
    private PlaceRepository placeRepository;

    // Этот метод отдает точки на карту
    @GetMapping
    public List<Place> getAllPlaces() {
        // Достаем все 1950 мест из базы H2 и отправляем их в index.html
        return placeRepository.findAll();
    }

    // Этот метод позволяет сохранять твои оценки входов (модальное окно)
    @PostMapping
    public Place savePlace(@RequestBody Place place) {
        return placeRepository.save(place);
    }
}