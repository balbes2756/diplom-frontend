import { useState } from "react";
// import { useParams } from "react-router-dom";
import styles from "./ServiceDetailPage.module.css";

function ServiceDetailPage() {
    // const { id: _id } = useParams();
    const [activeTab, setActiveTab] = useState<
        "about" | "services" | "reviews"
    >("about");

    return (
        <div className={styles.container}>
            {/* Шапка услуги */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.header}>
                        <div className={styles.avatar}>👨‍⚕️</div>
                        <div className={styles.headerInfo}>
                            <div className={styles.headerTitle}>
                                Доктор Иван Петров
                            </div>
                            <div className={styles.headerCategory}>
                                Ветеринар
                            </div>
                            <div className={styles.headerRating}>
                                ⭐ 4.9 (42 отзыва)
                            </div>
                        </div>
                        <button className={styles.orderButton}>
                            Заказать услугу
                        </button>
                    </div>
                </div>
            </section>

            {/* Табы */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "about" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("about")}>
                            Обо мне
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "services" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("services")}>
                            Услуги
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "reviews" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("reviews")}>
                            Отзывы
                        </button>
                    </div>

                    {/* Контент табов */}
                    <div className={styles.tabContent}>
                        {activeTab === "about" && (
                            <div className={styles.description}>
                                <p>
                                    Опытный ветеринарный врач с 10-летним стажем
                                    работы. Окончил Ветеринарную академию им.
                                    К.И. Скрябина в 2013 году. Проходил
                                    стажировку в ведущих клиниках Москвы и
                                    Санкт-Петербурга.
                                </p>
                                <p>
                                    Специализируюсь на терапии, хирургии и
                                    диагностике заболеваний у собак и кошек.
                                    Имею сертификаты по ультразвуковой и
                                    рентгенологической диагностике. Регулярно
                                    посещаю профильные конференции и семинары
                                    для повышения квалификации.
                                </p>
                                <p>
                                    Работаю как в клинике, так и выезжаю на дом.
                                    Имею собственный автомобиль, оборудованный
                                    для перевозки животных. Всегда стараюсь
                                    найти подход к каждому питомцу и его
                                    владельцу.
                                </p>
                            </div>
                        )}

                        {activeTab === "services" && (
                            <div className={styles.servicesList}>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        Консультация ветеринара
                                    </div>
                                    <div className={styles.servicePrice}>
                                        1500₽
                                    </div>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        Вакцинация комплексная
                                    </div>
                                    <div className={styles.servicePrice}>
                                        2500₽
                                    </div>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        Чипирование
                                    </div>
                                    <div className={styles.servicePrice}>
                                        2000₽
                                    </div>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        УЗИ брюшной полости
                                    </div>
                                    <div className={styles.servicePrice}>
                                        3000₽
                                    </div>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        Лечение инфекционных заболеваний
                                    </div>
                                    <div className={styles.servicePrice}>
                                        от 3500₽
                                    </div>
                                </div>
                                <div className={styles.serviceItem}>
                                    <div className={styles.serviceName}>
                                        Хирургические операции
                                    </div>
                                    <div className={styles.servicePrice}>
                                        от 5000₽
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className={styles.reviewsList}>
                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewAvatar}>
                                            👩
                                        </div>
                                        <div className={styles.reviewInfo}>
                                            <div
                                                className={styles.reviewAuthor}>
                                                Анна К.
                                            </div>
                                            <div className={styles.reviewDate}>
                                                15 января 2026
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.reviewRating}>
                                        ⭐⭐⭐⭐⭐
                                    </div>
                                    <div className={styles.reviewText}>
                                        Иван спас нашего кота! Приехал на дом в
                                        тот же день, когда я позвонила. Всё
                                        объяснил, назначил лечение. Кот пошёл на
                                        поправку уже через пару дней. Очень
                                        рекомендую!
                                    </div>
                                </div>

                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewAvatar}>
                                            👨
                                        </div>
                                        <div className={styles.reviewInfo}>
                                            <div
                                                className={styles.reviewAuthor}>
                                                Михаил П.
                                            </div>
                                            <div className={styles.reviewDate}>
                                                3 февраля 2026
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.reviewRating}>
                                        ⭐⭐⭐⭐⭐
                                    </div>
                                    <div className={styles.reviewText}>
                                        Делали вакцинацию собаке. Всё прошло
                                        быстро и без стресса для животного.
                                        Доктор очень спокойный, наш пёс даже не
                                        пикнул. Теперь только к Ивану!
                                    </div>
                                </div>

                                <div className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewAvatar}>
                                            👩
                                        </div>
                                        <div className={styles.reviewInfo}>
                                            <div
                                                className={styles.reviewAuthor}>
                                                Елена В.
                                            </div>
                                            <div className={styles.reviewDate}>
                                                20 февраля 2026
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.reviewRating}>
                                        ⭐⭐⭐⭐⭐
                                    </div>
                                    <div className={styles.reviewText}>
                                        Обратилась с проблемой у кошки. Иван
                                        провёл полную диагностику, включая УЗИ.
                                        Назначил правильное лечение, и кошка
                                        полностью выздоровела. Спасибо за
                                        профессионализм и заботу!
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ServiceDetailPage;
