# Game BGM

Drop looping background tracks here:

    public/sounds/bgm.mp3          # 67 Speed
    public/sounds/bgm-boxing.mp3   # Boxing Speed
    public/sounds/bgm-squad.mp3    # Squat Speed

Loaded by lib/gameFx.ts (Howler, loop, volume 0.35) while a game is PLAYING.
Each game passes its own path via useGameFx(state, countdown, bgmSrc).
Games run fine without the files — BGM just stays silent until they exist.
