import { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import type { LostPet } from "../../types/pet";

interface MapProps {
    pets: LostPet[];
    onMarkerClick?: (pet: LostPet) => void;
    isPickingMode?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
}

declare global {
    interface Window {
        DG: any;
    }
}

function Map({
    pets,
    onMarkerClick,
    isPickingMode,
    onLocationSelect,
}: MapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Record<number, any>>({});
    const tempMarkerRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Инициализация карты
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!window.DG) {
            return;
        }

        try {
            mapRef.current = window.DG.map(mapContainerRef.current, {
                center: [69.3535, 88.2027],
                zoom: 13,
            });
            setIsLoaded(true);
        } catch (err) {
            console.error("❌ Ошибка инициализации карты:", err);
        }
    }, []);

    //
    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        if (isPickingMode) {
            mapRef.current.getContainer().style.cursor = "crosshair";
            setTimeout(() => mapRef.current?.invalidateSize(), 100);

            const handlePickClick = (e: any) => {
                const { lat, lng } = e.latlng;

                if (tempMarkerRef.current) {
                    mapRef.current.removeLayer(tempMarkerRef.current);
                }

                tempMarkerRef.current = window.DG.marker([lat, lng]).addTo(
                    mapRef.current,
                );

                if (onLocationSelect) {
                    onLocationSelect(lat, lng);
                }
            };

            mapRef.current.on("click", handlePickClick);

            return () => {
                mapRef.current.off("click", handlePickClick);
                mapRef.current.getContainer().style.cursor = "";
                if (tempMarkerRef.current) {
                    mapRef.current.removeLayer(tempMarkerRef.current);
                    tempMarkerRef.current = null;
                }
            };
        }
    }, [isPickingMode, isLoaded, onLocationSelect]);

    // Обновление маркеров при изменении списка объявлений
    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        const activePetIds = new Set(pets.map((p) => p.id));

        // Удаляем маркеры объявлений, которых больше нет в списке
        Object.keys(markersRef.current).forEach((idStr) => {
            const id = Number(idStr);
            if (!activePetIds.has(id)) {
                const marker = markersRef.current[id];
                try {
                    mapRef.current.removeLayer(marker);
                    console.log(`🗑️ Маркер ${id} удален с карты`);
                } catch (e) {
                    console.warn("Ошибка при удалении маркера", e);
                }
                delete markersRef.current[id];
            }
        });

        // Добавляем новые маркеры
        pets.forEach((pet) => {
            if (!pet.lat || !pet.long) return;

            const color = pet.status === "lost" ? "#ef4444" : "#10b981";

            const customIcon = window.DG.divIcon({
                className: "custom-marker",
                html: `
                <div style="
                    width: 32px;
                    height: 32px;
                    background: ${color};
                    border: 3px solid white;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "></div>
            `,
                iconSize: [32, 32],
                iconAnchor: [18, 32], // Низ маркера
                popupAnchor: [0, 16], // Попап над маркером
            });

            if (!markersRef.current[pet.id]) {
                const marker = window.DG.marker([pet.lat, pet.long], {
                    icon: customIcon,
                }).addTo(mapRef.current);

                marker.bindPopup(`
                    <div class="popup-card">
                        <div class="popup-header">
                            <span class="popup-name">${pet.name}</span>
                            <span class="popup-status ${pet.status === "lost" ? "status-lost" : "status-found"}">
                                ${pet.status === "lost" ? "🔴 ПРОПАЛ" : "🟢 НАЙДЕН"}
                            </span>
                        </div>
                        <div class="popup-details">
                            <div class="popup-detail">🐾 ${pet.description}</div>
                            <div class="popup-detail">📅 ${new Date(pet.date).toLocaleDateString("ru-RU")}</div>
                            <div class="popup-detail">📍 ${pet.city}</div>
                        </div>
                        <div class="popup-footer">
                            <button class="popup-btn" >
                                Подробнее →
                            </button>
                        </div>
                    </div>
                `);

                markersRef.current[pet.id] = marker;
            }
        });
    }, [pets, isLoaded, onMarkerClick]);

    return (
        <div className={styles.mapContainer}>
            <div ref={mapContainerRef} className={styles.map} />
        </div>
    );
}

export default Map;
