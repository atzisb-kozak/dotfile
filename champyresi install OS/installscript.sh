#!/bin/bash

cd /home/pi/Desktop
sudo apt-get update && sudo apt-get upgrade -y 
sudo apt-get install npm mariadb-server xscreensaver firefox-esr -y
git clone https://gitlab.com/morback974/champyresi.git && cd champyresi
npm install 
sudo mysql --user=root << EOF
update user set authentication_string=password(''), plugin='mysql_native_password' where user='root';
update user set password='' where user='root';
flush privileges;
EOF
sudo mysql --user=root << EOF
create database if not exists champyresi;
EOF

