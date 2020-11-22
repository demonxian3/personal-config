# 自动SSH登陆
可以不输密码(linux)或者免复制直接粘贴密码(windows)，来自动登陆ssh


[English Doc](https://github.com/demonxian3/auto-ssh-login/blob/master/README.md)

### 环境说明
- 下载脚本
``` bash
git clone https://github.com/demonxian3/auto-ssh-login.git
```

- 语言安装:
需要安装 [Python](https://python.org) (version 2.7) 

- Windows下:
需要安装两个模块:
``` bash
pip install PyYAML
pip install pyperclip
```
自动交互登陆需要依赖 `pexpect`，这个模块在windows上很难装，支持性不太好，所以只能用自动复制密码来替代了，运行`auto_ssh serv`后会自动复制密码，执行要粘贴回车即可登陆。
另外ssh不是DOS自带的命令，需要装个linux bash环境，比如mintty的git-bash


- Linux下
需要安装两个模块:
``` bash
pip install PyYAML
pip install pexpect
```
linux 下采用pexpect实现自动交互，并且修复窗口大小固定的问题


### 账户配置

配置文件采用 [YAML](https://yaml.org) 语法:

- 配置格式

``` yaml
服务名称: 
    host: (string) IP地址
    user: (string) 用户名
    pass: (string) 密码
    port: (number) 端口号 
    serv: (string) 协议
```

如果不想配置那么多，可以配置一个默认项。

- 配置举例

文件 `/etc/server.yaml:`

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

#如果上面端口省略，这个配置是必须的
default: 
  host: 127.0.0.1
  port: 22
  pass: 123456
  user: root
  serv: ssh
```

- 确保配置文件导入正确

> vim \`which server\`      

*windows*   
```python
config = "C:\Program Files\Git\etc\server.yaml";
```

*linux*  
```python   
config = "/etc/server.yaml";
```

### 使用
- 显示所有配置项
``` bash
autossh 
```
> CN-192   
> US-154     
> default   


- 登陆SSH服务器
``` bash
autossh CN-192
```

- 上传文件到服务器的/tmp下
``` bash
autossh CN-192 up source.rar
```


- 从服务上下载文件到当前
``` bash
autossh US-154 dn :/root/source.tgz 
```
