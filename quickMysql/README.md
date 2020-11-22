# mqs
MYSQL Quick Execution Script
1. You can execute SQL statements directly on the command line .   
2. You don't need to enter a password after you configure it once .  
3. You can modify the script yourself and add more SQL statements .  
4. Lazy Manipulation and Color Display .  



MYSQL 快速执行脚本:
配置一次账号密码后，可直接在命令行上运行SQL语句   
也可以自己编辑脚本添加SQL语句，设有懒人操作和色彩展示   

### 0x00 配置账号 ( Account Configuration )

``` bash
vim `which mqs`
```

Modify the following three variables:   
修改下面三个变量即可:       

> username=root  
> password=your_password  
> database=default_database   



### 0x01 常用操作 （Common Operations）  

*1. select @@version*
``` bash
mqs -ver
```   

<br>

*2. show database | nl*  
``` bash
mqs -sd 
```
or
``` bash
mqs -d
```    

<br>

*3. use mysql; show tables | nl*
``` bash
mqs -st
```
or   
``` bash
mqs -t
```    

<br>

*4. show variables like '%char%'*

``` bash
 mqs -sv -v 'char'
 ```

<br>
<br>
<br>

### 0x02 记录操作 （Record Operations）  

*1. select id,name,pwd from users where id=4 or id=5 order by 1 limit 1*
``` bash
mqs -t users -sr -c id,name,pwd -w 'id=4 or id=5 order by 1 limit 1'
```   

<br>

*2. update users set name='test' where id = 1*  
``` bash
mqs -t users -ur -v "name='test'" -w id=1 -y
```
**remark: -y is say yes to make sure you want to do it**

<br>

*3. delete from users*
``` bash
mqs -t users -dr -w 1=1 -y
```
**remark: -w is necessary， if you want to delete all data, set -w 1=1** 

<br>

*4. insert into users(id,name) values(1,'khazix')*

``` bash
mqs -t users -ir -c id,name -v "1,'khazix'" -y
 ```

<br>

