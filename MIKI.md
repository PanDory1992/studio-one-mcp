# Poprawki Mikiego (gałąź `miki-0.4`, na wersji 0.4.0)

Fork projektu [NeanderthalMan/studio-one-mcp](https://github.com/NeanderthalMan/studio-one-mcp) (licencja MIT, autor Adam Morgan). Gałąź `main` to oryginał. `miki-0.4` (od 13.11.2026, w użyciu) = wersja 0.4.0 + poprawki poniżej. `miki-poprawki` = stara wersja 0.3 z narzędziami `uszy_*` (Uszy już nieużywane, nie przeniesione).

## Co dodane
- **Kanały o tej samej nazwie** (`device/EditTasks/package/McpTrackEdit.js`, `McpTrackOps.js`, `device/StudioOneMCP/BridgeCore.js`): operacje na ścieżkach i kanałach rozróżniają kanały o identycznych nazwach (np. dwa „Pianino”), zamiast brać pierwszy z brzegu.
- `src/midi.js`: zmienna `STUDIO_ONE_MCP_BRIDGE_TCP` pozwala „dzwonić” do mostu przez lokalny TCP zamiast portu MIDI.
- `src/paths.js`: listy ścieżek w zmiennych środowiskowych dzielone separatorem systemu (na Windows `;`, bo `:` psuło `C:\`).
- `StudioOneMCP.surface.xml`: mapowanie `MusicTrackDevice` (ścieżka z fokusem).
- **Instalacja lokalna**: `install-local.mjs` + „Zainstaluj most.bat” instaluje urządzenie mostu do profilu Studio One 7 (`%APPDATA%\PreSonus\Studio One 7`, skrzynka `~/.studio-one-mcp/mailbox`, `allowEval`). Potem restart Studio One i aplikacji Claude.
- `agent-call.mjs`: bezpośrednie wywołanie narzędzia MCP z wiersza poleceń (`node agent-call.mjs live_status '{}'`), do testów bez klienta.

## Pułapki (Studio One 7)
- **Low Latency Monitoring musi być wyłączony**, inaczej wtyczki (w tym Uszy) dostają ciszę.
- Studio One nie może działać jako administrator (blokuje sterowanie).
- Aktualizacja z oryginału: `git fetch origin && git checkout miki-0.4 && git merge origin/main`, potem „Zainstaluj most.bat” i restart Studio One oraz aplikacji Claude.

## Gdzie to jest używane
Most jest uruchamiany przez nadzorcę z repozytorium routera (`keystation_supervisor.py`). Opis całego systemu: README w repozytorium routera.
