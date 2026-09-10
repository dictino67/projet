FROM nginx:alpine

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de l'application dans le serveur web
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Exposer le port 8088
EXPOSE 8088

# Démarrer nginx au démarrage du conteneur
CMD ["nginx", "-g", "daemon off;"]
