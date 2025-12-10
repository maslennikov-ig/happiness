import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Happiness',
  description: 'Политика конфиденциальности программы трансформации Happiness',
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Privacy Policy Page
 *
 * Russian 152-ФЗ compliant privacy policy page.
 * Covers personal data collection, processing, and user rights.
 */
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gold-text hover:text-gold-primary transition-colors mb-8"
        >
          <span aria-hidden="true">←</span>
          <span>На главную</span>
        </Link>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-8">
          Политика конфиденциальности
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8 text-text-secondary">
          <p className="text-sm text-text-muted">
            Последнее обновление: 1 января 2024 г.
          </p>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              1. Общие положения
            </h2>
            <p>
              Настоящая Политика конфиденциальности (далее — Политика) определяет
              порядок обработки и защиты персональных данных пользователей сайта
              happiness.example.com (далее — Сайт).
            </p>
            <p>
              Использование Сайта означает безоговорочное согласие пользователя с
              настоящей Политикой и указанными в ней условиями обработки его
              персональных данных.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              2. Персональные данные
            </h2>
            <p>Под персональными данными понимается следующая информация:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Имя пользователя</li>
              <li>Контактные данные (телефон, email, Telegram)</li>
              <li>Содержание сообщений, отправленных через формы на Сайте</li>
              <li>Технические данные (IP-адрес, cookies, данные браузера)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              3. Цели сбора данных
            </h2>
            <p>Персональные данные собираются для следующих целей:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Обработка заявок и обращений пользователей</li>
              <li>Связь с пользователями по вопросам оказания услуг</li>
              <li>Улучшение качества Сайта и предоставляемых услуг</li>
              <li>Соблюдение требований законодательства РФ</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              4. Обработка данных
            </h2>
            <p>
              Обработка персональных данных осуществляется в соответствии с
              Федеральным законом от 27.07.2006 N 152-ФЗ «О персональных данных».
            </p>
            <p>
              Оператор принимает необходимые организационные и технические меры для
              защиты персональных данных от неправомерного или случайного доступа,
              уничтожения, изменения, блокирования, копирования, распространения.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              5. Передача данных третьим лицам
            </h2>
            <p>
              Персональные данные пользователей не передаются третьим лицам, за
              исключением следующих случаев:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Пользователь выразил согласие на передачу данных</li>
              <li>Передача предусмотрена законодательством РФ</li>
              <li>
                Передача необходима для оказания услуг пользователю
                (например, уведомления через Telegram)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              6. Права пользователя
            </h2>
            <p>Пользователь имеет право:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Получить информацию о своих персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Обжаловать действия оператора в Роскомнадзоре</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              7. Cookies
            </h2>
            <p>
              Сайт использует cookies для улучшения пользовательского опыта.
              Cookies — это небольшие текстовые файлы, которые сохраняются на
              устройстве пользователя.
            </p>
            <p>
              Пользователь может отключить cookies в настройках браузера, однако
              это может повлиять на функциональность Сайта.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              8. Контактная информация
            </h2>
            <p>
              По вопросам, связанным с обработкой персональных данных, вы можете
              обратиться через{' '}
              <a
                href="https://t.me/username"
                className="text-gold-text hover:text-gold-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-text-primary mt-8 mb-4">
              9. Изменения Политики
            </h2>
            <p>
              Оператор вправе вносить изменения в настоящую Политику. Актуальная
              версия Политики всегда доступна на данной странице.
            </p>
            <p>
              Продолжение использования Сайта после внесения изменений означает
              согласие пользователя с новой редакцией Политики.
            </p>
          </section>
        </div>

        {/* Footer link */}
        <div className="mt-16 pt-8 border-t border-bg-muted">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold-text hover:text-gold-primary transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Вернуться на главную</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
