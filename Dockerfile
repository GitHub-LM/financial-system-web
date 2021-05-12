FROM node:15.11.0
RUN apt-get clean && apt-get update
RUN apt-get install -y nginx
WORKDIR /app
COPY . /app/
EXPOSE 80
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org \
&& cnpm install \
&& cnpm run build:prod \
&& cp -r dist/* /var/www/html \
&& rm -rf /app
CMD ["nginx","-g","daemon off;"]
