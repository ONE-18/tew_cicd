FROM denoland/deno:alpine-1.45.5

WORKDIR /app

# Copiar configuración primero para mejor cacheo
COPY deno.json ./

# Copiar código fuente y archivos públicos
COPY src ./src
COPY public ./public

# Cachear dependencias como root (antes de cambiar usuario)
RUN deno cache src/main.ts

# Usar usuario no root por seguridad
USER deno

# Variables y puertos
ENV PORT=8000
EXPOSE 8000

# Comando por defecto
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/main.ts"]
