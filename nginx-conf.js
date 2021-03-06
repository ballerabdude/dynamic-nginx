/**
 * Created by abdulhagi on 2/9/17.
 */
let argv = require('minimist')(process.argv.slice(2));
let fs = require('fs')
let NginxConfFile = require('nginx-conf').NginxConfFile;
let config = argv;

NginxConfFile.create('nginx.tmp.conf', (err, conf) => {

  //don't write to disk when something changes
  conf.die('nginx.tmp.conf');
  //write to a different file
  conf.live(config.nginx_location || 'nginx.conf');

  conf.nginx.http._add('server');
  conf.nginx.http.server._add('listen', config.listen);
  conf.nginx.http.server._add('location', config.location);
  conf.nginx.http.server.location._add('proxy_pass', config.proxy_pass);

  conf.nginx.http.server._add('location', '/');
  conf.nginx.http.server.location[1]._add('proxy_pass', config.proxy_pass);
  conf.nginx.http.server.location[1]._add('proxy_redirect', 'off');
  conf.nginx.http.server.location[1]._add('proxy_set_header', 'Host $host');
  conf.nginx.http.server.location[1]._add('proxy_set_header', 'X-Real-IP $remote_addr');
  conf.nginx.http.server.location[1]._add('proxy_set_header', 'X-Forwarded-For $proxy_add_x_forwarded_for');
  conf.nginx.http.server.location[1]._add('proxy_set_header', 'X-Forwarded-Host $server_name');


  conf.on('flushed', function() {

    console.log('finished writing to disk.....\n',config.nginx_location || 'nginx.conf', '\n');
    fs.readFile(config.nginx_location || 'nginx.conf', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });
  });


});