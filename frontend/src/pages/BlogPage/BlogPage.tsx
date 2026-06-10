import styles from "./BlogPage.module.css";

function BlogPage() {
    return (
        <div className={styles.container}>
            {/* Заголовок */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <h1 className={styles.title}>Блог</h1>
                    <p className={styles.description}>
                        Полезные статьи и советы для владельцев домашних
                        животных
                    </p>
                </div>
            </section>

            {/* Статьи */}
            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    <div className={styles.articlesGrid}>
                        {/* Статья 1 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🐾</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    15.02.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Здоровье
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Как подготовить питомца к вакцинации
                            </h3>
                            <p className={styles.articlePreview}>
                                Вакцинация — важная процедура для здоровья
                                вашего питомца. Узнайте, как правильно
                                подготовить животное к прививке и что делать
                                после.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#вакцинация</span>
                                <span className={styles.tag}>#здоровье</span>
                                <span className={styles.tag}>#ветеринар</span>
                            </div>
                        </article>

                        {/* Статья 2 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🐶</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    10.02.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Уход
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Как правильно ухаживать за шерстью собаки
                            </h3>
                            <p className={styles.articlePreview}>
                                Регулярный уход за шерстью — залог здоровья и
                                красоты вашего питомца. Советы по выбору средств
                                и техники ухода для разных пород.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#уход</span>
                                <span className={styles.tag}>#груминг</span>
                                <span className={styles.tag}>#собаки</span>
                            </div>
                        </article>

                        {/* Статья 3 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🐱</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    05.02.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Питание
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Сбалансированное питание для кошек
                            </h3>
                            <p className={styles.articlePreview}>
                                Правильное питание — основа здоровья вашего
                                питомца. Рекомендации по выбору корма и
                                составлению рациона для кошек разных возрастов.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#питание</span>
                                <span className={styles.tag}>#корм</span>
                                <span className={styles.tag}>#кошки</span>
                            </div>
                        </article>

                        {/* Статья 4 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🏠</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    01.02.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Советы
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Как выбрать няню для животных
                            </h3>
                            <p className={styles.articlePreview}>
                                Уезжаете в отпуск и не знаете, кому доверить
                                питомца? Советы по выбору надёжной няни для
                                животных и что нужно обсудить заранее.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#няня</span>
                                <span className={styles.tag}>#уход</span>
                                <span className={styles.tag}>#отпуск</span>
                            </div>
                        </article>

                        {/* Статья 5 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🏥</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    25.01.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Здоровье
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Первые признаки болезни у питомцев
                            </h3>
                            <p className={styles.articlePreview}>
                                Как понять, что ваш питомец заболел? На какие
                                симптомы стоит обратить внимание и когда срочно
                                обратиться к ветеринару.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#здоровье</span>
                                <span className={styles.tag}>#симптомы</span>
                                <span className={styles.tag}>#ветеринар</span>
                            </div>
                        </article>

                        {/* Статья 6 */}
                        <article className={styles.articleCard}>
                            <div className={styles.articleImage}>🎓</div>
                            <div className={styles.articleMeta}>
                                <span className={styles.articleDate}>
                                    20.01.2026
                                </span>
                                <span className={styles.articleCategory}>
                                    Дрессировка
                                </span>
                            </div>
                            <h3 className={styles.articleTitle}>
                                Основные команды для собаки
                            </h3>
                            <p className={styles.articlePreview}>
                                Начинаем дрессировку с основных команд.
                                Пошаговое руководство по обучению собаки
                                командам "Сидеть", "Лежать", "Ко мне" и другим.
                            </p>
                            <div className={styles.articleTags}>
                                <span className={styles.tag}>#дрессировка</span>
                                <span className={styles.tag}>#команды</span>
                                <span className={styles.tag}>#собаки</span>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BlogPage;
