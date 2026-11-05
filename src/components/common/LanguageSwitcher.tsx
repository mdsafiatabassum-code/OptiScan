import { Globe } from 'lucide-react';
import { LANGUAGES, type Language } from '@/lib/translations';
import { useI18n } from '@/lib/i18n';
import { cx } from '@/lib/classNames';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n();

  return (
    <div className={cx('flex items-center gap-1.5', compact ? 'flex-wrap' : '')}>
      <Globe className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
      <div role="group" aria-label="Language selection" className="flex items-center gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code as Language)}
            aria-pressed={language === lang.code}
            className={cx(
              'focus-ring rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
              language === lang.code
                ? 'bg-primary-400/15 text-primary-200 ring-1 ring-inset ring-primary-300/30'
                : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100',
            )}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
