## 新手使用git创建本地和远程仓库

此文仅供第一次使用git创建项目是小白参考！！！

以下每个命令基本都做了备注，也是当初自己对使用git创建项目时的一些疑惑，希望能有所帮助。。。

#### 1、安装git
确保你的电脑已经安装了git，如果没有安装，去[git官网](https://git-scm.com/download)下载对应系统的git即可；

安装完成以后可以检测git是否安装成功

```js
git --version
// 如果查看到git的版本信息说明安装成功
// git version 2.20.1 (Apple Git-117)
```

#### 2、配置git的用户名和邮箱

```js
git config --global user.name “github’s Name”

git config --global user.email “github@xx.com”

// 配置完成后查看配置成功后的列表
git config --list

// 如果发现用户名和邮箱配置不对，可以使用以下命令进行修改
git config --global --replace-all user.name “github’s Name”

git config --global --replace-all user.email ‘github@xx.com’
```

#### 3、克隆远程仓库

```js
// 在终端中进入你想存放项目的文件夹，复制远程仓库名称，然后进行clone
git clone 远程仓库名称（https://github.com/xxx/xxx.git）
```
#### 4、创建本地分支
```js
// clone完成后你会在本地当前文件夹查看到拉下来的项目，当前分支一般为master分支

// 进入你的项目，比如项目名称叫my_progect，则输入命令 cd my_progect
cd "your project's name"  

// 创建本地分支，一般分支名称以项目功能或者开发者的名字命名，比如你的分支名称叫emilia，git checkout -b emilia
// 执行完成会以当前master分支为母本创建emilia分支并且切换到分支emilia分支

git checkout -b '你想叫的本地分支名称'

```
#### 5、将本地分支和推送到远程并创建关联远程分支

```js
// 本地分支和远程分支关联起来，这样你执行git push命令的时候能够直接将你本地分支推送到映射的远程分支上
// 一般便于记忆远程分支名称和本地分支名称都是一样的，比如我们的远程分支也叫emilia，则输入命令:git push -u origin emilia

git push -u origin "远程分支名称"

// 执行完成后可以再远程查看到分支，也可以使用git名称查看当前所有分支
// 查看所有分支的命令 remotes/origin/master 这种是远程分支，* master这种是本地分支，前面的*号代表当前选中的本地分支
git branch -a

// 还可以查看当前本地分支和远程分支的关联关系
git branch -vv
// * master eb275aa [origin/master] add:add 
// *意思是当前选中的本地分支是master
// eb275aa为最新一次提交的版本号
// [origin/master] 为本地master分支和远程[origin/master]是追踪关系
// add:add 意思是最新一次提交的备注信息
```

后续补充git 提交（commit）、同步远程代码、stash（缓存）相关命令
