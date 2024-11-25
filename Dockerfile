FROM ubuntu:latest
USER root
WORKDIR /home/app/
COPY ./node /home/app/
COPY ./client/ /home/client
RUN apt update
RUN apt-get -y install build-essential
RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN apt-get -y install python3
#RUN alias python=python3
RUN ln -s /usr/bin/python3 /usr/bin/python && \
    ln -s /usr/bin/pip3 /usr/bin/pip
#RUN npm install
RUN cat default_configuration_command.txt | make all

WORKDIR /home/client/client/
RUN  npm install
RUN npm run build -- --base-href /v2/

WORKDIR /home/app/
#RUN make configureSql
#RUN make createDefaultAdmin
EXPOSE 4656
ENTRYPOINT ./entrypoint.sh
