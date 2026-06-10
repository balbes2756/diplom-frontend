import { Map } from "../../components/Map";
import styles from "./MapPage.module.css";
import LostPetCard from "../../components/LostPetCard/LostPetCard";
import type { LostPet } from "../../types/pet";
import AddPetModal from "../../components/AddPetModal/AddPetModal";
import { useModalStore } from "../../store/useModalStore";
import type { PetForm } from "../../schemas/pet";
import type { PetStatus, PetType } from "../../types/pet";
import { useState, useMemo, useRef, useEffect } from "react";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

interface Filters {
    status: "all" | PetStatus;
    type: "all" | PetType;
    city: string;
}

function MapPage() {
    const { openAddPet, openLogin, isLoginOpen } = useModalStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [pets, setPets] = useState<LostPet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingAddPet, setPendingAddPet] = useState(false); // ← НОВОЕ

    const [isPickingMode, setIsPickingMode] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const mapSectionRef = useRef<HTMLElement>(null);
    const currentUserId = useAuthStore((state) => state.user?.id);

    const [filters, setFilters] = useState<Filters>({
        status: "all",
        type: "all",
        city: "all",
    });

    // Загрузка объявлений с бэкенда
    useEffect(() => {
        const fetchPets = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<LostPet[]>("/losts/");
                console.log("📍 Загружено объявлений:", response.length);
                setPets(response);
            } catch (error) {
                console.error("❌ Ошибка загрузки объявлений:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPets();
    }, []);

    // ✅ НОВОЕ: После успешного входа — автоматически открываем модалку создания
    useEffect(() => {
        if (isAuthenticated && pendingAddPet) {
            console.log(
                "✅ Пользователь авторизован — открываем модалку создания",
            );
            openAddPet();
            setPendingAddPet(false);
        }
    }, [isAuthenticated, pendingAddPet, openAddPet]);

    // ✅ НОВОЕ: Если модалка входа закрылась без входа — сбрасываем флаг
    useEffect(() => {
        if (!isLoginOpen && pendingAddPet && !isAuthenticated) {
            console.log(
                "🚫 Модалка входа закрыта без авторизации — сбрасываем флаг",
            );
            setPendingAddPet(false);
        }
    }, [isLoginOpen, pendingAddPet, isAuthenticated]);

    const uniqueCities = useMemo(() => {
        const cities = pets.map((p) => p.city).filter(Boolean);
        return [...new Set(cities)];
    }, [pets]);

    const filteredPets = useMemo(() => {
        return pets.filter((pet) => {
            const statusMatch =
                filters.status === "all" || pet.status === filters.status;
            const typeMatch =
                filters.type === "all" || pet.type === filters.type;
            const cityMatch =
                filters.city === "all" || pet.city === filters.city;
            return statusMatch && typeMatch && cityMatch;
        });
    }, [pets, filters]);

    const handleCardClick = (pet: LostPet) => {
        console.log("Клик по объявлению:", pet);
    };

    const handleLostClick = () => {
        if (!isAuthenticated) {
            console.log(
                "⚠️ Открываем модалку входа для создания объявления о пропаже",
            );
            setPendingAddPet(true);
            openLogin();
            return;
        }
        openAddPet("lost");
    };

    const handleFoundClick = () => {
        console.log("🔍 Открываем модалку создания объявления о находке");
        openAddPet("found");
    };

    const handlePetSubmit = async (data: PetForm) => {
        // Проверка авторизации только для "lost"
        if (data.status === "lost" && !isAuthenticated) {
            console.log("⚠️ Для объявления о пропаже требуется авторизация");
            setPendingAddPet(true);
            openLogin();
            return;
        }

        try {
            const announcementData = {
                name: data.name || "",
                type: data.type,
                status: data.status,
                description: data.description,
                date: data.date,
                city: data.city,
                district: null,
                lat: selectedCoords?.lat || null,
                lng: selectedCoords?.lng || null,
                image: data.image || null,
                contact_phone: data.contact_phone?.trim() || null,
            };

            console.log("📤 Отправляем на бэкенд:", announcementData);

            const newPet = await api.post<LostPet>("/losts/", announcementData);

            setPets((prev) => [newPet, ...prev]);
            setSelectedCoords(null);
            console.log("✅ Объявление создано:", newPet);
        } catch (error: any) {
            console.error("❌ Ошибка создания объявления:", error);

            if (
                error.message?.includes("401") ||
                error.message?.includes("Unauthorized")
            ) {
                // Если токен истёк при создании "lost" — открываем модалку входа
                if (data.status === "lost") {
                    console.log("⚠️ Токен истёк — открываем модалку входа");
                    setPendingAddPet(true);
                    openLogin();
                } else {
                    alert(
                        "⚠️ Срок действия сессии истёк. Пожалуйста, войдите снова.",
                    );
                }
            } else {
                alert(
                    `❌ ${error.message || "Произошла ошибка при создании объявления"}`,
                );
            }
        }
    };

    // ✅ Полное удаление объявления
    const handleDelete = async (id: number) => {
        if (!isAuthenticated) {
            alert("⚠️ Для удаления объявления необходимо авторизоваться");
            return;
        }

        if (!confirm("Удалить это объявление? Это действие нельзя отменить.")) {
            return;
        }

        try {
            console.log(`🗑️ Удаляем объявление #${id}`);
            await api.delete(`/losts/${id}`);

            // Удаляем из локального стейта
            setPets((prev) => prev.filter((pet) => pet.id !== id));
            console.log("✅ Объявление полностью удалено");
        } catch (error: any) {
            console.error("❌ Ошибка удаления:", error);

            if (error.message?.includes("403")) {
                alert("⚠️ Вы не можете удалить чужое объявление");
            } else if (
                error.message?.includes("401") ||
                error.message?.includes("Unauthorized")
            ) {
                alert(
                    "️ Срок действия сессии истёк. Пожалуйста, войдите снова.",
                );
            } else {
                alert(`❌ ${error.message || "Произошла ошибка при удалении"}`);
            }
        }
    };

    const handleMapPick = (lat: number, lng: number) => {
        console.log("📍 Выбраны координаты:", lat, lng);
        setSelectedCoords({ lat, lng });
        setIsPickingMode(false);
    };

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Заголовок */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h1 className={styles.title}>Карта пропавших питомцев</h1>
                    <p className={styles.description}>
                        Найдите пропавшее животное рядом с вами или добавьте
                        информацию
                    </p>
                </div>
            </section>

            {/* Карта */}
            <section
                ref={mapSectionRef}
                className={`${styles.mapSection} ${isPickingMode ? styles.mapFullscreen : ""}`}>
                <div className={styles.sectionContent}>
                    {!isPickingMode && (
                        <div className={styles.mapHeader}>
                            <h2 className={styles.mapTitle}>Карта пропаж</h2>
                            <div className={styles.buttonsWrapper}>
                                <button
                                    className={`${styles.addButton} ${styles.lostButton}`}
                                    onClick={handleLostClick}>
                                    Пропал
                                </button>
                                <button
                                    className={`${styles.addButton} ${styles.findButton}`}
                                    onClick={handleFoundClick}>
                                    Найден
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.mapWrapper}>
                        <Map
                            pets={filteredPets}
                            isPickingMode={isPickingMode}
                            onLocationSelect={handleMapPick}
                        />
                    </div>

                    {isPickingMode && (
                        <div className={styles.pickingOverlay}>
                            <div className={styles.pickingText}>
                                📍 Кликните по карте, чтобы указать место
                            </div>
                            <button
                                className={styles.cancelPickBtn}
                                onClick={() => setIsPickingMode(false)}>
                                Отмена
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Фильтры */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.filtersBar}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Статус:</span>
                            <select
                                className={styles.filterSelect}
                                value={filters.status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }>
                                <option value="all">Все</option>
                                <option value="lost">Пропал</option>
                                <option value="found">Найден</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>
                                Животное:
                            </span>
                            <select
                                className={styles.filterSelect}
                                value={filters.type}
                                onChange={(e) =>
                                    handleFilterChange("type", e.target.value)
                                }>
                                <option value="all">Все</option>
                                <option value="dog">Собака</option>
                                <option value="cat">Кошка</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Город:</span>
                            <select
                                className={styles.filterSelect}
                                value={filters.city}
                                onChange={(e) =>
                                    handleFilterChange("city", e.target.value)
                                }>
                                <option value="all">Все города</option>
                                {uniqueCities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Список объявлений */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h2 className={styles.sectionTitle}>
                        Объявления на карте ({filteredPets.length})
                    </h2>

                    {filteredPets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🐾</div>
                            <h3 className={styles.emptyTitle}>
                                {pets.length === 0
                                    ? "Пока нет объявлений"
                                    : "Ничего не найдено"}
                            </h3>
                            <p className={styles.emptyText}>
                                {pets.length === 0
                                    ? "Будьте первым — добавьте информацию о пропавшем или найденном питомце"
                                    : "Попробуйте изменить параметры фильтров"}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.petsGrid}>
                            {filteredPets.map((pet) => (
                                <LostPetCard
                                    key={pet.id}
                                    pet={pet}
                                    onClick={handleCardClick}
                                    currentUserId={currentUserId}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AddPetModal
                onSubmit={handlePetSubmit}
                initialCoords={selectedCoords}
                onRequestMapPick={() => setIsPickingMode(true)}
            />
        </div>
    );
}

export default MapPage;
