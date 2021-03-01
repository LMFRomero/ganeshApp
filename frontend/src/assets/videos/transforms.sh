# Guia de comandos bash para otimizar o video

# Remover a trilha de audio do video original
ffmpeg -i clip_welcome_original.mp4 -c copy -an clip_welcome_video_only.mp4

# Diminuindo a resolução na metade para a versão Desktop
ffmpeg -i clip_welcome_video_only.mp4 -vf "scale=iw/2:ih/2" clip_welcome_desktop.mp4

# Diminuindo a resolução em 1/4 para a versão mobile
ffmpeg -i clip_welcome_video_only.mp4 -vf "scale=iw/4:ih/4" clip_welcome_mobile.mp4
