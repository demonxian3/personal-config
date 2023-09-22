# git-lazy-command
git 懒人命令

### linux shell 复制下面命令粘贴回车即可导入，好用给个start

- 永久导入要写到 /etc/profile 最后面，然后 `source /etc/profile `

``` bash

alias ga="git add "
alias gaa="git add -A"
alias gac="function __tmp(){ git add -A; git commit -m \"\$*\"; unset -f __tmp; };__tmp"
alias gacp="function __tmp(){ git add -A; git commit -m \"\$*\"; git pull origin master; git push origin master; unset -f __tmp; };__tmp"
alias gb="git branch "
alias gbr="git branch -r "
alias gba="git branch -a "
alias gbd="git branch -d "
alias gbD="git branch -D "
alias gbdr="git push origin --delete "
alias gc="function __tmp(){ git commit -m \"\$*\"; unset -f __tmp; };__tmp"
alias gck="git checkout "
alias gcm="git commit -m 'fix'"
alias gd="git diff "
alias gl="git log --color --graph --no-merges --pretty=format:'%Cred%h%Creset %C(yellow)%d%Creset %s %Cgreen(%as) %C(bold blue) %an%Creset' --abbrev-commit"
# alias glm="git log --color --graph --pretty="%Cred%h%Creset %C(yellow)%d%Creset %s %Cgreen(%as) %C(bold blue) %an%Creset " --abbrev-commit"
alias gm="git merge "
alias go="git config "
alias gp="git push "
alias gpm="git push origin master"
alias gq="git pull "
alias gqm="git pull origin master"
alias grm="git reset --mixed "
alias grs="git reset --soft "
alias grh="git reset --hard "
alias gs="git status"
```


### 简易说明

使用帮助看alias的值应该可以猜得出来，此处简单列举几个用法 

- 提交

``` bash 
gc 这里 是commit注释 的内容 可以 用空格分开
```

- 一键提交

相当于 git add -A && git commit -m '${*}' && git pull origin master && git push origin master 

```bash
gacp 一键打包 上传
```

- 开启色彩

``` bash
go --global color.ui true
```

- 查看和删除远程分支

``` bash 
gbr 
gbdr dev
```

- 撤销到工作目录( git add 之前 )

``` bash
gck -- .
```

- 撤销到工作目录( git add 之前)

``` bash
grm HEAD
```

- 撤销到暂存区( git commit 之前)

``` bash 
grs HEAD^
```

- 撤销到上一个版本 (修改的文件全部还原)

``` 
grh HEAD^
```

- 廖氏花里胡哨

```
gl
```

![](https://static.liaoxuefeng.com/files/attachments/919059728302912/0)
