// Mimic i18next interfaces for translations
interface ResourceStore {
    [language: string]: ResourceStoreLanguage;
}

interface ResourceStoreLanguage {
    [namespace: string]: ResourceStoreKey;
}

interface ResourceStoreKey {
    [key: string]: string;
}

const resources: ResourceStore = {
    en: {
        translation: {
            editorPlaceholder: "Please select text for proofreading",

            stopWord: "stop word",
            stopWord_plural: "stop words",

            scoreText: "Glvrd point",
            scoreText_plural: "Glvrd points",

            byGlvrdScale: "out of 10",
            openInGlvrd: "Open in Glvrd",

            about: "About",
            aboutUrl: "./pages/about_en.html"
        }
    },
    ru: {
        translation: {
            editorPlaceholder: "Выделите текст для проверки",

            stopWord_0: "стоп-слово",
            stopWord_1: "стоп-слова",
            stopWord_2: "стоп-слов",

            scoreText: "балла из 10",
            scoreText_0: "балл из 10",
            scoreText_1: "балла из 10",
            scoreText_2: "баллов из 10",

            byGlvrdScale: "по шкале Главреда",
            openInGlvrd: "Открыть в Главреде",

            about: "О программе",
            aboutUrl: "./pages/about_ru.html"
        }
    }
};

export default resources;