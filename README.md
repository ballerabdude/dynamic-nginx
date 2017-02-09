#Dynamic Nginx

#####This Docker image will allow you to dynamically set the reverse proxy address
  
###How to run

```docker run -it -p 8000:80 dynamic-nginx bash -c "node nginx-conf.js --listen 80 --location /my-new-location/ --proxy_pass http://192.168.99.101:8001/ --nginx_location /etc/nginx/nginx.conf && nginx -g 'daemon off;'"```
