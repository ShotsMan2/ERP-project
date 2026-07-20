from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class Translator:
    def __init__(self, locale_dir: str | Path | None = None) -> None:
        self._locale_dir = Path(locale_dir) if locale_dir else Path(__file__).resolve().parent.parent.parent.parent / "locales"
        self._translations: dict[str, dict[str, str]] = {}
        self._current_locale: str = "en"

    def set_locale(self, locale: str) -> None:
        self._current_locale = locale

    def get_locale(self) -> str:
        return self._current_locale

    def _load_translations(self, locale: str) -> dict[str, str]:
        if locale in self._translations:
            return self._translations[locale]
        locale_file = self._locale_dir / f"{locale}.json"
        if locale_file.exists():
            with open(locale_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            self._translations[locale] = self._flatten_dict(data)
        else:
            self._translations[locale] = {}
        return self._translations[locale]

    def _flatten_dict(self, d: dict[str, Any], parent_key: str = "") -> dict[str, str]:
        items: dict[str, str] = {}
        for k, v in d.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            if isinstance(v, dict):
                items.update(self._flatten_dict(v, new_key))
            else:
                items[new_key] = str(v)
        return items

    def translate(self, key: str, locale: str | None = None, **kwargs: Any) -> str:
        locale = locale or self._current_locale
        translations = self._load_translations(locale)
        message = translations.get(key, key)
        if kwargs:
            try:
                message = message.format(**kwargs)
            except KeyError:
                pass
        return message

    def __call__(self, key: str, **kwargs: Any) -> str:
        return self.translate(key, **kwargs)


_default_translator = Translator()


def t(key: str, **kwargs: Any) -> str:
    return _default_translator.translate(key, **kwargs)
