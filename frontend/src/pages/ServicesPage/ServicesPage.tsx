import { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import { SERVICES_DATA } from "../../trashCan/services";
import type { Service } from "../../types/service";
import styles from "./ServicesPage.module.css";

function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            // Имитация загрузки (потом замените на fetch)
            await new Promise((resolve) => setTimeout(resolve, 500));
            setServices(SERVICES_DATA);
            setLoading(false);
        };
        loadServices();
    }, []);

    const handleCardClick = (service: Service) => {
        console.log("Клик по услуге:", service);
        // TODO: Переход на страницу услуги
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка услуг...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Заголовок */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h1 className={styles.title}>Каталог услуг</h1>
                    <p className={styles.description}>
                        Найдите подходящего специалиста для вашего питомца
                    </p>
                </div>
            </section>

            {/* Поиск и фильтры */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersContainer}>
                            {/* Строка поиска */}
                            <div className={styles.searchContainer}>
                                <div className={styles.searchIcon}>🔍</div>
                                <input
                                    type="text"
                                    placeholder="Поиск услуг, специалистов..."
                                    className={styles.searchInput}
                                />
                                <button className={styles.searchButton}>
                                    Найти
                                </button>
                            </div>

                            {/* Фильтры */}
                            <div className={styles.filters}>
                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>
                                        Категория:
                                    </label>
                                    <select className={styles.filterSelect}>
                                        <option>Все категории</option>
                                        <option>Ветеринары</option>
                                        <option>Грумеры</option>
                                        <option>Дрессировщики</option>
                                        <option>Няни для животных</option>
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>
                                        Цена:
                                    </label>
                                    <select className={styles.filterSelect}>
                                        <option>Любая</option>
                                        <option>До 1000₽</option>
                                        <option>1000₽ - 3000₽</option>
                                        <option>От 3000₽</option>
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>
                                        Рейтинг:
                                    </label>
                                    <select className={styles.filterSelect}>
                                        <option>Любой</option>
                                        <option>От 4.0 ⭐</option>
                                        <option>От 4.5 ⭐</option>
                                        <option>5.0 ⭐</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Сетка услуг */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.servicesGrid}>
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ServicesPage;
