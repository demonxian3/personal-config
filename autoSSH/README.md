# auto-ssh-login
Automatic login SSH by no-password or direct pasting password

[中文文档](https://github.com/demonxian3/auto-ssh-login/blob/master/README-CN.md)

### Environmental description
- Dowload Script
``` bash
git clone https://github.com/demonxian3/auto-ssh-login.git
```

- Language Installation:
Python(version 2.7) needs to be installed.

- In Windows

``` bash
pip install PyYAML
pip install pyperclip
```

Automatic interactive login depends on `pexpect`, but this module has poor support for windows.
Another way, we can automatic copy password by using `pyperclip`
Users only need to paste password directly and press <Enter> key to login to the shell after execute `auto_ssh serv`.
By the way, In order to use the SSH command, you need to run on `mintty` in Windows, such as git-bash.


- In Linux

``` bash
pip install PyYAML
pip install pexpect
```

In Linux, SSH interaction can be automatically logged in using pexpect.
The script fixed the problem of window size. 


### Account Configuration

The configuration file use [YAML](https://yaml.org/) syntax
- Configuration format:

``` yaml
name:
    host: (string) ip_address
    user: (string) login_username
    pass: (string) login_password
    port: (number) server_port
    serv: (string) protocal
```

Default is necessary if the configuration file does not want to write SSH usernames and ports.

- Config example: 

`server.yaml:`
``` yaml
#SSH
CN-192:
  host: 63.101.5.192
  pass: your_paswd!@#

#RDP
US-154:
  host: 33.47.65.154:9588
  user: administrator
  pass: '!@#yourpasswd'
  serv: rdp
  exec: start mstsc.exe

#Necessary
default: 
  host: 127.0.0.1
  port: 22
  pass: 123456
  user: root
  serv: ssh
```

> vim \`which server\`      

*windows*   
```python
config = "C:\Program Files\Git\etc\server.yaml";
```

*linux*  
```python   
config = "/etc/server.yaml";
```

### How to use
- list server
``` bash
autossh 
```
> CN-192   
> US-154   
> default   


- login server
``` bash
autossh CN-192
```

- upload file to server:/tmp
``` bash
autossh CN-192 up source.rar
```


- download file from server
``` bash
autossh US-154 dn :/root/source.tgz 
```
