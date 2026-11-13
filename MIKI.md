# Poprawki Mikiego (gałąź `miki-poprawki`)

Fork projektu [NeanderthalMan/studio-one-mcp](https://github.com/NeanderthalMan/studio-one-mcp) (licencja MIT, autor Adam Morgan). Gałąź `main` to oryginał; zmiany są tylko w gałęzi `miki-poprawki`.

## Co dodane
- **Narzędzia `uszy_*`** (`src/uszy.js`, rejestracja w `src/server.js`): rozmowa z wtyczką VST3 **Uszy** (pomiar głośności LUFS i wzmocnienie na kanale) przez pliki w `%LOCALAPPDATA%\CodexPedalModes\uszy\`:
  - `uszy_status`: lista instancji Uszy i ich pomiary,
  - `uszy_measure`: pomiar w zadanym czasie,
  - `uszy_level`: bieżący poziom,
  - `uszy_set_gain`: ustawienie wzmocnienia (dB),
  - `uszy_name`: nadanie nazwy instancji (kanałowi).
  Źródła wtyczki Uszy: repozytorium routera, folder `uszy-plugin/zrodla`.
- **Kanały o tej samej nazwie** (`device/EditTasks/package/McpTrackEdit.js`, `McpTrackOps.js`, `device/StudioOneMCP/BridgeCore.js`): operacje na ścieżkach i kanałach rozróżniają kanały o identycznych nazwach (np. dwa „Pianino”), zamiast brać pierwszy z brzegu.
- `src/midi.js`, `src/paths.js`: ścieżki i porty MIDI pod konfigurację tego komputera.
- **Instalacja lokalna**: `install-local.mjs` + „Zainstaluj most.bat” instaluje urządzenie mostu do profilu Studio One 7 (`%APPDATA%\PreSonus\Studio One 7`, skrzynka `~/.studio-one-mcp/mailbox`, `allowEval`). Potem restart Studio One i aplikacji Claude.
- `agent-call.mjs`: bezpośrednie wywołanie narzędzia MCP z wiersza poleceń (`node agent-call.mjs live_status '{}'`), do testów bez klienta.

## Pułapki (Studio One 7)
- **Low Latency Monitoring musi być wyłączony**, inaczej wtyczki (w tym Uszy) dostają ciszę.
- Studio One nie może działać jako administrator (blokuje sterowanie).
- Po aktualizacji z oryginału: `git checkout miki-poprawki && git merge main`, potem „Zainstaluj most.bat”.

## Gdzie to jest używane
Most jest uruchamiany przez nadzorcę z repozytorium routera (`keystation_supervisor.py`). Opis całego systemu: README w repozytorium routera.
