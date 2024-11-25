FROM ubuntu:latest
USER root
WORKDIR /home/app
COPY . /home/app/

RUN apt update
RUN apt-get -y install build-essential
RUN apt-get -y install nodejs
RUN apt-get -y install npm
#RUN apt-get -y install python3
#RUN alias python=python3
#RUN ln -s /usr/bin/python3 /usr/bin/python && \
#    ln -s /usr/bin/pip3 /usr/bin/pip
RUN npm install
#RUN cat default_configuration_command.txt | make all
#RUN make configureSql
#RUN make createDefaultAdmin
EXPOSE 4200
ENTRYPOINT ./entrypoint.sh
