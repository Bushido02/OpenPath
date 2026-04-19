package kz.openpath.openpath.repository;

import kz.openpath.openpath.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    // Умный поиск точек только внутри видимого экрана (Bounding Box)
    List<Place> findByLatBetweenAndLngBetween(double minLat, double maxLat, double minLng, double maxLng);
}